/* eslint-disable require-jsdoc */
const Activity = require("./Activity");
const math = require("mathjs");
class Balance {
	constructor(graph) {
		const credit = [];
		const debit = [];

		const balance = [];

		for (let i = 0; i < graph.length; ++i) {
			balance.push(0);
		}

		for (let i = 0; i < graph.length; ++i) {
			for (let j = 0; j < graph.length; ++j) {
				balance[i] -= graph[i][j];
				balance[j] += graph[i][j];
			}
		}
		let x = 0;
		let i;
		for (i of balance) {
			if (i > 0) {
				credit.push({
					amount: i,
					to: x,
				});
			} else if (i < 0) {
				debit.push({
					amount: -i,
					from: x,
				});
			}
			x++;
		}

		credit.sort((a, b) => a.amount - b.amount);
		debit.sort((a, b) => a.amount - b.amount);

		this.credit = credit;
		this.debit = debit;

		this.size = graph.length;
	}

	getBalance() {
		const balance = {};

		for (let i = 0; i < this.credit.length; ++i) {
			balance[this.credit[i].to] = this.credit[i].amount;
		}

		for (let i = 0; i < this.debit.length; ++i) {
			balance[this.debit[i].from] = this.debit[i].amount;
		}

		return balance;
	}

	simplify() {
		const graph = [];

		let p = this.credit.length;
		let q = this.debit.length;

		let maxloop = p + q;

		{
			const dummy = [];
			for (let i = 0; i < this.size; ++i) {
				dummy.push(0);
			}
			for (let i = 0; i < this.size; ++i) {
				graph.push([...dummy]);
			}
		}

		while (p) {
			const debitamount = this.debit[q - 1].amount;
			const creditamount = this.credit[p - 1].amount;

			const debitfrom = this.debit[q - 1].from;
			const creditto = this.credit[p - 1].to;

			if (debitamount > creditamount) {
				const CR = creditamount;
				graph[debitfrom][creditto] = CR;
				this.debit[q - 1].amount = math.subtract(
					this.debit[q - 1].amount,
					CR,
				);

				p--;
			} else if (debitamount < creditamount) {
				const DR = debitamount;
				graph[debitfrom][creditto] = DR;
				this.credit[p - 1].amount = math.subtract(
					this.credit[p - 1].amount,
					DR,
				);

				q--;
			} else {
				const DR = debitamount;
				graph[debitfrom][creditto] = DR;

				p--;
				q--;
			}

			maxloop--;
			if (maxloop < 0) {
				// loop will run fixed number of times
				break;
			}
		}

		return graph;
	}
}

module.exports = Balance;
