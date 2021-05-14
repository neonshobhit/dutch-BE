module.exports = {
    code: 'PR', // Payment Received. or PayR: Payment Recorded. or anything else.
    // It can help FE know what kind ofrecord it is. Can be integers also. Need to document well about the meaning of each code.
    record: {
        id: "RecordId",
        title: "Title of that event. If null, FE will handle",
    },
    payment ? : {
        from: {
            id: "fromUserId",
            name: "Some name"
        },
        to: {
            id: "toUserId",
            name: "Some name",
        },
        amount: 1000
    },
    share ? : {
        splitIn: [{
            id: "userid",
            name: "name"
        }, {
            id: "user2Id",
            name: "nameee"
        }],

        paidBy: [{
            id: "user1id",
            name: "name",
            amount: 200
        }, {
            id: "user2id",
            name: "name",
            amount: 200
        }]
    }
}