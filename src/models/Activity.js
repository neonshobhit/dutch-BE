class Activity {
    constructor(graph) {
        // Assign IDs as indices for the graph. people will be a map of {index: id} to keep track of which index is assigned to which ID.
        // Later we'll have to convert the graph from indices based to ID based.
        this.people = graph
        // Process input graph from Database here.
        this.len = graph.length
        this.graph = graph
        
    }

    getGraph() {
        // Convert indices to user IDs
        return this.graph
    }

    dutch(paidBy, splitIn, amount) {
        let len = splitIn.length
        let share = parseFloat((amount / len).toPrecision(2))

        for (let owedBy of splitIn) {
            if (owedBy === paidBy) continue;

            let toPay = share;

            let due = this.graph[paidBy][owedBy]
            let contribute = Math.min(due, share);

            this.graph[paidBy][owedBy] -= contribute
            toPay -= contribute;

            this.graph[owedBy][paidBy] += toPay;

        }
    }

    queryReceivable(q) {
        let receivable = {}
        for (let i=0; i<this.len; ++i) {
            if (graph[q][i] === 0) continue;


            receivable.i = graph[q][i]
        }
    }

    queryPayable(q) {
        let payable = {}
        for (let i=0; i<this.len; ++i) {
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

module.exports = Activity