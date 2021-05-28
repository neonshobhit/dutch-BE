const {
    db,
    firebase
} = require('../config/firebase')
const minimizingPayments = require('../services/minimizePayments')
const updates=require('../services/updates')

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



exports.addTransaction = async (req, res) => {
    let tr = req.body;
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


        const batch = db.batch()
        let changes = minimizingPayments(eventInfo, entryData);

        let graphchanges = changes[0];
        let userchanges = changes[1];
        let finalgraph = changes[2];
        batch.create(recordRef, entryData) // 1
        updates.updateOwe(graphchanges, batch); // 3. Remaining to pass changes map
        updates.updateEventDoc(eventRef, batch, finalgraph) // 2., 5., 6. Remaining to pass data
        updates.updateUserDoc(userchanges, batch); // 4.


        // let recordId = await db.collection("events").doc(tr.event.id).collection("records").add(entryData);
        let a = await batch.commit();
        // console.log(a)
        return {
            statusCode: 200,
            data: a
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