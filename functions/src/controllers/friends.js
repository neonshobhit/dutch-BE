/* eslint-disable guard-for-in */
const {
  db,
  firebase,
} = require("../config/firebase");

const getref = (id) => {
  return db
    .collection("friends")
    .doc(id);
};


exports.updateOwe = async (changes) => {
  const batch = db.batch();

  for (const i in changes) {
    const updater = {};

    for (const j in changes[i]) {
      updater[`${j}.owe`] = firebase
        .firestore
        .FieldValue
        .increment(changes[i][j]);
    }

    batch.update(getref(i), updater);
  }

  const x = await batch.commit();

  return {
    statusCode: 200,
    data: x,
  };
};

exports.add = async (req, res) => {
  const _b = req.body;

  const doc = await getref(_b.userId)
    .get();
    // This doc will exist, even if empty... because we are initializing
  if (!doc.data()[_b.otherUserId] || !doc.data()[_b.otherUserId].isFriend) {
    const batch = db.batch();

    const updater = (userId, otherUserId, otherUserName) => {
      const up = {

      };
      up[`${otherUserId}.isFriend`] = true;
      up[`${otherUserId}.name`] = otherUserName;

      return [getref(userId), up];
    };


    batch.update(...updater(_b.userId, _b.otherUserId, _b.otherUserName));
    batch.update(...updater(_b.otherUserId, _b.userId, _b.userName));

    await batch.commit();

    return {
      statusCode: 200,
    };
  }


  return {
    statusCode: 208,
    message: "Friend already added!",
  };
};

exports.list = async (req, res) => {
  const _b = req.body;

  const doc = (await db.collection("friends").doc(_b.userId).get()).data();

  const friends = [];

  for (const i in doc) {
    const toPush = {
      ...doc[i],
      id: i,
    };

    delete toPush.isFriend;
    if (doc[i].isFriend) friends.push(toPush);
  }

  return {
    statusCode: 200,
    friends,
  };
};
