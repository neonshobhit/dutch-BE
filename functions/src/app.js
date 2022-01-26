require("dotenv").config({ path: `${__dirname}/./../.env` });
const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
require("./routers/telegram");
const app = express();
require("./models/Telegram");
// const morgan = require('morgan')
app.use(
	cors({
		origin: true,
	}),
);
app.use(express.json());
// app.use(morgan('tiny'))
// Assigning multipe times so that we can depl
// each one as an individual function at Cloud Funcitions
const users = app;
const records = app;
const friends = app;
const events = app;

users.use("/users", require("./routers/users"));
records.use("/records", require("./routers/records"));
friends.use("/friends", require("./routers/friends"));
events.use("/events", require("./routers/event"));

// app.use("/users", require("./routers/users"));
// app.use("/records", require("./routers/records"));
// app.use("/friends", require("./routers/friends"));
// app.use("/events", require("./routers/event"));

app.get("*", (req, res) => {
	res.send("hello world");
});

// app.post('*', (req, res) => {
//     //console.log(req.body);
//     //console.log(req.headers);
//     console.log(req.header("authorization"));
//     res.send("hello world")
// })
if (process.env.ENV) {
	const port = require("./config/env").server.port;
	app.listen(port, () => {
		console.log("server is up and running", port);
	});
}
// exports.module = functions.https.onRequest(app);

exports.users = functions.https.onRequest(users);
exports.records = functions.https.onRequest(records);
exports.friends = functions.https.onRequest(friends);
exports.ev = functions.https.onRequest(events);
