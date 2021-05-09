const {
    db
} = require('../config/firebase')

exports.create = async (req, res) => {
    const _b = req.body

    let ev = await db.collection('events').add({
        name: _b.name,
        imageURL: _b.imageURL,
        graph: {
            [_b.userId]: {
                [_b.userId]: 0
            }
        },
        members: {
            userId: _b.userId,
        },
    })

    let tr = await db.collection('events').doc(ev.id).collection('records').add({
        message: 'Event created',
        userId: null,
        tag: true,

    })

    return {
        statusCode: 200,
        data: (await ev.get())
    }
}

exports.addMembers = async (req, res) => {

}

exports.addTransaction = async (req, res) => {

}