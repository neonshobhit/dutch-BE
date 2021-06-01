// eslint-disable-next-line new-cap
const router = require("express").Router();
const event = require("../controllers/records");
router.post("/transaction", async (req, res) => {
  const x = await event.addTransaction(req, res);
  res.status(x.statusCode).send(x);
});

module.exports = router;
