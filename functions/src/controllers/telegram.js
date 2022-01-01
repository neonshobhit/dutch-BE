const {
  db,
} = require("../config/firebase");
const Telegram = require('../models/Telegram').Telegram;

class Notification {
  constructor(curFLow, nextFlow, msg) {
    this.curFLow = curFLow;
    this.nextFlow = nextFlow;
    this.curMessage = msg;
    this.timestamp = new Date().getTime();
  }
}

exports.sendMessage = async (msg, id, curFLow, nextFlow) => {
  let entry = new Notification(curFLow, nextFlow, msg);
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

  return msg;
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
