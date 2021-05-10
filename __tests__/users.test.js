const Users = require("../src/controllers/users.js");
const {
    v4: uuid
} = require("uuid");
const speakeasy = require("speakeasy");

test('User Already Added Check', () => {
    return Users
        .add({
            body: {
                email: "shobhit@dutch.com"
            }
        })
        .then(data => {
            expect(data.statusCode).toBe(403)
            expect(data.error).toBe("Email Id already exists")
        });
});

describe("New User Added and verify otp", () => {
    let user;
    test("New User added", () => {
        return Users.add({
            body: {
                email: uuid() + "@dutch.com"
            }
        }).then(data => {
            user = {
                id: data.id,
                email: data.email,
                otp: data.otp
            }
            expect(data.statusCode).toBe(200)
        });
    });

    test("Verify User Otp", () => {
        return Users.verifyUser({
            body: {
                id: user.id,
                otp: user.otp,
                email: user.email,
            }
        }).then(data => {
            expect(data.statusCode).toBe(200)
            expect(data.email).toBe(user.email)
            expect(data.id).toBe(user.id)
        })
    })
})

test('Check friends getting added to the user', async () => {

    let u1 = await Users.add({
        body: {
            email: "shobhit@dutch.com"
        }
    })

    let u2 = await Users.add({
        body: {
            email: uuid() + "@dutch.com"
        }
    })

    u2 = await Users.verifyUser({
        body: {
            id: u2.id,
            otp: u2.otp,
            email: u2.email,
        }
    })
    return Users.addFriend({
        body: {
            userId: u1.id,
            otherUser: u2.id
        }
    }).then((data) => {
        expect(data.statusCode).toBe(200)
    })
})

test('find all friends', async () => {
    let u1 = await Users.add({
        body: {
            email: "shobhit@dutch.com"
        }
    })

    return Users.fetchFriends({
            userId: u1.id
        })
        .then(data => {
            let ch = Array.isArray(data.data)
            expect(data.statusCode).toBe(200)
            // console.log(data.data)
            expect(ch).toBe(true)
        })
})

describe("Check QrCode Image Url Success And Failure", () => {

    test("Check QrCode Image Url Success", () => {
        const secret = speakeasy.generateSecret();
        return Users
            .getQrCode({
                body: {
                    email: "shobhit@dutch.com",
                    secret
                }
            })
            .then(data => {
                expect(data.statusCode).toBe(200);
            })
    })

    test("Check User Not Found Error", () => {
        return Users
            .getQrCode({
                body: {
                    email: "@dutch.com"
                }
            })
            .then(data => {
                expect(data.statusCode).toBe(401);
                expect(data.error).toBe("Unauthorized Person");
            })
    })

    test("Check Qr Code Image Failure", () => {
        const secret = {
            otpauth_url: 1234567
        }
        return Users
            .getQrCode({
                body: {
                    email: "shobhit@dutch.com",
                    secret
                }
            })
            .then(data => {
                expect(data.statusCode).toBe(500);
                expect(data.error).toBe("Inernal Server Error");
            })
    })
})

describe("User Signin, Send Jwt Token and decode Jwt Token", () => {

    let token = "";
    test("User Signin", () => {
        return Users
            .signin({
                body: {
                    email: "shobhit@dutch.com",
                    verificationOtp: 345212
                }
            })
            .then(data => {
                token = data.token
                expect(data.statusCode).toBe(200)
            })
    })

    test("Verify Token For A User", () => {
        return Users1
            .checkValidation({
                body: {
                    token
                }
            })
            .then(data => {
                expect(data.statusCode).toBe(200)
            })
    })
})