// eslint-disable-next-line new-cap
const router = require("express").Router();
const event = require("../controllers/records");
const { decode } = require("../services/auth");

router.post("/transaction", async (req, res) => {
  const x = await event.addTransaction(req, res);
  res.status(x.statusCode).send(x);
});

router.post("/add-message", async (req, res) => {
  const x = await event.addMessageActivity(req, res);
  res.status(x.statusCode).json(x);
});

router.post("/add-settlement", decode, async (req, res) => {
  const x = await event.addSettlementActivity(req, res);
  res.status(x.statusCode).json(x);
});

router.get("/get-records", async (req, res) => {
  const x = await event.fetchRecords(req, res);
  res.status(x.statusCode).json(x);
});

module.exports = router;
