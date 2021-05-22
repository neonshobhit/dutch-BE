const router = require('express').Router()
const { add, verifyUser, getQrCode, signin } = require('../controllers/users');

router.post('/add',add);
router.post('/verify',verifyUser);
router.post('/getCode',getQrCode);
router.post('/signin',signin);

module.exports = router;