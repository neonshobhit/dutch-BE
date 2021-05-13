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
                [_b.userId]: 0
            }
        },
        members: [{
            userId: _b.userId,
            name: _b.userName,
            isGuest: false
        }],
        Activties:[]
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
            [_b.memberId]: 0
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

exports.addTransaction = async (req, res) => {
    // 1st assign a reference to the document
    // run a DB transaction (See addMembers function)
    // take graph
    // Use consructor to parse it, and store ids and indices
    // Call the dutch function
    // Pass the graph to Balance simplication
    // Convert indices to original IDs
    // update the graph


    // We'll be updating values- total dues, receivables etc at few more locations, but that's some time later.
}

exports.getDuesSummary = async (req, res) => {
    const _b = req.body
    const ref = db.collection('events').doc(_b.eventId)

    return {
        statusCode: 200,
        graph: (await ref.get()).data().graph
    }
    
}

//Add Message Activity
exports.addMessageActivity = async (req,res) => {
    let { eventId,userId,newMesssage } = req.body;

    let event = await db.collection("events").doc(eventId);
    let eventInfo = (await event.get()).data();

    let user = await db.collection("users").doc(userId);
    let userInfo = (await user.get()).data();

    let out;
    try{
        if(!userInfo){
            throw new Error("UserId is InValid");
        }
        if(!eventInfo){
            throw new Error("Event id Invalud");
        }
        if(eventInfo.activity){ 
            await event.update({
                    activity:[{userInfo,activityType:"message",text:newMesssage},...eventInfo.activity],
                }).then(data => {
                    out = {
                        statusCode:200,
                        data
                    }
                }).catch(err => {
                    out = {
                        statusCode:500,
                        error:"Server Error"
                    }
                })
        }else{
            await event.update({
                    activity:[{userInfo,activityType:"message",text:newMesssage}],
                }).then(data => {
                    out = {
                        statusCode:200,
                        data
                    }
                }).catch(err => {
                    out = {
                        statusCode:500,
                        error:"Server Error"
                    }
                });
        }
    }catch(err){
        return {
            statusCode:500,
            error:err
        }
    }
    return out;
}

exports.addBannerActivity = async (req,res) => {
    let { eventId,newMesssage } = req.body;

    let event = await db.collection("events").doc(eventId);
    let eventInfo = (await event.get()).data();

    let out;
    try{
        if(!eventInfo){
            throw new Error("Event id Invalud");
        }
        if(eventInfo.activity){ 
            await event.update({
                    activity:[{activityType:"Banner",text:newMesssage},...eventInfo.activity],
                }).then(data => {
                    out = {
                        statusCode:200,
                        data
                    }
                }).catch(err => {
                    out = {
                        statusCode:500,
                        error:"Server Error"
                    }
                })
        }else{
            await event.update({
                    activity:[{activityType:"Banner",text:newMesssage}],
                }).then(data => {
                    out = {
                        statusCode:200,
                        data
                    }
                }).catch(err => {
                    out = {
                        statusCode:500,
                        error:"Server Error"
                    }
                });
        }
    }catch(err){
        return {
            statusCode:500,
            error:err
        }
    }
    return out;
}
