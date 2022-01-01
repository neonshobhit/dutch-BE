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
// let preeti = 838931590;
// let sparshi = 1074202347;
// bot.sendMessage(sparshi, '')
// bot.sendMessage(preeti, 'Dekhhhhhhhhhhh');
// bot.sendMessage(swapnil, 'mil gya bhai, thanks')
// bot.sendMessage(riddhi, "discord pr bhi bna skta hu")
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

bot.onText(/\/getEvents/, (msg) => {
  bot.sendMessage(msg.chat.id, JSON.stringify(obj), {
    // reply_markup: {
    //   force_reply: true,
    // },
  });
});

bot.onText(/\/linkAccount/, async (msg) => {
  let opt = Telegram.generateMessage(Telegram.LINK_ACCOUNT);
  const msgReply = await bot.sendMessage(msg.chat.id, opt[0], opt[1]);

  bot.onReplyToMessage(msg.chat.id, msgReply.message_id, async (email) => {
    const response = await controller.linkAccount(email.from, email.text.trim());
    if (!response.status) return bot.sendMessage(msg.chat.id, response.error);
    bot.sendMessage(msg.chat.id, "Success");
  });
});

bot.onText(/\/myLinkedEmail/, async (msg) => {
  const resp = await controller.getLinkedAccount(msg.from);
  const reply = resp.status ? resp.account.email : resp.error;
  await controller.sendMessage(reply, msg.chat.id, Telegram.getString(Telegram.LINK_ACCOUNT), Telegram.getString(Telegram.ERROR_MSG));
  bot.sendMessage(msg.chat.id, reply);
});

bot.onText(/\/getProfile/, async (msg) => {
  bot.sendMessage(msg.chat.id, "Yet to do. Please stay tuned.");
});

bot.onText(/\/getFriendsDue/, async (msg) => {
  // Fetch list of friends.
  // Ask friends' name.
  // Show Dues
  bot.sendMessage(msg.chat.id, "Yet to do. Please stay tuned.");
});

// Send settlement notification
