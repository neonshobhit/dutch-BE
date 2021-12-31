const Event = require('./../functions/src/controllers/events')
const {
    v4: uuid
} = require('uuid')

test("In Friends test 2+2", () => {
    expect(2 + 2).toBe(4);
})

// let event;
// describe('Events sequence', () => {

//     test('event is added', () => {
//         return Event.create({
//             body: {
//                 name: "Trip to Mumbai",
//                 imageURL: "http://some_url_to_image.com",
//                 userId: 'YMCFt5wqwYSYJsmWWg1J',
//                 userName: 'swapnil',
//                 simplify: true
//             }
//         })
//             .then(d => {
//                 expect(d.statusCode).toBe(200)
//                 expect(typeof d.eventId === 'string').toBe(true)
//                 expect(d.data instanceof Object).toBe(true)
//                 event = d;
//             })
//     })

//     test('guest member can be added', () => {
//         return Event.addMembers({
//             body: {
//                 eventId: event.eventId,
//                 memberId: "G-" + uuid(), // G for guest
//                 memberName: "Mr Guest wala",
//                 isGuest: true
//             }
//         })
//             .then(d => {
//                 expect(d.statusCode).toBe(200)
//                 expect(d.members.length).toBe(2)
//             })
//     })
// })

// test('Get Total dues summary', () => {
//     return Event.getDuesSummary({
//         eventId: event.eventId
//     })
//         .then(d => {
//             expect(d.statusCode).toBe(200)
//             // expect(d.)
//         })
// })

// test("Get Members List", () => {
//     return Event.getMembersList({
//         eventId: event.eventId
//     })
//         .then(d => {
//             expect(d.statusCode).toBe(200)
//             expect(Array.isArray(d.members)).toBe(true);
//         })
// });
// test("Display Event", () => {
//     return Event.display({
//         body: {
//             eventId: event.eventId
//         }
//     })
//         .then(d => {
//             expect(d.statusCode).toBe(200)
//             expect(typeof (d.data) === 'object').toBe(true);
//         })
// });


