const Members = require('./Members')
class Activity extends Members {
    constructor(members, map) {
        // Assign IDs as indices for the graph. people will be a map of {index: id} to keep track of which index is assigned to which ID.
        // Later we'll have to convert the graph from indices based to ID based.
        super(members)
        let people = this.people

        let processedGraph = this.dummyGraph

        //  Taking Map and processing it to graph
        for (let i in map) {
            let i_index = people[i];
            for (let j in map[i]) {
                let j_index = people[j];
                if (map[i][j] <= 0) continue;
                processedGraph[i_index][j_index] = map[i][j]
            }
        }

        this.graph = processedGraph
        this.fetchedGraph = processedGraph
        this.len = this.graph.length;

    }

    getGraph() {
        // Convert indices to user IDs
        return this.graph
    }

    getoldgraph() {

        // create new graph and assign it values before transacion
        let graph = []
        let sz = this.graph.length; {
            let dummy = []
            for (let i = 0; i < sz; ++i) {
                dummy.push(0);
            }
            for (let i = 0; i < sz; ++i) {
                graph.push([...dummy]);
            }
        }


        for (let i = 0; i < sz; i++) {
            for (let j = 0; j < sz; j++) {
                graph[i][j] = this.graph[i][j];
            }
        }
        return graph;
    }


    dutch(transaction) {
        let len = transaction.splitIn.length
        for (let members of transaction.paidBy) {
            let share = parseFloat((members.amount / len).toPrecision(2))

            for (let owedBy of transaction.splitIn) {
                // console.log(owedBy);
                // owedBy = {
                //     id: owedBy
                // }
                // console.log(this.people[owedBy.id])
                // console.log(this.people[members.id])
                if (this.people[owedBy.id] === this.people[members.id]) continue;

                let toPay = share;
                let due = this.graph[this.people[members.id]][this.people[owedBy.id]]
                let contribute = Math.min(due, share);

                this.graph[this.people[members.id]][this.people[owedBy.id]] -= contribute
                toPay -= contribute;

                this.graph[this.people[owedBy.id]][this.people[members.id]] += toPay;

            }
        }
    }


    calculatechanges(oldgraph, newgraph) {

        let changegraph = this.getoldgraph();
        let sz = changegraph.length;

        for (let i = 0; i < sz; i++) {
            for (let j = 0; j < sz; j++) {
                changegraph[i][j] = newgraph[i][j] - oldgraph[i][j];
            }
        }
        let newchange = this.convertmap(changegraph);

        return newchange;

    }
    queryReceivable(q) {
        let receivable = {},
            rec = 0
        for (let i = 0; i < this.len; ++i) {
            if (this.graph[q][i] === 0) continue;


            receivable.i = this.graph[q][i]
            rec += this.graph[q][i];
        }
        return rec;
    }

    queryPayable(q) {
        let payable = {},
            pay = 0
        for (let i = 0; i < this.len; ++i) {
            if (this.graph[i][q] === 0) continue;


            payable.i = this.graph[i][q]
            pay += this.graph[i][q];
        }

        return pay;
    }

    allDues() {
        let dues = {}
        for (i in this.graph) {
            dues.i = {
                receive: this.queryReceivable(i),
                pay: this.queryPayable(i)
            }
        }

        return dues;
    }

    userchanges() {
        let userdues = []
        for (let i = 0; i < this.len; i++) {
            userdues.push(this.queryReceivable(i) - this.queryPayable(i));
        }
        let duemap = this.convertUserDues(userdues);
        return duemap;
    }
}

module.exports = Activity;