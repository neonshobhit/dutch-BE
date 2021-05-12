const {
    db,
    firebase
} = require('../config/firebase')

const getref = (id) => {
    return db
        .collection('friends')
        .doc(id)
}

// They must be friends with each other.
// The function will fail if even 1 isn't a friend of other.
// 
exports.updateOwe = async (changes) => {
    const batch = db.batch()

    for (let i in changes) {
        let updater = {}
        for (let j in changes[i]) {
            updater[`${j}.owe`] = firebase.firestore.FieldValue.increment(changes[i][j])
            // updater[j] = firebase.firestore.FieldValue.increment(changes[i][j])
        }

        batch.update(getref(i), updater);
    }

    let x = await batch.commit();

    return {
        statusCode: 200,
        data: x
    }
}

exports.add = async (req, res) => {
    const _b = req.body

    let doc = await getref(_b.userId)
        .get()

    if (!doc.exists) {
        const batch = db.batch();

        batch.set(getref(_b.userId), {
            [_b.otherUserId]: {
                name: "Some  name",
                owe: 0
            }
        })
        batch.set(getref(_b.otherUserId), {
            [_b.userId]: {
                name: "Some name",
                owe: 0
            }
        })

        await batch.commit();

        return {
            statusCode: 200,
        }
    }

    if (!doc.data()[_b.otherUserId]) {

        const batch = db.batch();

        batch.update(getref(_b.userId), {
            [_b.otherUserId]: {
                isGuest: false,
                owe: 0
            }
        })
        batch.update(getref(_b.otherUserId), {
            [_b.userId]: {
                isGuest: false,
                owe: 0
            }
        })

        await batch.commit();

        return {
            statusCode: 200
        }
    }


    return {
        statusCode: 208,
        message: "Friend already added!",
    }
}