const Records = require('../src/controllers/records')

describe("Various Event Activity Testing", () => {

    test("Message Activity is Added", () => {
        return Records.addMessageActivity({
            body: {
                eventId: "51W9qZrHxb6aEBIwmiDD",
                userId: "BdJNMMHPrDV4uBRt7y5t",
                newMesssage: "Added More Task to Complete"
            }
        }).then(data => {
            expect(data.statusCode).toBe(200);
        })
    })

    test("Banner Activity is Added", () => {
        return Records.addBannerActivity({
            body: {
                eventId: "51W9qZrHxb6aEBIwmiDD",
                newMesssage: "New User is Created"
            }
        }).then(data => {
            expect(data.statusCode).toBe(200);
        })
    })


    let tr = {
        event: {
            id: "51W9qZrHxb6aEBIwmiDD",
            name: "Trip to Nainital"
        },
        payment: {
            from: {
                id: "BdJNMMHPrDV4uBRt7y5t",
                name: "shobhit"
            },
            to: {
                id: "G-2121341e-c762-4808-ae08-3154aa477fed",
                name: "Mr Guest wala",
            },
            amount: 1000
        },

        share: {
            splitIn: [{
                id: "BdJNMMHPrDV4uBRt7y5t",
                name: "shobhit"
            }, {
                id: "G-2121341e-c762-4808-ae08-3154aa477fed",
                name: "Mr Guest wala"
            }],

            paidBy: [{
                id: "BdJNMMHPrDV4uBRt7y5t",
                name: "shobhit",
                amount: 1000
            }]
        }
    };

    test("Transaction Activity is Added", () => {
        return Records.addTransaction({
            body: tr
        }).then(data => {
            expect(data.statusCode).toBe(200);
        })
    })
})