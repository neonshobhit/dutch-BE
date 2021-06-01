exports.dutch = (graph, splitIn, amount, paidBy) => {
  const len = splitIn.length;
  const share = (amount / len).toFixed(2);

  for (let i = 0; i < len; ++i) {
    if (i == paidBy) continue;
    let toPay = share;

    const due = graph[paidBy][splitIn[i]];
    const contribution = Math.min(due, share);

    graph[paidBy][splitIn[i]] -= contribution;
    toPay -= contribution;

    graph[splitIn[i]][paidBy] += toPay;
  }

  return graph;
};
