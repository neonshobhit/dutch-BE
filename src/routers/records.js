const router = require('express').Router()
const event=require('../controllers/records')
router.post('/transaction', (req, res) => {
    event.addTransaction(req,res);
    res.send("Add")
})

module.exports = router