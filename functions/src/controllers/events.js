const {
  db,
} = require("../config/firebase");

exports.create = async (req, res) => {
  const _b = req.body;

  const ev = await db.collection("events").add({
    name: _b.name,
    simplify: _b.simplify,
    imageURL: _b.imageURL,
    /*
        This graph means, for now, only one user is in the group.
        And hence, total due amount with that user is 0.
        */
    graph: {
      // [_b.userId]: {
      // [_b.userId]: 0
      // }
    },
    members: [{
      userId: _b.userId,
      name: _b.userName,
      isGuest: false,
    }],
  });

  await db.collection('users')
    .doc(_b.userId)
    .collection('events')
    .doc(ev.id)
    .set({
      name: _b.name,
      imageURL: _b.imageURL,
      eventId: ev.id,
    })

  await db.collection("events")
    .doc(ev.id)
    .collection("records")
    .add({
      message: "Event created",
      type: 'TAG',
      userId: null,
      tag: true,
      timestamp: new Date().getTime()
    });

  return {
    statusCode: 200,
    eventId: ev.id,
    data: (await ev.get()).data(),
  };
};

exports.addMembers = async (req, res) => {
  const _b = req.body;
  const ref = db.collection("events").doc(_b.eventId);
  // ref must be declared outside of transaction.

  // Adding member to the member list.
  // Also updating the graph by initializing due amount to be 0 to each other.
  const members = await db.runTransaction(async (t) => {
    const old = (await t.get(ref)).data(); // read from transaction
    // console.log(oldList)
    const newList = [...old.members, {
      userId: _b.memberId,
      name: _b.memberName,
      isGuest: _b.isGuest,
    }];

    // let graph = old.graph
    // let noDueMap = {
    //     // [_b.memberId]: 0
    // }

    // for (let x in graph) {
    //     graph[x][_b.memberId] = 0
    //     noDueMap[x] = 0;
    // }

    // graph[_b.memberId] = noDueMap

    // updating on transaction
    t.update(ref, {
      members: newList,
      // graph: graph
    });

    return newList;
  });

  // console.log(members)
  return {
    members,
    statusCode: 200,
  };
};


exports.getDuesSummary = async (_b) => {
  const ref = db.collection("events").doc(_b.eventId);

  return {
    statusCode: 200,
    graph: (await ref.get()).data().graph,
  };
};


exports.getMembersList = async (_b) => {
  const ref = db.collection("events").doc(_b.eventId);

  return {
    statusCode: 200,
    status: true,
    members: (await ref.get()).data().members,
  };
};

exports.display = async (req, res) => {
  const _b = req.body;
  const ref = db.collection("events").doc(_b.eventId);

  return {
    statusCode: 200,
    data: (await ref.get()).data(),
  };
};
