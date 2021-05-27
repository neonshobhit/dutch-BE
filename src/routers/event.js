const router = require('express').Router()
const event = require('../controllers/events')


router.post('/newevent', async (req, res) => {
    let out = await event.create(req, res);

    res.status(out.statusCode).json(out)
})


router.post('/addmembers', async (req, res) => {
    let out = await event.addMembers(req, res);

    res.status(out.statusCode).json(out)
})

router.get('/getdues/:id', async (req, res) => {
    let out = await event.getDuesSummary({
        eventId: req.params.id
    });

    res.status(out.statusCode).json(out)
})

router.get('/getmembers/:id', async (req, res) => {
    let out = await event.getMembersList({
        eventId: req.params.id
    });

    res.status(out.statusCode).json(out)
})

router.post('/display', async (req, res) => {
    let out = await event.display(req, res);

    res.status(out.statusCode).json(out)
})

module.exports = router