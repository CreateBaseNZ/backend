// MODULES ==================================================

const express = require("express");
const agenda = require("../configs/agenda.js");

// VARIABLES ================================================

if (process.env.NODE_ENV !== "production") require("dotenv").config();
const router = new express.Router();
const { google } = require("googleapis");

// MODELS ===================================================

const Account = require("../model/Account.js");
const Mail = require("../model/Mail.js");
const Profile = require("../model/Profile.js");

// ROUTES ===================================================

// @route   POST /temp/notify-users
// @desc
// @access  PUBLIC
router.post("/temp/notify-users", async (req, res) => {
	// Validate if the PRIVATE_API_KEY match
	if (req.body.PRIVATE_API_KEY !== process.env.PRIVATE_API_KEY) return res.send({ status: "critical error" });
	// Validate if the ADMIN_API_KEY match
	if (req.body.ADMIN_API_KEY !== process.env.ADMIN_API_KEY) return res.send({ status: "critical error" });
	// Set authentication
	const auth = new google.auth.GoogleAuth({ keyFile: "credentials.json", scopes: "https://www.googleapis.com/auth/spreadsheets" });
	// Create client instance for auth
	const client = await auth.getClient();
	// Create instance of Google Sheets API
	const googleSheets = google.sheets({ version: "v4", auth: client });
	const spreadsheetId = process.env.GSHEET_USER_BASE;
	const sheet = await googleSheets.spreadsheets.values.get({ auth, spreadsheetId, range: "default" });
	const arrays = sheet.data.values;
	arrays.shift();
	let users = [];
	for (let i = 0; i < arrays.length; i++) {
		if (arrays[i][2] === "y" ? true : false) users.push({ email: arrays[i][0].toLowerCase(), name: arrays[i][3] });
	}
	// Notify existing user base
	const baseDate = new Date();
	for (let j = 0; j < users.length; j++) {
		const user = users[j];
		// Send the email
		const option = {
			recipient: user.email,
			name: user.name,
			receive: `notify-user-base`,
			notification: "general",
			tone: "friendly",
		};
		const scheduleDate = new Date(baseDate.setSeconds(baseDate.getSeconds() + j));
		agenda.schedule(scheduleDate, "email", { option });
	}
	// Success handler
	return res.send({ status: "succeeded" });
});

// @route   POST /temp/subscribe-users
// @desc
// @access  PUBLIC
router.post("/temp/subscribe-users", async (req, res) => {
	// Validate if the PRIVATE_API_KEY match
	if (req.body.PRIVATE_API_KEY !== process.env.PRIVATE_API_KEY) return res.send({ status: "critical error" });
	// Validate if the ADMIN_API_KEY match
	if (req.body.ADMIN_API_KEY !== process.env.ADMIN_API_KEY) return res.send({ status: "critical error" });
	// Set authentication
	const auth = new google.auth.GoogleAuth({ keyFile: "credentials.json", scopes: "https://www.googleapis.com/auth/spreadsheets" });
	// Create client instance for auth
	const client = await auth.getClient();
	// Create instance of Google Sheets API
	const googleSheets = google.sheets({ version: "v4", auth: client });
	const spreadsheetId = process.env.GSHEET_USER_BASE;
	const sheet = await googleSheets.spreadsheets.values.get({ auth, spreadsheetId, range: "default" });
	const arrays = sheet.data.values;
	arrays.shift();
	let subscribers = [];
	for (let i = 0; i < arrays.length; i++) {
		if (arrays[i][1] === "y" ? true : false) subscribers.push({ email: arrays[i][0].toLowerCase(), name: arrays[i][3] });
	}
	// Re-subscribe subscribers
	const baseDate = new Date();
	for (let j = 0; j < subscribers.length; j++) {
		const subscriber = subscribers[j];
		// Check if the Mail instance already exist
		let mail;
		try {
			mail = await Mail.findOne({ email: subscriber.email });
		} catch (error) {
			return res.send({ status: "error", content: error });
		}
		if (mail) {
			if (!mail.notification.newsletter) {
				// Subscribe the mail instance
				mail.notification.newsletter = true;
				if (!mail.received.some((el) => el.tag === "newsletter-new-subscriber")) {
					mail.received.push({ tag: "newsletter-new-subscriber", date: new Date().toString() });
				}
			}
		} else {
			// Create a new mail instance
			mail = new Mail({
				email: subscriber.email,
				notification: { newsletter: true },
				metadata: { name: subscriber.name },
				received: [{ tag: "newsletter-new-subscriber", date: new Date().toString() }],
			});
		}
		// Save the mail instance
		if (mail.isModified()) {
			try {
				await mail.save();
			} catch (error) {
				return res.send({ status: "error", content: error });
			}
		}
		// Send the email
		const option = {
			recipient: mail.email,
			receive: `global-launch`,
			notification: "newsletter",
			tone: "friendly",
			unsubscribe: true,
		};
		const scheduleDate = new Date(baseDate.setSeconds(baseDate.getSeconds() + j));
		agenda.schedule(scheduleDate, "email", { option });
	}
	// Success handler
	return res.send({ status: "succeeded" });
});

// FUNCTIONS ================================================

function validateEmail(input = "") {
	// Email REGEX
	let emailRE = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	// VALIDATIONS
	if (!input) {
		throw new Error("no email input");
	} else if (!emailRE.test(String(input).toLowerCase())) {
		throw new Error("invalid email input");
	}
	return;
}

// EXPORT ===================================================

module.exports = router;

// END ======================================================
