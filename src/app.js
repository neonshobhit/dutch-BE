const {
    db
} = require('./config/firebase');




const populate = async () => {
    // Populate some data from here.
    // Take data from dummy data folder

    const Activity = require('./models/Activity')


}

const dbTest = async () => {
    const log = require('log-to-file')
    global.log = (input) => {
        if (input instanceof Object) input = JSON.stringify(input)

        log(input)
    }

    // The above section will make this log function available globally to our project


    const Users = require('./controllers/users')
    let u1 = await Users.add({
        body: {
            email: "shobhit@dutch.com"
        }
    })
    console.log(u1)
    let u2 = await Users.add({
        body: {
            email: "harshit@dutch.com"
        }
    })
    console.log(u2)
    let u3 = await Users.add({
        body: {
            email: "swapnil@dutch.com"
        }
    })
    console.log(u3)
    let f1 = await Users.addFriend({
        body: {
            userId: u3.id,
            otherUser: u2.id
        },
        userId: u3.id

    })
    console.log(f1)

    let fa = await Users.fetchFriends({
        userId: u3.id
    })
    console.dir(fa, {depth: null})
}

populate()
dbTest()