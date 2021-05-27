const router = require('express').Router()
const {
    add,
    verifyUser,
    getQrCode,
    signin,
    addFriend,
    fetchFriends
} = require('../controllers/users');

router.post('/add', add);
router.post('/verify', verifyUser);
router.post('/getCode', getQrCode);
router.post('/signin', signin);
router.post('/addfriend', addFriend);
router.post('/fetchfriend', (req, res) => {
    let out = fetchFriends(req, res);
    //return res.send(out.statusCode).json{

    //};
})

module.exports = router;