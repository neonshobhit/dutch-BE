// eslint-disable-next-line new-cap
const router = require("express").Router();
const {
  add,
  verifyUser,
  getQrCode,
  signin,
  addFriend,
  fetchFriends,
  profile,
} = require("../controllers/users");
const {
  checkValidation,
} = require("../middleware/users");

router.post("/add", add);
router.post("/verify", verifyUser);
router.post("/getCode", getQrCode);
router.post("/signin", signin);
router.post("/addfriend", addFriend);
router.post("/fetchfriend", (req, res) => {
  const out = fetchFriends(req, res);
  // return res.send(out.statusCode).json{

  // };
});

router.get("/profile", checkValidation, async (req, res) => {
  // console.log(req.user)
  const out = await profile({
    userId: req.user.id,
  });

  res.status(out.statusCode).json(out);
});
module.exports = router;
