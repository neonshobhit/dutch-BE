// const {
//     db
// } = require('./config/firebase');
//const Users = require("./controllers/users");
const populate = async () => {
    let graph = []
    let people = 4;
    const Activity = require('./models/Activity')
    const Balance = require('./models/Balance')

    {
        let dummy = []
        for (let i = 0; i < people; ++i) {
            dummy.push(0);
        }
        for (let i = 0; i < people; ++i) {
            graph.push([...dummy]);
        }
    }

    // FOR TESTING

    // let Activityobject = new Activity(graph);

    // let split = [3, 2, 1, 0]
    // Activityobject.dutch(0, split, 100)

    // graph = Activityobject.getGraph();

    // split=[1,2]
    // Activityobject.dutch(1, split, 120)

    // let Balanceobject = new Balance(graph);

    // graph=Balanceobject.simplify();

    // console.log(graph);

 }

 populate();

// const dbTest = async () => {
//     const log = require('log-to-file')
//     global.log = (input) => {
//         if (input instanceof Object) input = JSON.stringify(input)

//         log(input)
//     }
//     // The above section will make this log function available globally to our project

//     // let fa = await Users.fetchFriends({
//     //     userId: u3.id
//     // })
//     // console.dir(fa, {
//     //     depth: null
//     // })
// }

// const eventTest = async () => {
//     const Event = require('./controllers/events')
//     const {v4: uuid} = require('uuid')

    // let f1 = await Event.create({
    //     body: {
    //         name: "Trip to Nainital",
    //         imageURL: "http://some_url_to_image.com",
    //         userId: 'BdJNMMHPrDV4uBRt7y5t',
    //         userName: 'shobhit',
    //     }
    // })

    // console.log(f1);

    // let f2 = await Event.addMembers({
    //     body: {
    //         eventId: f1.eventId,
    //         memberId: "G-" + uuid(), // G for guest
    //         memberName: "Mr Guest wala",
    //         isGuest: true
    //     }
    // })

    // console.dir(f2, {
    //     depth: null
    // })

    // let f3 = await Event.getDuesSummary({
    //     body: {
    //         eventId: 'BdvNLy84fcebL8tZt5t7'
    //     }
    // })

    // console.log(f3)
//}

// (() => {
//     const User = require('./controllers/users')

//     let f1 = await User.addFriend({
//         body: {

//         }
//     })
// })()

// populate()
// eventTest()
