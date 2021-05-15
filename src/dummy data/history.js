module.exports = {
    code: 'PR', // Payment Received. or PayR: Payment Recorded. or anything else.
    // It can help FE know what kind of record it is. Can be integers also. Need to document well about the meaning of each code.
    record: {
        id: "RecordId",
        title: "Title of that event. If null, FE will handle",
    },
    event: {
        id: "EventId",
        name: "Event Name",
    },
    payment : {
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
    share : {
        splitIn: [{
            id: "BdJNMMHPrDV4uBRt7y5t",
            name: "name"
        }, {
            id: "G-bf1ff89a-363e-48d4-9b04-38ba6bbac81d",
            name: "name"
        }],

        paidBy: [{
            id: "BdJNMMHPrDV4uBRt7y5t",
            name: "name",
            amount: 100
        }, {
            id: "G-bf1ff89a-363e-48d4-9b04-38ba6bbac81d",
            name: "name",
            amount: 200
        }]
    }
}