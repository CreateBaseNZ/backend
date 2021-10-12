// MODULES ==================================================

const express = require("express");
const path = require("path");

// VARIABLES ================================================

if (process.env.NODE_ENV !== "production") require("dotenv").config();
const router = new express.Router();
const viewsOption = { root: path.join(__dirname, "../views") };

// MODELS ===================================================

const Mail = require("../model/Mail.js");

// ROUTES ===================================================

// @route   POST /mail/subscribe-newsletter
// @desc
// @access  PUBLIC
router.post("/mail/subscribe-newsletter", async (req, res) => {
	// Check if email input is valid
	try {
		await validateEmail(req.body.input.email);
	} catch (data) {
		return res.send(data);
	}
	// Check if the Mail instance already exist
	let mail;
	try {
		mail = await Mail.findOne({ email: req.body.input.email });
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	// If no Mail instance exist, create one
	if (!mail) mail = new Mail({ email: req.body.input.email });
	// If Mail instance is not subscribed to newsletters, turn the option on
	if (mail.notification.newsletter) {
		return res.send({ status: "failed", content: "already subscribed" });
	}
	mail.notification.newsletter = true;
	// If the subscriber is completely brand new, send a welcome email
	const options = {
		recipient: req.body.input.email,
		subject: "Thank you for signing up for our newsletter!",
		receive: "new-subscriber",
		notification: "newsletter",
		tone: "friendly",
		site: true,
		help: true,
		social: true,
		unsubscribe: true,
	};
	try {
		await mail.sendEmail(options);
	} catch (data) {
		return res.send(data);
	}
	// Save the updates
	try {
		await mail.save();
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	// Success handler
	return res.send({ status: "succeeded", content: undefined });
});

// @route   GET /mail/unsubscribe-newsletter/:email
// @desc
// @access  PUBLIC
router.get("/mail/unsubscribe-newsletter/:email", async (req, res) => {
	// Check if email input is valid
	try {
		await validateEmail(req.params.email);
	} catch (data) {
		return res.status(404).sendFile("error-404.html", viewsOption);
	}
	// Check if the Mail instance exist
	let mail;
	try {
		mail = await Mail.findOne({ email: req.params.email });
	} catch (error) {
		return res.status(404).sendFile("error-404.html", viewsOption);
	}
	// If no Mail instance exist, create one
	if (!mail) return res.sendFile("unsubscribe.html", viewsOption);
	// Check if the Mail instance is already unsubscribed
	if (!mail.notification.newsletter) {
		return res.sendFile("unsubscribe.html", viewsOption);
	}
	mail.notification.newsletter = false;
	// Save the updates
	try {
		await mail.save();
	} catch (error) {
		return res.status(404).sendFile("error-404.html", viewsOption);
	}
	// Success handler
	return res.sendFile("unsubscribe.html", viewsOption);
});

// @route   POST /mail/manage-options
// @desc
// @access
router.post("/mail/manage-options", async (req, res) => {
	// Validate if the PRIVATE_API_KEY match
	if (req.body.PRIVATE_API_KEY !== process.env.PRIVATE_API_KEY) {
		return res.send({ status: "critical error", content: undefined });
	}
	// Fetch the mail instance
	let mail;
	try {
		mail = await Mail.findOne(req.body.input.email);
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	if (!mail) return res.send({ status: "failed", content: "mail instance does not exist" });
	// Update options
	for (const option in req.body.input.notification) {
		mail.notification[option] = req.body.input.notification[option];
	}
	// Save the updates
	try {
		await mail.save();
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	// Success handler
	return res.send({ status: "succeeded", content: undefined });
});

// @route   POST /mail/retrieve-options
// @desc
// @access
router.post("/mail/retrieve-options", async (req, res) => {
	// Validate if the PRIVATE_API_KEY match
	if (req.body.PRIVATE_API_KEY !== process.env.PRIVATE_API_KEY) {
		return res.send({ status: "critical error", content: undefined });
	}
	// Fetch the mail instance
	let mail;
	try {
		mail = await Mail.findOne(req.body.input.email);
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	if (!mail) return res.send({ status: "failed", content: "mail instance does not exist" });
	// Success handler
	return res.send({ status: "succeeded", content: mail.notification });
});

// FUNCTIONS ================================================

function validateEmail(input = "") {
	return new Promise(async (resolve, reject) => {
		// Email REGEX
		let emailRE = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		// VALIDATIONS
		if (!input) {
			return reject({ status: "failed", content: "no email input" });
		} else if (!emailRE.test(String(input).toLowerCase())) {
			return reject({ status: "failed", content: "invalid email input" });
		}
		return resolve();
	});
}

// EXPORT ===================================================

module.exports = router;

// END ======================================================
