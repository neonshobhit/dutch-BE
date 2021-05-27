const Activity = require("../models/Activity");
const Balance = require("../models/Balance");

module.exports = minimizingPayments = (eventInfo, entryData) => {
    let Activityobject = new Activity(eventInfo.members, eventInfo.graph);

    let oldgraph = Activityobject.getoldgraph();


    Activityobject.dutch(entryData.share);
    let newgraph = Activityobject.getoldgraph();


    let BalanceObject = new Balance(newgraph);
    newgraph = BalanceObject.simplify();

    let graphchange = Activityobject.calculatechanges(oldgraph, newgraph);

    let userchange = Activityobject.userchanges();

    let newmap = Activityobject.convertToMap(newgraph);
    return [graphchange, userchange, newmap];
}