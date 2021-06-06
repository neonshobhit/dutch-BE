// eslint-disable-next-line new-cap
const router = require("express").Router();
const user = require("../controllers/users");
const {
  checkValidation,
} = require("../middleware/users");
const { decode } = require("../services/auth");

router.post("/add", async (req, res) => {
  const out = await user.add(req, res);
  res.status(out.statusCode).json(out);
});

router.post("/verify", async (req, res) => {
  const out = await user.verifyUser(req, res);
  res.status(out.statusCode).json(out);
});

router.post("/getCode", async (req, res) => {
  const out = await user.getQrCode(req, res);
  res.status(out.statusCode).json(out);
});

router.post("/signin", async (req, res) => {
  const out = await user.signin(req, res);
  res.status(out.statusCode).json(out);
});

router.post("/addfriend", decode, async (req, res) => {
  const out = await user.addFriend(req, res);
  res.status(out.statusCode).json(out);
});

router.post("/fetchfriend", decode, async (req, res) => {
  const out = await user.fetchFriends(req, res);
  res.status(out.statusCode).json(out);
});

router.get("/profile", decode, async (req, res) => {
  // console.log(req.user)
  const out = await user.profile({
    userId: req.user.userId,
  });

  res.status(out.statusCode).json(out);
});
module.exports = router;
