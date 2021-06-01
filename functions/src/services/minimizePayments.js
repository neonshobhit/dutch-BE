const Activity = require("../models/Activity");
const Balance = require("../models/Balance");

const minimizingPayments = (eventInfo, entryData) => {
  const Activityobject = new Activity(eventInfo.members, eventInfo.graph);

  const oldgraph = Activityobject.getoldgraph();


  Activityobject.dutch(entryData.share);
  let newgraph = Activityobject.getoldgraph();


  const BalanceObject = new Balance(newgraph);
  newgraph = BalanceObject.simplify();

  const graphchange = Activityobject.calculatechanges(oldgraph, newgraph);

  const userchange = Activityobject.userchanges();

  const newmap = Activityobject.convertToMap(newgraph);
  return [graphchange, userchange, newmap];
};

module.exports = minimizingPayments;
