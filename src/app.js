const express = require('express')
const app = express()
const morgan = require('morgan')

app.use(express.json())
app.use(morgan('tiny'))
// Assigning multipe times so that we can deply each one as an individual function at Cloud Funcitions
const users = app
const records = app
const friends = app
const events = app

users.use('/users', require('./routers/users'))
records.use('/records', require('./routers/records'))
friends.use('/friends', require('./routers/friends'))
events.use('/events', require('./routers/event'))

// app.get('*', (req, res) => {
//     res.send("hello world")
// })


app.post('*',(req, res) => {
    //console.log(req.body);
    //console.log(req.headers);
    console.log(req.header("authorization"));
    res.send("hello world")
})


app.listen(require('./config/env').server.port, () => {
    console.log("server is up and running")
})
