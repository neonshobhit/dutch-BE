const router = require('express').Router()
const event = require('../controllers/records')
router.post('/transaction', async (req, res) => {
    let x = await event.addTransaction(req, res);
    res.status(x.statusCode).send(x)
})

module.exports = router