/* eslint-disable max-len */
/* eslint-disable camelcase */
/* eslint-disable require-jsdoc */
/* eslint-disable guard-for-in */
const Members = require("./Members");
const math = require('mathjs');
class Activity extends Members {
  constructor(members, map) {
    // Assign IDs as indices for the graph.
    // people will be a map of {index: id} to keep track of which index is assigned to which ID.
    // Later we'll have to convert the graph from indices based to ID based.
    super(members);
    const people = this.people;

    const processedGraph = this.dummyGraph;

    //  Taking Map and processing it to graph
    for (const i in map) {
      const i_index = people[i];
      for (const j in map[i]) {
        const j_index = people[j];
        if (map[i][j] <= 0) continue;
        processedGraph[i_index][j_index] = map[i][j];
      }
    }

    this.graph = processedGraph;
    this.fetchedGraph = processedGraph;
    this.len = this.graph.length;
  }

  getGraph() {
    // Convert indices to user IDs
    return this.graph;
  }

  getoldgraph() {
    // create new graph and assign it values before transacion
    const graph = [];
    const sz = this.graph.length; {
      const dummy = [];
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
    const len = transaction.splitIn.length;
    for (const members of transaction.paidBy) {
      const share = parseFloat((members.amount / len).toPrecision(2));

      for (const owedBy of transaction.splitIn) {
        if (this.people[owedBy.id] === this.people[members.id]) continue;

        let toPay = share;
        const due = this.graph[this.people[members.id]][this.people[owedBy.id]];
        const contribute = Math.min(due, share);

        this.graph[this.people[members.id]][this.people[owedBy.id]] = math.add(this.graph[this.people[members.id]][this.people[owedBy.id]], contribute);
        toPay = math.subtract(toPay, contribute);

        this.graph[this.people[owedBy.id]][this.people[members.id]] = math.add(this.graph[this.people[owedBy.id]][this.people[members.id]], toPay);
      }
    }
  }


  calculatechanges(oldgraph, newgraph) {
    const changegraph = this.getoldgraph();
    const sz = changegraph.length;

    for (let i = 0; i < sz; i++) {
      for (let j = 0; j < sz; j++) {
        changegraph[i][j] = newgraph[i][j] - oldgraph[i][j];
      }
    }
    this.justchanges = changegraph;
    const newchange = this.convertmap(changegraph);

    return newchange;
  }
  queryReceivable(q) {
    const receivable = {};
    let rec = 0;
    for (let i = 0; i < this.len; ++i) {
      if (this.justchanges[q][i] === 0) continue;


      receivable.i = this.justchanges[q][i];
      rec += this.justchanges[q][i];
    }
    return rec;
  }

  queryPayable(q) {
    const payable = {};
    let pay = 0;
    for (let i = 0; i < this.len; ++i) {
      if (this.justchanges[i][q] === 0) continue;


      payable.i = this.justchanges[i][q];
      pay += this.justchanges[i][q];
    }

    return pay;
  }

  allDues() {
    const dues = {};
    for (const i in this.graph) {
      dues.i = {
        receive: this.queryReceivable(i),
        pay: this.queryPayable(i),
      };
    }

    return dues;
  }

  userchanges() {
    const userdues = [];
    for (let i = 0; i < this.len; i++) {
      userdues.push(this.queryReceivable(i) - this.queryPayable(i));
    }
    const duemap = this.convertUserDues(userdues);
    return duemap;
  }
}

module.exports = Activity;
