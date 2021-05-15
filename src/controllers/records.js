const {
    db
} = require('../config/firebase')


exports.addTransaction = async (req, res) => {
    let tr = req.body;
    let event = db.collection("events").doc(tr.event.id);
    let eventInfo = (await event.get()).data();

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
            payment: tr.payment,
            share: tr.share
        };

        // Targets:
        // 1. Write in records, that is message section.
        // 2. Update graph in event
        // 3. Write changes in friends payable/receivables
        // 4. Write in user profiles

        const recordRef = db.collection("events").doc(tr.event.id).collection("records").doc()
        const eventRef = db.collection("events").doc(tr.event.id)


        const batch = db.batch()

        batch.create(recordRef, entryData)

        // let recordId = await db.collection("events").doc(tr.event.id).collection("records").add(entryData);

        return {
            statusCode: 200,
            id: recordRef,
            data: entryData
        }
    } catch (err) {
        out = {
            statusCode: 400,
            error: err
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