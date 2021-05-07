class Activity {
    constructor(graph) {
        // Process input graph from Database here.
        this.len = graph.length
        this.graph = graph
    }


    dutch(paidBy, splitIn, amount) {
        let len = splitIn.length
        let share = (amount / len).toFixed(2);

        for (let i = 0; i < len; ++i) {
            if (i === paidBy) continue;
            let toPay = share;

            let due = graph[paidBy][splitIn[i]]
            let contribution = Math.min(due, share)

            this.graph[paidBy][splitIn[i]] -= contribution;
            toPay -= contribution;

            this.graph[splitIn[i]][paidBy] += toPay;
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