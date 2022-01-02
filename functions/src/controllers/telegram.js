const {
  db,
} = require("../config/firebase");
const Telegram = require('../models/Telegram').Telegram;

class Notification {
  constructor(curFlow, nextFlow, msg, id, notConversation) {
    this.msgId = id
    this.curFlow = curFlow;
    this.nextFlow = nextFlow;
    this.curMessage = msg;
    this.isConversation = !notConversation; // if its undefined, it must be true
    this.timestamp = new Date().getTime();
  }
}

exports.storeMessage = async (msg, msgId, id, curFLow, nextFlow) => {
  let entry = new Notification(curFLow, nextFlow, msg, msgId);
  entry = JSON.parse(JSON.stringify(entry));
  await db.collection('telegram').doc(id + '').collection('notifications').add(entry);
};

exports.getLastMessage = async id => {
  const lastMessage = await db.collection('telegram').doc(id + '').collection('notifications').limit(1).orderBy('timestamp', 'desc').get();
  if (lastMessage.empty) {
    return {
      status: false,
      error: 'NO_PREVIOUS_MESSAGE_FOUND'
    }
  }
  let msg = undefined;
  lastMessage.forEach((e) => msg = {
    ...e.data(),
    id: e.id
  });

  return {
    status: true,
    msg: msg
  };
}

exports.linkAccount = async (from, email) => {
  email = email.toLowerCase();
  const account = await db.collection('telegram').doc(from.id + '').get()
  if (account.exists)
    return {
      status: false,
      error: 'ACCOUNT_ALREADY_LINKED',
      emailId: account.data().email
    }

  const snapshot = await db
    .collection("users")
    .where("email", "==", email)
    .get();

  if (snapshot.empty)
    return {
      status: false,
      error: 'EMAIL_ID_IS_NOT_REGISTERED',
    }

  // todo: verify totp before linking account
  // todo: batch write
  let id = undefined;
  snapshot.forEach((e) => id = e.id);
  await db.collection('telegram').doc(from.id + '').set({
    email: email,
    isBot: from.is_bot,
    firstName: from.first_name,
    lastName: from.last_name,
    username: from.username,
    languageCode: from.language_code,
    userId: id
  });

  await db.collection('users').doc(id).update({
    telegramId: from.id
  });

  return {
    status: true,
  }
}

exports.getLinkedAccount = async (from) => {
  const account = await db.collection('telegram').doc(from.id + '').get()
  if (account.exists) {
    let accountDetails = account.data();
    const user = await db.collection('users').doc(accountDetails.userId).get()
    if (user.exists) {
      return {
        status: true,
        account: user.data(),
      };
    }

    return {
      status: false,
      error: 'USER_DOES_NOT_EXIST'
    }
  }
  return {
    status: false,
    error: 'ACCOUNT_NOT_LINKED'
  }
}

exports.getProfile = async (from) => {
  const account = await db.collection('telegram').doc(from.id + '').get()
  if (account.exists) {
    let accountDetails = account.data();
    const user = await db.collection('users').doc(accountDetails.userId).get()
    if (user.exists) {
      return {
        status: true,
        account: user.data(),
      };
    }

    return {
      status: false,
      error: 'ACCOUNT_LINKED_TO_UNKNOWN_USER'
    }
  }

  return {
    status: false,
    error: 'ACCOUNT_NOT_LINKED'
  }
}

exports.getSentMessage = async (msg) => {
  const notification = await db.collection('telegram').doc(msg.chat.id + '').collection('notifications').where('msgId', '==', msg.reply_to_message.message_id).get();
  if (notification.empty) {
    return {
      status: false,
      error: 'SENT_MESSAGE_NOT_FOUND'
    }
  }

  let noti = undefined;
  notification.forEach((e) => noti = e.data());

  return {
    status: true,
    msg: noti
  }
}

exports.listEvents = async (from) => {
  const account = await db.collection('telegram').doc(from.id + '').get()
  if (account.exists) {
    let accountDetails = account.data();
    const events = await db.collection('users').doc(accountDetails.userId).collection('events').get()
    if (!events.empty) {
      return {
        status: true,
        events: events.docs.map(e => e.data()),
      };
    }

    return {
      status: false,
      error: 'NO_EVENTS'
    }
  }

  return {
    status: false,
    error: 'ACCOUNT_NOT_LINKED'
  }
}
