const {
    db
} = require('../config/firebase')

exports.add = async (req, res) => {
    let snapshot = await db.collection('users').where('email', '==', req.body.email).get();

    if (snapshot.empty) {
        let newUser = await db.collection('users').add({
            email: req.body.email
        })

        return {
            statusCode: 200,
            newUser: (await newUser.get()).data(),
            id: newUser.id
        }

    } else {
        let id
        snapshot.forEach(e => id = e.id)
        return {
            id,
            statusCode: 403,
            error: "Email Id already exists"
        }
    }
}

exports.addFriend = async (req, res) => {
    const _b = req.body

    let out
    await db.collection('users').doc(_b.userId).collection('friends').doc(_b.otherUser).set({
            registered: true,
        })
        .then(snap => {
            snap.id
            out = {
                statusCode: 200,
            }
        })
        .catch(err => {
            out = {
                statusCode: 400,
                error: err.message
            }
        })

    return out
}

exports.fetchFriends = async (req, res) => {
    const userId = req.userId

    let out = new Object()
    await db.collection('users').doc(userId).collection('friends').get()
        .then(snap => {
            out.statusCode = 200
            out.data = []
            snap.forEach(e => {
                out.data.push({
                    [e.id]: e.data()
                })
            })
        })
        .catch(err => {
            out.statusCode = 400;
            out.error = err.message
        })
    log(out)

    return out
}