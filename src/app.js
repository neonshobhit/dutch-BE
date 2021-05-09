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

    let fa = await Users.fetchFriends({
        userId: u3.id
    })
    console.dir(fa, {
        depth: null
    })
}

populate()