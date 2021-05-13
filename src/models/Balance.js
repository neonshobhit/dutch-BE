const Activity = require("./Activity");

class Balance extends Activity{
    constructor(graph) {
        let credit = []
        let debit = []

        let balance = []

        for (let i = 0; i < graph.length; ++i) {
            balance.push(0);
        }

        for (let i = 0; i < graph.length; ++i) {
            for (let j = 0; j < graph.length; ++j) {
                balance[i] -= graph[i][j];
                balance[j] += graph[i][j];
            }
        }
        let x = 0
        var i;
        for (i of balance) {
            if (i > 0) credit.push({
                amount: i,
                to: x
            })
            else if (i < 0) debit.push({
                amount: -i,
                from: x
            })
            x++;
        }


        credit.sort((a, b) => a.amount - b.amount);
        debit.sort((a, b) => a.amount - b.amount);

        this.credit = credit
        this.debit = debit



    }


    getBalance() {
        let balance = {}

        for (let i = 0; i < this.credit.length; ++i) {
            balance[this.credit[i].to] = this.credit[i].amount;
        }

        for (let i = 0; i < this.debit.length; ++j) {
            balance[this.debit[i].from] = this.debit[i].amount;
        }

        return balance;
    }

    simplify() {
        let graph = []


        let p=this.credit.length;
        let q=this.debit.length;


        {
            let dummy = []
            for (let i = 0; i < p+q; ++i) {
                dummy.push(0);
            }
            for (let i = 0; i < p+q; ++i) {
                graph.push([...dummy]);
            }
        }


        
        while(p) {
            console.log(this.debit[q-1])
            let debitamount=this.debit[q - 1].amount;
            let creditamount=this.credit[p - 1].amount;


            let debitfrom=this.debit[q - 1].from;
            let creditto=this.credit[p - 1].to;


            if (debitamount > creditamount) {
                let CR = creditamount
                graph[debitfrom][creditto] = CR
                this.debit[q - 1].amount -= CR

                p--;
            } else if (debitamount < creditamount) {
                let DR = debitamount
                graph[debitfrom][creditto] = DR
                this.credit[p - 1].amount -= DR

                q--;
            } else {
                let DR = debitamount
                graph[debitfrom][creditto] = DR

                p--;
                q--;
            }
        }

        return graph;

    }





}


module.exports = Balance