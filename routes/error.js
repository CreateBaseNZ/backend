// MODULES ==================================================

const express = require("express");
const path = require("path");
const agenda = require("../configs/agenda.js");

// VARIABLES ================================================

const router = new express.Router();
const viewsOption = { root: path.join(__dirname, "../views") };

// MIDDLEWARE ===============================================

const checkAPIKeys = (public = false, private = false, admin = false) => {
	return (req, res, next) => {
		if (public && req.body.PUBLIC_API_KEY !== process.env.PUBLIC_API_KEY) {
			return res.send({ status: "critical error" });
		}
		if (private && req.body.PRIVATE_API_KEY !== process.env.PRIVATE_API_KEY) {
			return res.send({ status: "critical error" });
		}
		if (admin && req.body.ADMIN_API_KEY !== process.env.ADMIN_API_KEY) {
			return res.send({ status: "critical error" });
		}
		return next();
	};
};

// MODELS ===================================================

const Fault = require("../model/Fault.js");

// ROUTES ===================================================

router.get("*", (req, res) => res.status(404).sendFile("error-404.html", viewsOption));

router.post("/error/new", checkAPIKeys(false, true), async (req, res) => {
	const input = req.body.input;
	// Create the error
	const fault = new Fault({
		email: input.email,
		profile: input.profile,
		route: input.route,
		type: input.type,
		date: input.date,
		message: input.message,
		metadata: input.metadata,
	});
	// Save the new error
	try {
		await fault.save();
	} catch (error) {
		return res.send(error);
	}
	// Notify the team
	const option = {
		name: "team",
		receive: "error-notif",
		notification: "createbase",
		tone: "friendly",
		email: fault.email,
		type: fault.type,
		route: fault.route,
		message: fault.message,
	};
	await agenda.now("email", { option });
	// Success handler
	return res.send({ status: "succeeded" });
});

// EXPORT ===================================================

module.exports = router;

// END ======================================================
