// eslint-disable-next-line new-cap
const router = require("express").Router();
const event = require("../controllers/events");
const { decode } = require("../services/auth");

router.post("/newevent", async (req, res) => {
	const out = await event.create(req, res);

	res.status(out.statusCode).json(out);
});

router.post("/addmembers", async (req, res) => {
	const out = await event.addMembers(req, res);

	res.status(out.statusCode).json(out);
});

router.get("/getdues/:id", async (req, res) => {
	const out = await event.getDuesSummary({
		eventId: req.params.id,
	});

	res.status(out.statusCode).json(out);
});

router.get("/getmembers/:id", async (req, res) => {
	const out = await event.getMembersList({
		eventId: req.params.id,
	});

	res.status(out.statusCode).json(out);
});

router.get("/display/:eventId", decode, async (req, res) => {
	const out = await event.display(req, res);

	res.status(out.statusCode).json(out);
});
module.exports = router;
