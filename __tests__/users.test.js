const Users = require("./../functions/src/controllers/users.js");
const userMiddleware = require("./../functions/src/middleware/users.js");
const {
    v4: uuid
} = require("uuid");

test("In Users test 2+2", () => {
    expect(2 + 2).toBe(4);
})

// test('User Already Added Check', () => {
//     return Users
//         .add({
//             body: {
//                 email: "shobhit@dutch.com"
//             }
//         })
//         .then(data => {
//             expect(data.statusCode).toBe(403)
//             expect(data.error).toBe("Email Id already exists")
//         });
// });

// describe("New User Added and verify otp, and Check QrCode ", () => {
//     let user = {};
//     test("New User added", () => {
//         return Users.add({
//             body: {
//                 email: uuid() + "@dutch.com"
//             }
//         }).then(data => {
//             user["email"] = data.email;
//             user["otp"] = data.otp;
//             expect(data.statusCode).toBe(200)
//         });
//     });

//     test("Verify User Otp", () => {
//         return Users.verifyUser({
//             body: {
//                 email: user.email,
//                 token: user.otp.toString()
//             }
//         }).then(data => {
//             expect(data.statusCode).toBe(200)
//             expect(data.message).toBe("User Verified Done.")
//         })
//     });

//     test("Check QrCode Image Url Success", () => {
//         return Users
//             .getQrCode({
//                 body: {
//                     email: user.email
//                 }
//             })
//             .then(data => {
//                 expect(data.statusCode).toBe(200);
//             })
//     })

//     test("Check User Not Found Error", () => {
//         return Users
//             .getQrCode({
//                 body: {
//                     email: "@dutch.com"
//                 }
//             })
//             .then(data => {
//                 expect(data.statusCode).toBe(401);
//                 expect(data.error).toBe("Unauthorized Person");
//             })
//     })

//     test("Check Qr Code Image Failure", () => {
//         return Users
//             .getQrCode({
//                 body: {
//                     email: "shobhit@gmail.com"
//                 }
//             })
//             .then(data => {
//                 expect(data.statusCode).toBe(200);
//             })
//     })
// })


// describe("User Signin, Send Jwt Token and decode Jwt Token", () => {
//     test("User Signin", () => {
//         return Users
//             .signin({
//                 body: {
//                     email: user.email,
//                     verificationOtp: 345212
//                 }
//             })
//             .then(data => {
//                 jwttoken = data.token
//                 expect(data.statusCode).toBe(200)
//             })
//     })

//     test("Verify Token For A User", () => {
//         return userMiddleware
//             .checkValidation({
//                 body: {
//                     jwttoken
//                 }
//             })
//             .then(data => {
//                 expect(data.statusCode).toBe(200)
//             })
//     })
// })

// test('Check friends getting added to the user', async () => {
//     let u1 = await Users.add({
//         body: {
//             email: "shobhit@dutch.com"
//         }
//     })

//     let u2 = await Users.add({
//         body: {
//             email: uuid() + "@dutch.com"
//         }
//     })

//     u2 = await Users.verifyUser({
//         body: {
//             token: u2.otp,
//             email: u2.email,
//         }
//     })
//     return Users.addFriend({
//         body: {
//             otherEmail: u2.email
//         }
//     }).then((data) => {
//         expect(data.statusCode).toBe(200)
//     })
// })

// test('find all friends', async () => {
//     let u1 = await Users.add({
//         body: {
//             email: "shobhit@dutch.com"
//         }
//     })

//     return Users.fetchFriends({
//         userId: u1.id
//     })
//         .then(data => {
//             let ch = Array.isArray(data.data)
//             expect(data.statusCode).toBe(200)
//             // console.log(data.data)
//             expect(ch).toBe(true)
//         })
// })

