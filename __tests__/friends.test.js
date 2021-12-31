const friends = require('./../functions/src/controllers/friends')
//dummy test
test("In Friends test 2+2", () => {
    expect(2 + 2).toBe(4);
})
// describe('friends payable/ receivable getting updated', () => {
//     // test('friends being made', () => {
//     //     return friends.add({
//     //         body: {
//     //             userId: 'BW9LU9y848bBCwArJwhc',
//     //             otherUserId: 'LmX0dv5uxercESjnM9BM',
//     //             otherUserName: "other",
//     //             userName: "this"
//     //         }
//     //     }).then((d) => {
//     //         expect(d.statusCode).toBe(200)
//     //     })
//     // })

//     test('friends already made', () => {
//         return friends.add({
//             body: {
//                 userId: 'BW9LU9y848bBCwArJwhc',
//                 otherUserId: 'LmX0dv5uxercESjnM9BM',
//                 otherUserName: "other",
//                 userName: "this"
//             }
//         }).then((d) => {
//             expect(d.statusCode).toBe(208)
//         })
//     })

//     test('friends payable/ receivable getting changed', () => {
//         return friends.updateOwe({
//             'BW9LU9y848bBCwArJwhc': {
//                 'LmX0dv5uxercESjnM9BM': 10
//             },
//             'LmX0dv5uxercESjnM9BM': {
//                 'BW9LU9y848bBCwArJwhc': -10
//             }
//         }).then((d) => {
//             expect(d.statusCode).toBe(200)
//         })
//     })

//     test('Friends getting listed', () => {
//         return friends.list({
//             body: {
//                 userId: 'BW9LU9y848bBCwArJwhc'
//             }
//         }).then((d) => {
//             expect(d.statusCode).toBe(200)
//             expect(Array.isArray(d.friends)).toBe(true)
//         })
//     })


// })
