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

//  populate();


const eventTest = async () => {
    const Event = require('./controllers/events')
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

    let f3 = await Event.display({
        body: {
            eventId: '70SlEscVNqcj1AyhJoWx'
        }
    })

    console.log(f3)

    const Activity = require('./models/Activity')
    let Activityobject = new Activity(f3.data.members, f3.data.graph);

    console.log(Activityobject.convertToMap(Activityobject.graph))


    
}


const friends = async () => {
    const friends = require('./controllers/friends')
    const pays = require('./dummy data/payments').owe
    
}


const groupActivity = async ()=>{
    let events = require("./controllers/events");  
    let feedback = await events.addMessageActivity({
            body:{
                eventId:"51W9qZrHxb6aEBIwmiDD",
                userId:"BdJNMMHPrDV4uBRt7y5t",
                newMesssage:"New User is Created"
            }
        })
    console.log(feedback);
}
// friends()

// populate()
// eventTest()

// groupActivity();