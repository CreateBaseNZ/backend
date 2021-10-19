// MODULES ==================================================

const express = require("express");
const path = require("path");

// VARIABLES ================================================

if (process.env.NODE_ENV !== "production") require("dotenv").config();
const router = new express.Router();
const { google } = require("googleapis");
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
	mail.notification.cold = false;
	// If the subscriber is completely brand new, send a welcome email
	const options = {
		recipient: req.body.input.email,
		receive: "new-subscriber",
		notification: "newsletter",
		tone: "friendly",
		site: true,
		help: true,
		social: true,
		unsubscribe: true,
	};
	let status;
	try {
		status = await mail.sendEmail(options);
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
	return res.send({ status: "succeeded" });
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
	return res.send({ status: "succeeded" });
});

// @route   POST /mail/retrieve-options
// @desc
// @access
router.post("/mail/retrieve-options", async (req, res) => {
	// Validate if the PRIVATE_API_KEY match
	if (req.body.PRIVATE_API_KEY !== process.env.PRIVATE_API_KEY) {
		return res.send({ status: "critical error" });
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

// @route   POST /mail/admin/update-cold-emails
// @desc
// @access
router.post("/mail/admin/update-cold-emails", async (req, res) => {
	// Validate if the PRIVATE_API_KEY match
	if (req.body.PRIVATE_API_KEY !== process.env.PRIVATE_API_KEY) {
		return res.send({ status: "critical error" });
	}
	// Validate if the ADMIN_API_KEY match
	if (req.body.ADMIN_API_KEY !== process.env.ADMIN_API_KEY) {
		return res.send({ status: "critical error" });
	}
	// Set authentication
	const auth = new google.auth.GoogleAuth({
		keyFile: "credentials.json",
		scopes: "https://www.googleapis.com/auth/spreadsheets",
	});
	// Create client instance for auth
	const client = await auth.getClient();
	// Create instance of Google Sheets API
	const googleSheets = google.sheets({ version: "v4", auth: client });
	// https://docs.google.com/spreadsheets/d/1rAkSeFlOyLNeLCr3GPwI7TG8sHc9AOpnF1VMD9Qt1vM/edit?usp=sharing
	const spreadsheetId = "1rAkSeFlOyLNeLCr3GPwI7TG8sHc9AOpnF1VMD9Qt1vM";
	// Read rows from spreadsheet
	// New Zealand
	const nz = await googleSheets.spreadsheets.values.get({ auth, spreadsheetId, range: "New Zealand" });
	nz.data.values.shift();
	for (let i = 0; i < nz.data.values.length; i++) {
		const name = nz.data.values[i][0];
		const email = nz.data.values[i][1];
		const school = nz.data.values[i][2];
		const segment = nz.data.values[i][3];
		// Check if a mail instance with this email exist
		let mail;
		try {
			mail = await Mail.findOne({ email });
		} catch (error) {
			return res.send({ status: "error", content: error });
		}
		if (mail) continue;
		mail = new Mail({ email, notification: { cold: true }, metadata: { name, type: "customer-school", school, segment, country: "nz" } });
		try {
			await mail.save();
		} catch (error) {
			return res.send({ status: "error", content: error });
		}
	}
	// Singapore
	const sg = await googleSheets.spreadsheets.values.get({ auth, spreadsheetId, range: "Singapore" });
	sg.data.values.shift();
	for (let i = 0; i < sg.data.values.length; i++) {
		const name = sg.data.values[i][0];
		const email = sg.data.values[i][1];
		const school = sg.data.values[i][2];
		const segment = sg.data.values[i][3];
		// Check if a mail instance with this email exist
		let mail;
		try {
			mail = await Mail.findOne({ email });
		} catch (error) {
			return res.send({ status: "error", content: error });
		}
		if (mail) continue;
		mail = new Mail({ email, notification: { cold: true }, metadata: { name, type: "customer-school", school, segment, country: "sg" } });
		try {
			await mail.save();
		} catch (error) {
			return res.send({ status: "error", content: error });
		}
	}
	// United Kingdom
	const uk = await googleSheets.spreadsheets.values.get({ auth, spreadsheetId, range: "United Kingdom" });
	uk.data.values.shift();
	for (let i = 0; i < uk.data.values.length; i++) {
		const name = uk.data.values[i][0];
		const email = uk.data.values[i][1];
		const school = uk.data.values[i][2];
		const segment = uk.data.values[i][3];
		// Check if a mail instance with this email exist
		let mail;
		try {
			mail = await Mail.findOne({ email });
		} catch (error) {
			return res.send({ status: "error", content: error });
		}
		if (mail) continue;
		mail = new Mail({ email, notification: { cold: true }, metadata: { name, type: "customer-school", school, segment, country: "uk" } });
		try {
			await mail.save();
		} catch (error) {
			return res.send({ status: "error", content: error });
		}
	}
	// Success handler
	return res.send({ status: "succeeded" });
});

// @route   POST /mail/admin/send-cold-emails
// @desc
// @access
router.post("/mail/admin/send-cold-emails", async (req, res) => {
	// Validate if the PRIVATE_API_KEY match
	if (req.body.PRIVATE_API_KEY !== process.env.PRIVATE_API_KEY) {
		return res.send({ status: "critical error" });
	}
	// Validate if the ADMIN_API_KEY match
	if (req.body.ADMIN_API_KEY !== process.env.ADMIN_API_KEY) {
		return res.send({ status: "critical error" });
	}
	// Fetch mails
	let mails;
	try {
		mails = await Mail.find({ "notification.cold": true, "metadata.type": "customer-school" });
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	// Send emails
	for (let i = 0; i < mails.length; i++) {
		let mail = mails[i];
		const options = {
			recipient: mail.email,
			receive: `test-${mail.metadata.country}-${mail.metadata.segment}`,
			notification: "cold",
			tone: "formal",
			school: mail.metadata.school,
		};
		let status;
		try {
			status = await mail.sendEmail(options);
		} catch (data) {
			return res.send(data);
		}
		// Save the updates
		try {
			await mail.save();
		} catch (error) {
			return res.send({ status: "error", content: error });
		}
	}
	// Success handler
	return res.send({ status: "succeeded" });
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
