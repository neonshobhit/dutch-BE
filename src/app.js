const {
    db
} = require('./config/firebase');


const populate = async () => {
    let graph = []
    let people = 4;
    const Activity = require('./models/Activity')
    {
        let dummy = []
        for (let i = 0; i < people; ++i) {
            dummy.push(0);
        }
        for (let i = 0; i < people; ++i) {
            graph.push([...dummy]);
        }
    }


    let Activityobject = new Activity(graph);

    let split = [3,2,1,0]
    Activityobject.dutch(0, split, 100)

    graph = Activityobject.getGraph();

    // for (let i = 0; i < people; i++) {
    //     // for (let j = 0; j < people; j++) {
    //         // process.stdout.write(graph[i][j]);
    //         console.log(graph[i])
    //     // }
    //     // console.log();
    // }


}

const dbTest = async () => {
    const log = require('log-to-file')
    global.log = (input) => {
        if (input instanceof Object) input = JSON.stringify(input)

        log(input)
    }
    // The above section will make this log function available globally to our project

    // const Users = require('./controllers/users')
    let u1 = await Users.addUser({
        body: {
            email: "shob11@dutch.com"
        }
    });
    // console.log(u1);
    // let ver1 = await Users.verifyUser({
    //     body:{
    //         id:u1.id,
    //         otp:u1.otp,
    //         email:u1.newUser.email,
    //     }
    // })
    // console.log(ver1)
    let u2 = await Users.addUser({
        body: {
            email: "harshita@dutch.com"
        }
    })
    u2 = await Users.addUser({
        body: {
            id:u2.id,
            otp:u2.otp,
            email:u2.email,
        }
    })
    console.log(u2)
    let f1 = await Users.addFriend({
        body: {
            userId: u2.id,
            otherUser: u1.id
        },
        userId: u2.id

    })
    console.log(f1)

    // let fa = await Users.fetchFriends({
    //     userId: u3.id
    // })
    // console.dir(fa, {
    //     depth: null
    // })
}

populate()
// dbTest()