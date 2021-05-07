class Balance {
    constructor(graph) {
        let credit = []
        let debit = []

        let balance = []

        for (let i = 0; i < graph.length; ++i) {
            balance.push(0);
        }

        for (let i = 0; i < graph.length; ++i) {
            for (let j = 0; j < graph.length; ++j) {
                balance[i] += graph[i][j];
                balance[j] -= graph[i][j];
            }
        }

        let x = 0
        for (i in balance) {
            if (i > 0) credit.push({
                amount: i,
                to: x
            })
            else if (i < 0) debit.push({
                amount: i,
                from: x
            })
        }

        credit.sort((a, b) => a.amount - b.amount);
        debit.sort((a, b) => a.amount - b.amount);

        this.credit = credit
        this.debit = debits
    }


    getBalance() {
        let balance = {}

        for (let i = 0; i < this.credit.length; ++i) {
            balance[this.credit[i].to] = this.credit[i].amount
        }

        for (let i = 0; i < this.debit.length; ++j) {
            balance[this.debit[i].from] = this.debit[i].amount
        }

        return balance;
    }

    simplify() {
        let graph = []

        {
            let dummy = []
            for (let i = 0; i < this.credit.length + this.debit.length; ++i) {
                dummy.push(0);
            }
            for (let i = 0; i < this.credit.length + this.debit.length; ++i) {
                graph.push(dummy);
            }
        }

        while(this.credit.length) {
            if (this.debit[this.debit.length - 1].amount > this.credit[this.credit.length - 1].amount) {
                let CR = this.credit[this.credit.length - 1].amount
                graph[this.debit[this.debit.length - 1].from][this.credit[this.credit.length - 1].to] = CR
                this.debit[this.debit.length - 1].amount -= CR

                this.credit.pop()
            } else if (this.debit[this.debit.length - 1].amount < this.credit[this.credit.length - 1].amount) {
                let DR = this.debit[this.debit.length - 1].amount
                graph[this.debit[this.debit.length - 1].from][this.credit[this.credit.length - 1].to] = DR
                this.credit[this.credit.length - 1].amount -= DR

                this.debit.pop()
            } else {
                let DR = this.debit[this.debit.length - 1].amount
                graph[this.debit[this.debit.length - 1].from][this.credit[this.credit.length - 1].to] = DR

                this.credit.pop()
                this.debit.pop()
            }
        }

        return graph;

    }





}