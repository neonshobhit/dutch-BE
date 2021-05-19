exports.transaction = {
    splitIn: ['userId1', 'userId2', 'userId3'],
    contribution: [{
        paidBy: 'userId1',
        amount: 100
    }, {
        paidBy: 'userId2',
        amount: 10
    }]
}

exports.owe = {
    a: {
        b: 10,
        c: 11,
        e: 12,
    },
    b: {
        a: -10,
        c: 12,
        e: 13
    },
    c: {
        a: -11,
        b: -12,
        e: 14,
    }, 
    d: {
        a: -12,
        b: -13,
        c: -14
    }
}

exports.updateOwe = {
    "id1": {
        "id2": 10,
        "id3": 20,
    },
    "id2": {
        "id1": -10,
    }, 
    "id3": {
        "id1": -20
    }
}