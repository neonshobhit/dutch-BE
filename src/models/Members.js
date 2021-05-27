class Members {
    // Keeping IDs of the members and
    // storing indices at which they'll represent in the graph.
    constructor(members) {

        let people = {} // ID -> index
        let IDs = {} // index -> ID
        let c = 0;
        for (; c < members.length; ++c) {
            people[members[c].userId] = c;
            IDs[c] = members[c].userId
        }

        let convertedToIdices = []


        {
            let dummy = []
            for (let i = 0; i < c; ++i) {
                dummy.push(0);
            }
            for (let i = 0; i < c; ++i) {
                convertedToIdices.push([...dummy]);
            }
        }

        this.people = people
        this.IDs = IDs
        this.dummyGraph = convertedToIdices
        this.size = c
    }

    // Converting array graph to map, so to push back to database again.

    convertmap(graph) {
        let sz = this.size
        let IDs = this.IDs
        let map = {}

        // The graph converted from arrays to a map.
        for (let i = 0; i < sz; ++i) {
            for (let j = 0; j < sz; ++j) {

                if (!map[IDs[i]]) {
                    map[IDs[i]] = {
                        [IDs[j]]: graph[i][j]
                    }
                } else {
                    map[IDs[i]][IDs[j]] = graph[i][j];
                }

            }
        }
        return map
    }
    convertToMap(graph) {
        let sz = this.size
        let IDs = this.IDs
        let map = {}

        // The graph converted from arrays to a map.
        for (let i = 0; i < sz; ++i) {
            for (let j = 0; j < sz; ++j) {
                if (graph[i][j] <= 0) continue;

                if (!map[IDs[i]]) {
                    map[IDs[i]] = {
                        [IDs[j]]: graph[i][j]
                    }
                } else {
                    map[IDs[i]][IDs[j]] = graph[i][j];
                }

            }
        }

        this.mapOfGraph = map
        return map
    }

    convertUserDues(userdues) {
        let sz = this.size;
        let IDs = this.IDs
        let usermap = {}
        for (let i = 0; i < sz; ++i) {
            usermap[IDs[i]] = userdues[i];
        }
        return usermap;
    }
}

module.exports = Members