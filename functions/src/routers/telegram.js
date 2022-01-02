/* eslint-disable max-len */
const TelegramBot = require("node-telegram-bot-api");
const Telegram = require('../models/Telegram').Telegram;
const controller = require('../controllers/telegram');

const token = require("../config/env").telegram.token;

const bot = new TelegramBot(token, {
  polling: true,
});

const obj = {
  "event1": [
    [{
      text: "user1",
      switch_inline_query_current_chat: "user1",
    }],
    [{
      text: "user2",
      switch_inline_query_current_chat: "user2",
    }],
  ],
  "event2": [
    [{
      text: "user1",
      switch_inline_query_current_chat: "user1",
    }],
    [{
      text: "user3",
      switch_inline_query_current_chat: "user3",
    }],
    [{
      text: "user4",
      switch_inline_query_current_chat: "user4",
    }],
    [{
      text: "user5",
      switch_inline_query_current_chat: "user5",
    }],
  ],
  "event3": [
    [{
      text: "user1",
      switch_inline_query_current_chat: "user1",
    }],
    [{
      text: "user2",
      switch_inline_query_current_chat: "user2",
    }],
    [{
      text: "user3",
      switch_inline_query_current_chat: "user3",
    }],
    [{
      text: "user4",
      switch_inline_query_current_chat: "user4",
    }],
  ],
  "event4": [
    [{
      text: "user1",
      switch_inline_query_current_chat: "user1",
    }],
    [{
      text: "user2",
      switch_inline_query_current_chat: "user2",
    }],
    [{
      text: "user5",
      switch_inline_query_current_chat: "user5",
    }],
    [{
      text: "user6",
      switch_inline_query_current_chat: "user6",
    }],
  ],
};

// eslint-disable-next-line prefer-const
let people = {};
// let riddhi = 1867755302;
// let swapnil = 1092983868;
// let testGroup = -750293094;

// let preeti = 838931590;
// let sparshi = 1074202347;
const startOrHelp = (msg) => {
  // console.log(msg);
  const opt = Telegram.generateMessage(Telegram.HELP_MESSAGE);
  bot.sendMessage(msg.chat.id, opt[0], opt[1]);
};

bot.onText(/\/start/, startOrHelp);
bot.onText(/\/help/, startOrHelp);

bot.onText(/\/addTransaction/, async (msg) => {
  const askEvent = await bot.sendMessage(msg.chat.id, "Please select event (Swipe and reply is must)", {
    "reply_markup": {
      force_reply: true,
      one_time_keyboard: true,
      // selective: true,
      inline_keyboard: [
        [{
          text: "event1",
          switch_inline_query_current_chat: "event1",
        }],
        [{
          text: "event2",
          switch_inline_query_current_chat: "event2",
        }],
        [{
          text: "event3",
          switch_inline_query_current_chat: "event3",
        }],
        [{
          text: "event4",
          switch_inline_query_current_chat: "event4",
        }],
      ],
      // keyboard: ,
    },
    "reply_to_message_id": msg.message_id,
  });


  bot.onReplyToMessage(msg.chat.id, askEvent.message_id, async (selectedEvent) => {
    selectedEvent.text = selectedEvent.text.replace("@Dutchbebot ", "");
    const askPaidBy = await bot.sendMessage(selectedEvent.chat.id, "Who Paid? (Swipe and reply is must)", {
      "reply_markup": {
        "force_reply": true,
        "one_time_keyboard": true,
        "selective": true,
        "keyboard": obj[selectedEvent.text],
      },
    });

    // eslint-disable-next-line max-len
    bot.onReplyToMessage(selectedEvent.chat.id, askPaidBy.message_id, async (PaidBy) => {
      PaidBy.text = PaidBy.text.replace("@DutchBeBot ", "");
      const askAmount = await bot.sendMessage(PaidBy.chat.id, "Amount? (Swipe and reply is must)", {
        "reply_markup": {
          force_reply: true,
          one_time_keyboard: true,
          selective: true,
        },
      });

      bot.onReplyToMessage(PaidBy.chat.id, askAmount.message_id, (amount) => {
        // eslint-disable-next-line max-len
        const msg = `Are you sure that ${PaidBy.text} paid ${amount.text} in ${selectedEvent.text}? (Swipe and reply is must)`;
        bot.sendMessage(PaidBy.chat.id, msg, {
          "reply_markup": {
            force_reply: true,
            one_time_keyboard: true,
            selective: true,
            keyboard: [
              ["Yes"],
              ["No"],
            ],
          },
        });
      });
    });
  });
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

  let opt, params, curFlow, nextFlow;
  if (lastMsg.msg.nextFlow === Telegram.LINKING_EMAIL_ID) {
    const response = await controller.linkAccount(msg.from, msg.text.trim());
    if (!response.status) return bot.sendMessage(msg.chat.id, response.error);

    curFlow = Telegram.getString(lastMsg.msg.nextFlow)
    nextFlow = Telegram.getString(Telegram.SUCCESS);
  } else {
    curFlow = Telegram.getString(lastMsg.msg.nextFlow);
    nextFlow = Telegram.getString(Telegram.ERROR_MSG);
  }



  opt = Telegram.generateMessage(lastMsg.msg.nextFlow, params);
  const response = await bot.sendMessage(msg.chat.id, opt[0], opt[1]);
  await controller.storeMessage(response.text, response.message_id, msg.chat.id, curFlow, nextFlow);
})
