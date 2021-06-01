// eslint-disable-next-line new-cap
const router = require("express").Router();

router.get("/add", (req, res) => {
  res.send("Add");
});

module.exports = router;
