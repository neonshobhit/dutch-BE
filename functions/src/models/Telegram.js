let helpMsg = 'HELP_MESSAGE',
  startMsg = 'START_MESAGE',
  selEv = 'SELECT_EVENT',
  linkAcc = 'LINK_ACCOUNT',
  errorMsg = 'ERROR_MESSAGE';

class Telegram {
  static HELP_MESSAGE = new Telegram(helpMsg);
  static START_MESSAGE = new Telegram(startMsg);
  static SELECT_EVENT = new Telegram(selEv);
  static LINK_ACCOUNT = new Telegram(linkAcc);
  static ERROR_MSG = new Telegram(errorMsg);

  constructor(name) {
    this.getString = name;
  }
  static getString(wrapper) {
    switch (wrapper) {
      case this.HELP_MESSAGE:
        return helpMsg;
      case this.START_MESSAGE:
        return startMsg;
      case this.SELECT_EVENT:
        return selEv;
      case this.LINK_ACCOUNT:
        return linkAcc;
      case this.ERROR_MSG:
        return errorMsg;
    }
  }
  static getWrapper(str) {
    switch (str) {
      case helpMsg:
        return this.HELP_MESSAGE;
      case startMsg:
        return this.START_MESSAGE;
      case selEv:
        return this.SELECT_EVENT;
      case linkAcc:
        return this.LINK_ACCOUNT;
      case errorMsg:
        return this.ERROR_MSG;
      default:
        throw new Error('wrapper not found');
    }
  }

  static generateMessage(wrapper, params) {
    switch (wrapper) {
      case this.HELP_MESSAGE: {
        let msg = ` From wrapper\n
          /addTransaction\n/linkAccount\n/myLinkedEmail\n/getEvents\n/linkAccount\n/myLinkedEmail\n/getProfile\n/getFriendsDue`
        let options = {
          entities: [{
            type: "email",
          }],
        }
        return [msg, options];
      }

      case this.START_MESSAGE: {
        let msg = `/addTransaction\n/linkAccount\n/myLinkedEmail\n/getEvents\n/linkAccount\n/myLinkedEmail\n/getProfile\n/getFriendsDue`
        let options = {
          entities: [{
            type: "email",
          }],
        }
        return [msg, options];
      }

      case this.SELECT_EVENT: {
        let msg = 'Please select event';
        let options = {
          "reply_markup": {
            force_reply: true,
            one_time_keyboard: true,
            inline_keyboard: [],
          },
          "reply_to_message_id": params.message_id,
        }

        params.events.forEach((value, index, arr) => {
          const opt = [{
            text: value.name,
            switch_inline_query_current_chat: value.name
          }]
          options.reply_markup.inline_keyboard.push(opt)
        })
        return [msg, options];
      }

      case this.LINK_ACCOUNT: {
        let msg = 'Email Id?';
        let options = {
          reply_markup: {
            force_reply: true,
          },
        };

        return [msg, options];
      }



      case this.ERROR_MSG: {
        let msg = `Retry Flow`;
        let options = {

        }

        return [msg, options];
      }
    };
  }
}

exports.Telegram = Telegram
