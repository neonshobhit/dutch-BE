/* eslint-disable max-len */
const TelegramBot = require("node-telegram-bot-api");
const Telegram = require('../models/Telegram').Telegram;
const controller = require('../controllers/telegram');
const eventsController = require('../controllers/events');
const recordController = require('../controllers/records');

const token = require("../config/env").telegram.token;

const bot = new TelegramBot(token, {
  polling: true,
});

const startOrHelp = (msg) => {
  // console.log(msg);
  const opt = Telegram.generateMessage(Telegram.HELP_MESSAGE);
  bot.sendMessage(msg.chat.id, opt[0], opt[1]);
};

bot.onText(/\/start/, startOrHelp);
bot.onText(/\/help/, startOrHelp);

bot.onText(/\/addTransaction/, async (msg) => {
  const events = await controller.listEvents(msg.from);
  if (!events.status) return bot.sendMessage(msg.chat.id, events.error);
  const opt = Telegram.generateMessage(Telegram.ADD_TRANSACTION, {
    message_id: msg.message_id,
    events: events.events
  });
  const sentMessage = await bot.sendMessage(msg.chat.id, opt[0], opt[1]);
  await controller.storeMessage(sentMessage.text, sentMessage.message_id, sentMessage.chat.id, Telegram.getString(Telegram.ADD_TRANSACTION), Telegram.getString(Telegram.SELECT_EVENT));
});

bot.onText(/\/getEvents/, async (msg) => {
  const events = await controller.listEvents(msg.from);
  const opt = Telegram.generateMessage(Telegram.LIST_EVENTS, events);
  const sentMessage = await bot.sendMessage(msg.chat.id, opt[0], opt[1]);
  await controller.storeMessage(sentMessage.text, sentMessage.message_id, sentMessage.chat.id, Telegram.getString(Telegram.LIST_EVENTS), Telegram.getString(Telegram.SUCCESS));
});

bot.onText(/\/linkAccount/, async (msg) => {
  let opt = Telegram.generateMessage(Telegram.LINK_ACCOUNT);
  const response = await bot.sendMessage(msg.chat.id, opt[0], opt[1]);
  await controller.storeMessage(response.text, response.message_id, msg.chat.id, Telegram.getString(Telegram.LINK_ACCOUNT), Telegram.getString(Telegram.LINKING_EMAIL_ID));
});

bot.onText(/\/myLinkedEmail/, async (msg) => {
  const resp = await controller.getLinkedAccount(msg.from);
  const reply = resp.status ? resp.account.email : resp.error;
  const response = await bot.sendMessage(msg.chat.id, reply);
  await controller.storeMessage(response.text, response.message_id, msg.chat.id, Telegram.getString(Telegram.LINKING_EMAIL_ID), Telegram.getString(Telegram.SUCCESS));
});

bot.onText(/\/getProfile/, async (msg) => {
  const profile = await controller.getProfile(msg.from);
  const opt = Telegram.generateMessage(Telegram.GET_PROFILE, profile.account);
  const sentMessage = await bot.sendMessage(msg.chat.id, opt[0], opt[1]);
  await controller.storeMessage(sentMessage.text, sentMessage.message_id, sentMessage.chat.id, Telegram.getString(Telegram.GET_PROFILE), Telegram.getString(Telegram.SUCCESS));
});

bot.onText(/\/getFriendsDue/, async (msg) => {
  // Fetch list of friends.
  // Ask friends' name.
  // Show Dues
  bot.sendMessage(msg.chat.id, "Yet to do. Please stay tuned.");
});

// Send settlement notification

// Will get all texts. Need to identify what flow it is.
bot.on('text', async (msg) => {
  console.log(msg)
  const isCommand = /\/[a-z]+/.test(msg.text);
  const isGroup = msg.chat.type === 'supergroup';
  if (isGroup && !/@Dutchbebot/.test(msg.text)) return;
  if (isCommand) return;
  const isReply = msg.reply_to_message
  let lastMsg
  if (!isReply) {
    const last = await controller.getLastMessage(msg.chat.id);
    if (!last.status) return bot.sendMessage(msg.chat.id, last.error);
    lastMsg = last;
  } else {
    const notification = await controller.getSentMessage(msg);
    if (!notification.status) return bot.sendMessage(msg.chat.id, notification.error);
    lastMsg = notification;
  }

  lastMsg.msg.curFlow = Telegram.getWrapper(lastMsg.msg.curFlow);
  lastMsg.msg.nextFlow = Telegram.getWrapper(lastMsg.msg.nextFlow);

  let opt, params, curFlow, nextFlow, metadata = {
    ...lastMsg.msg.metadata
  };
  if (lastMsg.msg.nextFlow === Telegram.LINKING_EMAIL_ID) {
    const response = await controller.linkAccount(msg.from, msg.text.trim());
    if (!response.status) return bot.sendMessage(msg.chat.id, response.error);

    curFlow = Telegram.getString(lastMsg.msg.nextFlow)
    nextFlow = Telegram.getString(Telegram.SUCCESS);
  } else if (lastMsg.msg.nextFlow === Telegram.SELECT_EVENT) {
    msg.text = msg.text.replace("@Dutchbebot", "").trim();
    metadata.eventName = msg.text;
    const users = await controller.getUsers(msg);
    if (!users.status) return bot.sendMessage(msg.chat.id, users.error);
    metadata.eventId = users.event.eventId

    curFlow = Telegram.getString(lastMsg.msg.nextFlow);
    nextFlow = Telegram.getString(Telegram.ASK_PAID_BY);
    params = {
      message_id: msg.message_id,
      users: users.members
    }
  } else if (lastMsg.msg.nextFlow === Telegram.ASK_PAID_BY) {
    msg.text = msg.text.replace("@Dutchbebot", "").trim();
    metadata.user = msg.text;

    const user = await controller.getEventUser(metadata)
    if (!user.status) return bot.sendMessage(msg.chat.id, user.error);
    metadata.userId = user.user.userId

    params = {
      message_id: msg.message_id,
    }
    curFlow = Telegram.getString(lastMsg.msg.nextFlow);
    nextFlow = Telegram.getString(Telegram.GET_AMOUNT);
  } else if (lastMsg.msg.nextFlow === Telegram.GET_AMOUNT) {
    msg.text = msg.text.replace("@Dutchbebot", "").trim();
    let amount = new Number(msg.text);
    if (isNaN(amount)) return bot.sendMessage(msg.chat.id, 'Please send proper amount.')
    metadata.amount = amount;
    params = {
      message_id: msg.message_id,
      ...metadata,
    }

    curFlow = Telegram.getString(lastMsg.msg.nextFlow);
    nextFlow = Telegram.getString(Telegram.CONFIRM_PAYMENT);

  } else if (lastMsg.msg.nextFlow === Telegram.CONFIRM_PAYMENT) {
    const members = await eventsController.getMembersList({
      eventId: metadata.eventId
    })
    if (!members.status) return bot.sendMessage(msg.chat.id, 'Empty members list.')

    const body = {
      share: {
        paidBy: [{
          id: metadata.userId,
          amount: metadata.amount,
        }],
        splitIn: members.members.map(e => {
          return {
            id: e.userId
          }
        })
      },
      event: {
        id: metadata.eventId,
        name: metadata.eventName
      }
    }

    await recordController.addTransaction({
      body
    })

    curFlow = Telegram.getString(lastMsg.msg.nextFlow);
    nextFlow = Telegram.getString(Telegram.SUCCESS);

  } else {
    curFlow = Telegram.getString(lastMsg.msg.nextFlow);
    nextFlow = Telegram.getString(Telegram.ERROR_MSG);
  }

  opt = Telegram.generateMessage(lastMsg.msg.nextFlow, params);
  const response = await bot.sendMessage(msg.chat.id, opt[0], opt[1]);
  await controller.storeMessage(response.text, response.message_id, msg.chat.id, curFlow, nextFlow, metadata);
})
