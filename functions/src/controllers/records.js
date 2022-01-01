/* eslint-disable guard-for-in */
const {
  db,
  firebase,
} = require("../config/firebase");
const minimizingPayments = require("../services/minimizePayments");

const calculateTotalAmount = (paidBy) => {
  const amount = paidBy.reduce((accum, element) => {
    return accum + element.amount;
  }, 0);
  return amount;
};

const calculateShare = (splitIn, eventInfo, tempAmount) => {
  let share = (eventInfo.stats && eventInfo.stats.share) ?
    eventInfo.stats.share : {};
  const splittedAmount = tempAmount / splitIn.length;
  if (share) {
    splitIn.map((element, index) => {
      if (element.id in share) {
        share[element.id] += splittedAmount;
      } else {
        share[element.id] = splittedAmount;
      }
    });
  } else {
    share = {};
    for (let i = 0; i < splitIn.length; i++) {
      share[splitIn[i].id] = splittedAmount;
    }
  }
  return share;
};

// eslint-disable-next-line no-unused-vars
const addShareAndBudget = async (tr, eventInfo, event) => {
  const tempAmount = calculateTotalAmount(tr.share.paidBy);
  const share = calculateShare(tr.share.splitIn, eventInfo, tempAmount);

  if (eventInfo.stats && eventInfo.stats.budget) {
    await event.update({
        stats: {
          budget: eventInfo.stats.budget,
          expenditure: ((eventInfo.stats.expenditure) ?
            (eventInfo.stats.expenditure) :
            0) + tempAmount,
          share,
        },
      }).then((data) => {})
      .catch((err) => console.log(err));
  } else {
    await event.update({
      stats: {
        budget: 10000,
        expenditure: 0 + tempAmount,
        share,
      },
    });
  }
};

const updateOwe = (changes, batch) => {
  const getref = (i) => db.collection("friends").doc(i);
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
};

const updateEventDoc = (eventRef, batch, finalgraph) => {
  batch.update(eventRef, {
    graph: finalgraph,
    stats: {
      expenditure: firebase.firestore.FieldValue.increment(0),
      share: {
        "a": firebase.firestore.FieldValue.increment(0),
      },
    },
  });
};

const updateUserDoc = (changes, batch) => {
  const getref = (i) => db.collection("users").doc(i);
  for (const i in changes) {
    if (changes[i] < 0) {
      batch.update(getref(i), {
        toReceive: firebase.firestore.FieldValue.increment(-changes[i]),
      });
    } else {
      batch.update(getref(i), {
        toPay: firebase
          .firestore
          .FieldValue
          .increment(changes[i]), // storing only +ve values
      });
    }
  }
};

exports.addTransaction = async (req, res) => {
  const tr = req.body;
  const eventRef = db.collection("events").doc(tr.event.id);
  const eventInfo = (await eventRef.get()).data();

  let out;
  try {
    if (!eventInfo) {
      throw new Error("Event id Invalid");
    }

    const entryData = {
      type: "transaction",
      event: {
        id: tr.event.id,
        name: tr.event.name,
      },
      share: tr.share,
      timestamp: new Date().getTime(),
      // payment: tr.payment,

    };
    // Targets:
    // 1. Write in records, that is message section.
    // 2. Update graph in event
    // 3. Write changes in friends payable/receivables
    // 4. Write in user profiles
    // 5. Increase total Expenditure
    // 6. Increase per involved user's share

    // Calculate total_transaction amount for the event.
    // await addShareAndBudget(tr,eventInfo,event);

    const recordRef = db
      .collection("events")
      .doc(tr.event.id)
      .collection("records").doc();


    const batch = db.batch();
    const changes = minimizingPayments(eventInfo, entryData);

    const graphchanges = changes[0];
    const userchanges = changes[1];
    const finalgraph = changes[2];
    batch.create(recordRef, entryData); // 1
    updateOwe(graphchanges, batch); // 3. Remaining to pass changes map
    updateEventDoc(eventRef, batch, finalgraph);
    // 2., 5., 6. Remaining to pass data
    updateUserDoc(userchanges, batch); // 4.


    // eslint-disable-next-line max-len
    // let recordId = await db.collection("events").doc(tr.event.id).collection("records").add(entryData);
    const a = await batch.commit();
    // console.log(a)
    return {
      statusCode: 200,
      data: a,
    };
  } catch (err) {
    console.log(err);
    out = {
      statusCode: 400,
      error: err.message,
    };
  }
  return out;
};


exports.addBannerActivity = async (req, res) => {
  const {
    eventId,
    newMesssage,
  } = req.body;

  const event = db.collection("events").doc(eventId);
  const eventInfo = (await event.get()).data();

  let out;
  try {
    if (!eventInfo) {
      throw new Error("Event id Invalid");
    }

    const entryData = {
      type: "banner",
      message: {
        message: newMesssage,
      },
      timestamp: new Date().getTime(),
    };
    const recordId = await db
      .collection("events")
      .doc(eventId)
      .collection("records")
      .add(entryData);
    out = {
      statusCode: 200,
      recordId: recordId.id,
      recordData: (await recordId.get()).data(),
    };
  } catch (err) {
    return {
      statusCode: 500,
      error: err,
    };
  }
  return out;
};

// Add Message Activity
exports.addMessageActivity = async (req, res) => {
  const {
    eventId,
    userId,
    newMesssage,
  } = req.body;

  const event = db.collection("events").doc(eventId);
  const eventInfo = (await event.get()).data();

  const user = db.collection("users").doc(userId);
  const userInfo = (await user.get()).data();

  let out;
  try {
    if (!userInfo) {
      throw new Error("UserId is InValid");
    }
    if (!eventInfo) {
      throw new Error("Event id Invalid");
    }

    const entryData = {
      type: "message",
      message: {
        sender: {
          id: userId,
          email: userInfo.email,
        },
        message: newMesssage,
      },
      timestamp: new Date().getTime(),
    };

    const recordId = await db
      .collection("events")
      .doc(eventId)
      .collection("records")
      .add(entryData);
    out = {
      statusCode: 200,
      recordId: recordId.id,
      recordData: (await recordId.get()).data(),
    };
  } catch (err) {
    out = {
      statusCode: 400,
      error: err,
    };
  }
  return out;
};

// Settlement Activity 
exports.addSettlementActivity = async (req, res) => {
  try {
    let userId = req.user.userId ? req.user.userId : "";

    if (userId === "") {
      userId = req.user.id ? req.user.id : "";
    }

    const {
      eventId,
      ammount,
      otherEmail,
    } = req.body;
    const event = db.collection("events").doc(eventId);
    const eventInfo = (await event.get()).data();

    if (!eventInfo) {
      throw Error("Invalid Event");
    }

    const snapshot = await db
      .collection("users")
      .where("email", "==", otherEmail)
      .get();
    if (snapshot.empty) {
      return {
        statusCode: 401,
        message: "Friend is not Found.",
      };
    }
    let otherUserId;
    snapshot.forEach((e) => otherUserId = e.id);

    const entryData = {
      type: "settlement",
      from: userId,
      to: otherUserId,
      ammount,
      timestamp: new Date().getTime(),
    };

    const recordId = await db
      .collection("events")
      .doc(eventId)
      .collection("records")
      .add(entryData);

    return {
      statusCode: 200,
      message: "Added Settlement.",
    };
  } catch (err) {
    return {
      statusCode: 501,
      error: err.message,
    };
  }
};

exports.fetchRecords = async (req, res) => {
  try {
    const {
      eventId,
      limit,
      offset,
      timestamp,
    } = req.body;

    const fetchedData = await db
      .collection("events")
      .doc(eventId)
      .collection("records")
      .orderBy("timestamp", "desc")
      .limit(limit)
      .offset(offset)
      .get();
    const data = [];
    for (const x of fetchedData.docs) {
      data.push(x.data());
    }
    return {
      statusCode: 200,
      fetchedData: data,
    };
  } catch (err) {
    return {
      statusCode: 501,
      error: err.message,
    };
  }
};
