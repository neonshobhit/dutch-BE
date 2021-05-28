const {
    db,
    firebase
} = require('../config/firebase')


exports.updateOwe = (changes, batch) => {
    let getref = (i) => db.collection('friends').doc(i)
    for (let i in changes) {
        let updater = {}

        for (let j in changes[i]) {
            updater[`${j}.owe`] = firebase.firestore.FieldValue.increment(changes[i][j])
        }
        batch.update(getref(i), updater);
    }
}

exports.updateEventDoc = (eventRef, batch, finalgraph) => {
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

exports.updateUserDoc = (changes, batch) => {
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