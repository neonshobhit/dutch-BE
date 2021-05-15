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

    }

    getGraph() {
        // Convert indices to user IDs
        return this.graph
    }

    getoldgraph() {

        // create new graph and assign it values before transacion
        let graph =[]
        {
            let dummy = []
            for (let i = 0; i < 2; ++i) {
                dummy.push(0);
            }
            for (let i = 0; i < 2; ++i) {
                graph.push([...dummy]);
            }
        }

        let sz=this.graph.length;
        for(let i=0;i<sz;i++)
        {
            for(let j=0;j<sz;j++)
            {
                graph[i][j]=this.graph[i][j];
            }
        }
        return graph;
    }


    dutch(transaction) {
        let len = transaction.splitIn.length
        for (let members of transaction.contribution) {
            let share = parseFloat((members.amount / len).toPrecision(2))

            for (let owedBy of transaction.splitIn) {
                if (owedBy === members.paidBy) continue;

                let toPay = share;

                let due = this.graph[members.paidBy][owedBy]
                let contribute = Math.min(due, share);

                this.graph[members.paidBy][owedBy] -= contribute
                toPay -= contribute;

                this.graph[owedBy][members.paidBy] += toPay;

            }
        }
    }


    calculatechanges(oldgraph,newgraph){

        let changegraph=oldgraph;
        let sz=changegraph.length;

        for(let i=0;i<sz;i++)
        {
            for(let j=0;j<sz;j++)
            {
                changegraph[i][j]=newgraph[i][j]-oldgraph[i][j];
            }
        }


        return changegraph;
        
    }
    queryReceivable(q) {
        let receivable = {}
        for (let i = 0; i < this.len; ++i) {
            if (graph[q][i] === 0) continue;


            receivable.i = graph[q][i]
        }
    }

    queryPayable(q) {
        let payable = {}
        for (let i = 0; i < this.len; ++i) {
            if (graph[i][q] === 0) continue;


            payable.i = graph[i][q]
        }

        return payable;
    }

    allDues() {
        let dues = {}
        for (i in graph) {
            dues.i = {
                receive: this.queryReceivable(i),
                pay: this.queryPayable(i)
            }
        }

        return dues;
    }   
}

module.exports = Activity;