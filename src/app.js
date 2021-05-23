const express = require('express')
const app = express()

app.use(express.json())

// Assigning multipe times so that we can deply each one as an individual function at Cloud Funcitions
const users = app
const records = app
const friends = app
const events = app

users.use('/users', require('./routers/users'))
records.use('/records', require('./routers/records'))
friends.use('/friends', require('./routers/friends'))
events.use('/events', require('./routers/users'))

app.get('*', (req, res) => {
    res.send("hello world")
})





app.listen(require('./config/env').server.port, () => {
    console.log("server is up and running")
})





// const {
//     db
// } = require('./config/firebase');

// const {
//     share
// } = require('./dummy data/history');

// //const Users = require("./controllers/users");
// const populate = async () => {
//     const Activity = require('./models/Activity')
//     const Balance = require('./models/Balance')
//     const {
//         updateOwe
//     } = require('./controllers/friends')


//     // FOR TRANSACTION

//     const ref = db.collection('events').doc('70SlEscVNqcj1AyhJoWx');
//     let data = (await ref.get()).data();

//     // console.log(data)


//     let Activityobject = new Activity(data.members, data.graph); // creating object

//     let oldgraph = Activityobject.getoldgraph(); // getting stored graph

//     //console.log(oldgraph);

//     Activityobject.dutch(share); //making transaction

//     let newgraph = Activityobject.getGraph(); // newgraph after transaction

//     //console.log(newgraph);

//     let Balanceobject = new Balance(newgraph); //for simplification

//     newgraph = Balanceobject.simplify();

//     //console.log(newgraph);

//     let graph = Activityobject.calculatechanges(oldgraph, newgraph); //calculating changes

//     map = Activityobject.convertToMap(graph); // map to graph for writing in database

//     updateOwe(map); //updating changes in database 


//     //console.log(graph);

// }

// //populate();


// const eventTest = async () => {
//     const Event = require('./controllers/events')
//     //     const {v4: uuid} = require('uuid')

// const groupActivity = async () => {
//     let records = require("./controllers/records");
    // let feedback = await events.addMessageActivity({
    //         body:{
    //             eventId:"51W9qZrHxb6aEBIwmiDD",
    //             userId:"BdJNMMHPrDV4uBRt7y5t",
    //             newMesssage:"New User is Created"
    //         }
    //     })
    // console.log(feedback);
    // let f1 = await Event.create({
    //     body: {
    //         name: "Trip to Nainital",
    //         imageURL: "http://some_url_to_image.com",
    //         userId: 'BdJNMMHPrDV4uBRt7y5t',
    //         userName: 'shobhit',
    //     }
    // })

    // console.log(f1);

//         share: {
//             splitIn: [{
//                 id: "BdJNMMHPrDV4uBRt7y5t",
//                 name: "shobhit"
//             }, {
//                 id: "G-2121341e-c762-4808-ae08-3154aa477fed",
//                 name: "Mr Guest wala"
//             }],

//             paidBy: [{
//                 id: "BdJNMMHPrDV4uBRt7y5t",
//                 name: "shobhit",
//                 amount: 1000
//             }]
//         }
//     };

//     let transaction = await records.addTransaction({
//         body: tr
//     })
//     console.log(transaction);
// }

// friends()

// populate()
// eventTest()

//     // let f2 = await Event.addMembers({
//     //     body: {
//     //         eventId: f1.eventId,
//     //         memberId: "G-" + uuid(), // G for guest
//     //         memberName: "Mr Guest wala",
//     //         isGuest: true
//     //     }
//     // })

//     // console.dir(f2, {
//     //     depth: null
//     // })

//     let f3 = await Event.display({
//         body: {
//             eventId: '70SlEscVNqcj1AyhJoWx'
//         }
//     })

//     console.log(f3)

//     const Activity = require('./models/Activity')
//     let Activityobject = new Activity(f3.data.members, f3.data.graph);

//     console.log(Activityobject.convertToMap(Activityobject.graph))



// }


// const friends = async () => {
//     const friends = require('./controllers/friends')
//     const pays = require('./dummy data/payments').owe

// }

// const groupActivity = async () => {
//     let events = require("./controllers/events");
//     // let feedback = await events.addMessageActivity({
//     //         body:{
//     //             eventId:"51W9qZrHxb6aEBIwmiDD",
//     //             userId:"BdJNMMHPrDV4uBRt7y5t",
//     //             newMesssage:"New User is Created"
//     //         }
//     //     })
//     // console.log(feedback);

//     let tr = {
//         event: {
//             id: "51W9qZrHxb6aEBIwmiDD",
//             name: "Trip to Nainital"
//         },
//         payment: {
//             from: {
//                 id: "BdJNMMHPrDV4uBRt7y5t",
//                 name: "shobhit"
//             },
//             to: {
//                 id: "G-2121341e-c762-4808-ae08-3154aa477fed",
//                 name: "Mr Guest wala",
//             },
//             amount: 1000
//         },

//         share: {
//             splitIn: [{
//                 id: "BdJNMMHPrDV4uBRt7y5t",
//                 name: "shobhit"
//             }, {
//                 id: "G-2121341e-c762-4808-ae08-3154aa477fed",
//                 name: "Mr Guest wala"
//             }],

//             paidBy: [{
//                 id: "BdJNMMHPrDV4uBRt7y5t",
//                 name: "shobhit",
//                 amount: 1000
//             }]
//         }
//     };

//     let transaction = await events.addTransaction({
//         body: tr
//     })
//     console.log(transaction);
// }

// // friends()

// // populate()
// // eventTest()

// // groupActivity();
