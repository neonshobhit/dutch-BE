const Users = require("./../src/controllers/users.js");
const {v4:uuid} = require("uuid");

test('User Already Added Check',()=>{
    return Users
            .addUser({body:{email:"shobhit@dutch.com"}})
            .then(data=>{
                expect(data.statusCode).toBe(403)
                expect(data.error).toBe("Email Id already exists")
            });
});

describe("New User Added and verify otp",()=>{
    let user;
    test("New User added",()=>{
        return Users.addUser({
                        body: {
                            email:  uuid() + "@dutch.com"
                        }
                    }).then(data => {
                        user = {
                            id:data.id,
                            email:data.email,
                            otp:data.otp
                        }
                        expect(data.statusCode).toBe(200) 
                    });
    });
    
    test("Verify User Otp",()=>{
        return Users.verifyUser({
                    body:{
                        id:user.id,
                        otp:user.otp,
                        email:user.email,
                    }
                }).then(data=>{
                    expect(data.statusCode).toBe(200)
                    expect(data.email).toBe(user.email) 
                    expect(data.id).toBe(user.id) 
                })
    })
})

test('Check friends getting added to the user', async () => {

    let u1 = await Users.addUser({
        body: {
            email: "shobhit@dutch.com"
        }
    })

    let u2 = await Users.addUser({
        body: {
            email:  uuid() + "@dutch.com"
        }
    })

    u2 = await Users.verifyUser({
        body:{
            id:u2.id,
            otp:u2.otp,
            email:u2.email,
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
    let u1 = await Users.addUser({
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
