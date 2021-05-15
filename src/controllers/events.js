const {
    db
} = require('../config/firebase')

exports.create = async (req, res) => {
    const _b = req.body

    let ev = await db.collection('events').add({
        name: _b.name,
        simplify: _b.simplify,
        imageURL: _b.imageURL,
        /*
            This graph means, for now, only one user is in the group. And hence, total due amount with that user is 0.
        */
        graph: {
            [_b.userId]: {
                // [_b.userId]: 0
            }
        },
        members: [{
            userId: _b.userId,
            name: _b.userName,
            isGuest: false
        }],
        Activties: []
    })

    let tr = await db.collection('events').doc(ev.id).collection('records').add({
        message: 'Event created',
        userId: null,
        tag: true,
    })

    return {
        statusCode: 200,
        eventId: ev.id,
        data: (await ev.get()).data()
    }
}


exports.addMembers = async (req, res) => {
    const _b = req.body
    const ref = db.collection('events').doc(_b.eventId) // ref must be declared outside of transaction.

    // Adding member to the member list. Also updating the graph by initializing due amount to be 0 to each other.
    const members = await db.runTransaction(async t => {

        let old = (await t.get(ref)).data() // read from transaction
        // console.log(oldList)
        let newList = [...old.members, {
            userId: _b.memberId,
            name: _b.memberName,
            isGuest: _b.isGuest
        }]

        let graph = old.graph
        let noDueMap = {
            // [_b.memberId]: 0
        }

        for (let x in graph) {
            graph[x][_b.memberId] = 0
            noDueMap[x] = 0;
        }

        graph[_b.memberId] = noDueMap

        // updating on transaction
        t.update(ref, {
            members: newList,
            graph: graph
        })

        return newList

    })

    // console.log(members)
    return {
        members,
        statusCode: 200,
    }

}


exports.getDuesSummary = async (req, res) => {
    const _b = req.body
    const ref = db.collection('events').doc(_b.eventId)

    return {
        statusCode: 200,
        graph: (await ref.get()).data().graph
    }

}

exports.getMembersList = async (req, res) => {
    const _b = req.body
    const ref = db.collection('events').doc(_b.eventId)

    return {
        statusCode: 200,
        memebrs: (await ref.get()).data().members
    }
}

exports.display = async (req, res) => {
    const _b = req.body
    const ref = db.collection('events').doc(_b.eventId)

    return {
        statusCode: 200,
        data: (await ref.get()).data()
    }
}