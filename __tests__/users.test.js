const User = require('../src/controllers/users')
const {v4: uuid} = require('uuid')

test('User already added check', () => {
    return User.add({
        body: {
            email: "shobhit@dutch.com"
        }
    }).then(data => {
        expect(data.statusCode).toBe(403)
        expect(data.error).toBe("Email Id already exists")
    });
})

test('New user is getting added', () => {
    return User.add({
        body: {
            email:  uuid() + "@dutch.com"
        }
    }).then(data => {
        expect(data.statusCode).toBe(200) 
    });
})

test('Check friends getting added to the user', async () => {

    let u1 = await User.add({
        body: {
            email: "shobhit@dutch.com"
        }
    })

    let u2 = await User.add({
        body: {
            email:  uuid() + "@dutch.com"
        }
    })

    return User.addFriend({
        body: {
            userId: u1.id,
            otherUser: u2.id
        }
    }).then((data) => {
        expect(data.statusCode).toBe(200)
    })
})

test('find all friends', async () => {
    let u1 = await User.add({
        body: {
            email: "shobhit@dutch.com"
        }
    })

    return User.fetchFriends({
        userId: u1.id
    })
    .then(data => {
        let ch = Array.isArray(data.data)
        expect(data.statusCode).toBe(200)
        // console.log(data.data)
        expect(ch).toBe(true)
    })
})