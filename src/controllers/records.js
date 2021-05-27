const {
    db,
    firebase
} = require('../config/firebase')

const Activity = require('../models/Activity')
const Balance = require('../models/Balance')

const calculateTotalAmount = (paidBy) => {
    let amount = paidBy.reduce((accum, element) => {
        return accum + element.amount
    }, 0)
    return amount;
}

const calculateShare = (splitIn, eventInfo, tempAmount) => {
    let share = (eventInfo.stats && eventInfo.stats.share) ? eventInfo.stats.share : {};
    let splittedAmount = tempAmount / splitIn.length;
    if (share) {
        splitIn.map((element, index) => {
            if (element.id in share) {
                share[element.id] += splittedAmount;
            } else {
                share[element.id] = splittedAmount;
            }
        })
    } else {
        share = {};
        for (let i = 0; i < splitIn.length; i++) {
            share[splitIn[i].id] = splittedAmount;
        }
    }
    return share;
}

const addShareAndBudget = async (tr, eventInfo, event) => {
    let tempAmount = calculateTotalAmount(tr.share.paidBy);
    let share = calculateShare(tr.share.splitIn, eventInfo, tempAmount);

    if (eventInfo.stats && eventInfo.stats.budget) {
        await event.update({
                stats: {
                    budget: eventInfo.stats.budget,
                    expenditure: ((eventInfo.stats.expenditure) ? (eventInfo.stats.expenditure) : 0) + tempAmount,
                    share
                }
            }).then(data => {})
            .catch(err => console.log(err));
    } else {
        await event.update({
            stats: {
                budget: 10000,
                expenditure: 0 + tempAmount,
                share
            }
        })
    }
}

const updateOwe = (changes, batch) => {
    console.log(changes);
    let getref = (i) => db.collection('friends').doc(i)
    for (let i in changes) {
        let updater = {}

        for (let j in changes[i]) {
            // console.log(changes[i][j]);
            updater[`${j}.owe`] = firebase.firestore.FieldValue.increment(changes[i][j])
        }
        console.log(updater);
        batch.update(getref(i), updater);
    }
}

const updateEventDoc = (eventRef, batch, finalgraph) => {
    batch.update(eventRef, {
        graph: finalgraph,
        stats: {
            expenditure: firebase.firestore.FieldValue.increment(0),
            share: {
                "a": firebase.firestore.FieldValue.increment(0),
            }
        }
    })
}

const updateUserDoc = (changes, batch) => {
    let getref = (i) => db.collection('users').doc(i)
    for (let i in changes) {
        if (changes[i] > 0) {
            batch.update(getref(i), {
                toReceive: firebase.firestore.FieldValue.increment(changes[i]),
            })
        } else {
            batch.update(getref(i), {
                toPay: firebase.firestore.FieldValue.increment(-changes[i]), // storing only +ve values
            })
        }
    }
}

exports.addTransaction = async (req, res) => {
    let tr = req.body;
    console.log(tr)
    let eventRef = db.collection("events").doc(tr.event.id);
    let eventInfo = (await eventRef.get()).data();

    let out;
    try {
        if (!eventInfo)
            throw new Error("Event id Invalid");

        let entryData = {
            type: "transaction",
            event: {
                id: tr.event.id,
                name: tr.event.name
            },
            share: tr.share
            //payment: tr.payment,

        };
        // Targets:
        // 1. Write in records, that is message section.
        // 2. Update graph in event
        // 3. Write changes in friends payable/receivables
        // 4. Write in user profiles
        // 5. Increase total Expenditure
        // 6. Increase per involved user's share

        // Calculate total_transaction amount for the event.
        //await addShareAndBudget(tr,eventInfo,event);

        const recordRef = db.collection("events").doc(tr.event.id).collection("records").doc()
        //console.log(eventInfo);
        //console.log(entryData);

        const batch = db.batch()
        let changes = calling(eventInfo, entryData);
        let graphchanges = changes[0];
        let userchanges = changes[1];
        let finalgraph = changes[2];
        batch.create(recordRef, entryData) // 1
        updateOwe(graphchanges, batch); // 3. Remaining to pass changes map
        updateEventDoc(eventRef, batch, finalgraph) // 2., 5., 6. Remaining to pass data
        updateUserDoc(userchanges, batch); // 4.

        // let recordId = await db.collection("events").doc(tr.event.id).collection("records").add(entryData);
        let a = await batch.commit();
        console.log(a)
        return {
            statusCode: 200,
            id: recordRef,
            data: entryData
        }
    } catch (err) {
        console.log(err)
        out = {
            statusCode: 400,
            error: err.message
        }
    }
    return out;
}

function calling(eventInfo, entryData) {
    let Activityobject = new Activity(eventInfo.members, eventInfo.graph);

    let oldgraph = Activityobject.getoldgraph();

    Activityobject.dutch(entryData.share);
    let newgraph = Activityobject.getoldgraph();

    let Balanceobject = new Balance(newgraph);
    newgraph = Balanceobject.simplify();

    let graphchange = Activityobject.calculatechanges(oldgraph, newgraph);

    let userchange = Activityobject.userchanges();

    let newmap = Activityobject.convertToMap(newgraph);
    return [graphchange, userchange, newmap];
}

exports.addBannerActivity = async (req, res) => {
    let {
        eventId,
        newMesssage
    } = req.body;

    let event = db.collection("events").doc(eventId);
    let eventInfo = (await event.get()).data();

    let out;
    try {
        if (!eventInfo) {
            throw new Error("Event id Invalid");
        }

        let entryData = {
            type: "banner",
            message: {
                message: newMesssage
            }
        }
        let recordId = await db.collection("events").doc(eventId).collection("records").add(entryData);
        out = {
            statusCode: 200,
            recordId: recordId.id,
            recordData: (await recordId.get()).data()
        }
    } catch (err) {
        return {
            statusCode: 500,
            error: err
        }
    }
    return out;
}

//Add Message Activity
exports.addMessageActivity = async (req, res) => {
    let {
        eventId,
        userId,
        newMesssage
    } = req.body;

    let event = db.collection("events").doc(eventId);
    let eventInfo = (await event.get()).data();

    let user = db.collection("users").doc(userId);
    let userInfo = (await user.get()).data();

    let out;
    try {
        if (!userInfo) {
            throw new Error("UserId is InValid");
        }
        if (!eventInfo) {
            throw new Error("Event id Invalid");
        }

        let entryData = {
            type: "message",
            message: {
                sender: {
                    id: userId,
                    email: userInfo.email
                },
                message: newMesssage
            }
        }

        let recordId = await db.collection("events").doc(eventId).collection("records").add(entryData);
        out = {
            statusCode: 200,
            recordId: recordId.id,
            recordData: (await recordId.get()).data()
        }
    } catch (err) {
        out = {
            statusCode: 400,
            error: err
        }
    }
    return out;
}