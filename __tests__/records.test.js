const Records = require('./../functions/src/controllers/records')

test("In Records test 2+2", () => {
    expect(2 + 2).toBe(4);
})

// describe("Various Event Activity Testing", () => {
//     test("Message Activity is Added", () => {
//         return Records.addMessageActivity({
//             body: {
//                 eventId: "NjB4sI9EkAwvBqtDJCbV",
//                 userId: "iquRnzfuF6QcxBOilcO6",
//                 newMesssage: "Added More Task to Complete"
//             }
//         }).then(data => {
//             expect(data.statusCode).toBe(200);
//         })
//     })

//     test("Banner Activity is Added", () => {
//         return Records.addBannerActivity({
//             body: {
//                 eventId: "NjB4sI9EkAwvBqtDJCbV",
//                 newMesssage: "New User is Created"
//             }
//         }).then(data => {
//             expect(data.statusCode).toBe(200);
//         })
//     })


//     let tr = {
//         "share": {
//             "paidBy": [
//                 {
//                     "id": "iquRnzfuF6QcxBOilcO6",
//                     "amount": 99
//                 }
//             ],
//             "splitIn": [
//                 {
//                     "id": "YMCFt5wqwYSYJsmWWg1J"
//                 },
//                 {
//                     "id": "iquRnzfuF6QcxBOilcO6"
//                 },
//                 {
//                     "id": "nQ7p2fxtOcMWF1qkDzkM"
//                 }
//             ]
//         },
//         "event": {
//             "id": "NjB4sI9EkAwvBqtDJCbV",
//             "name": "trip"
//         }
//     }

//     test("Transaction Activity is Added", () => {
//         return Records.addTransaction({
//             body: tr
//         }).then(data => {
//             expect(data.statusCode).toBe(200);
//         })
//     });

//     test("Fetch Records", () => {
//         return Records.fetchRecords({
//             body: {
//                 eventId: "NjB4sI9EkAwvBqtDJCbV",
//                 limit: 10,
//                 timestamp: new Date().getTime(),
//                 offset: 0
//             }
//         }).then((data) => {
//             expect(data.statusCode).toBe(200);
//             expect(Array.isArray(data.fetchedData)).toBe(true);
//         })
//     })
// })
