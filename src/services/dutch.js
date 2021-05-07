exports.dutch = (graph, splitIn, amount, paidBy) => {
    let len = splitIn.length
    let share = (amount / len).toFixed(2);

    for (let i = 0; i < len; ++i) {
        if (i == paidBy) continue;
        let toPay = share;

        let due = graph[paidBy][splitIn[i]]
        let contribution = Math.min(due, share)

        graph[paidBy][splitIn[i]] -= contribution;
        toPay -= contribution;

        graph[splitIn[i]][paidBy] += toPay;
    }

    return graph;
}