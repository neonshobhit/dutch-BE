const router = require('express').Router()
const event=require('../controllers/events')
router.post('/newevent', (req, res) => {
    event.create(req,res);

    res.send("newevent")
})


router.post('/addmembers', (req, res) => {
    event.addMembers(req,res);

    res.send("member added")
})

router.post('/getdues', (req, res) => {
    event.getDuesSummary(req,res);

    res.send("dues")
})

router.post('/getmembers', (req, res) => {
    event.getDuesSummary(req,res);

    res.send("members")
})

router.post('/display', (req, res) => {
    event.display(req,res);

    res.send("display")
})

module.exports = router