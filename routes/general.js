// MODULES ==================================================

if (process.env.NODE_ENV !== "production") require("dotenv").config();
const express = require("express");
const path = require("path");
const axios = require("axios");
const moment = require("moment");
const { google } = require("googleapis");

// VARIABLES ================================================

const router = new express.Router();
const viewsOption = { root: path.join(__dirname, "../views") };
if (process.env.NODE_ENV !== "production") require("dotenv").config();

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

const Mail = require("../model/Mail.js");
const Data = require("../model/Data.js");

// ROUTES ===================================================

// @route     Get /
// @desc
// @access    Public
router.get("/", (req, res) => res.sendFile("home.html", viewsOption));

// @route     Get /team
// @desc
// @access    Public
router.get("/team", (req, res) => res.sendFile("team.html", viewsOption));

// @route     Get /about
// @desc
// @access    Public
router.get("/about", (req, res) => res.sendFile("about.html", viewsOption));

// @route     Get /latest
// @desc
// @access    Public
router.get("/latest", (req, res) => res.sendFile("latest.html", viewsOption));

// @route     GET /terms
// @desc
// @access    PUBLIC
router.get("/terms", (req, res) => res.sendFile("terms.html", viewsOption));

// @route     GET /contact
// @desc
// @access    PUBLIC
router.get("/contact", (req, res) => res.sendFile("contact.html", viewsOption));

// @route     GET /privacy
// @desc
// @access    PUBLIC
router.get("/privacy", (req, res) => res.sendFile("privacy.html", viewsOption));

// @route     GET /landing
// @desc
// @access    PUBLIC
router.get("/landing", (req, res) => res.sendFile("landing.html", viewsOption));

// @route     GET /release-notes
// @desc
// @access    PUBLIC
router.get("/release-notes", (req, res) => res.sendFile("release-notes.html", viewsOption));

// @route     GET /robots.txt
// @desc
// @access    PUBLIC
router.get("/robots.txt", (req, res) => res.sendFile("robots.txt", viewsOption));

// @route     POST /tracking
// @desc
// @access    Public
router.post("/tracking", checkAPIKeys(false, true), async (req, res) => {
	// let data;
	// try {
	// 	data = (await Data.find())[0];
	// } catch (error) {
	// 	return res.send({ status: "error", content: error });
	// }
	// // Process the data
	// let rawData = data.content.split("\n");
	// console.log(JSON.parse(rawData[0]));
	// rawData.pop();
	let outputs = [];
	// for (let i = 0; i < rawData.length; i++) {
	// 	rawData[i] = JSON.parse(rawData[i]);
	// 	// Check if there's any filter provided
	// 	let add = false;
	// 	if (req.body.input.filters.length) {
	// 		// Check if the rawData[i] has a filter with the said event name
	// 		const filter = req.body.input.filters.find((el) => el.event === rawData[i].event);
	// 		if (!filter) continue;
	// 		// Filter the data based on the property combination
	// 		if (filter.properties) {
	// 			for (let j = 0; j < filter.properties.length; j++) {
	// 				const el = filter.properties[j];
	// 				let valid = true;
	// 				for (const key in el) {
	// 					if (Array.isArray(rawData[i].properties[key])) {
	// 						if (!rawData[i].properties[key].includes(el[key])) valid = false;
	// 					} else {
	// 						if (rawData[i].properties[key] !== el[key]) valid = false;
	// 					}
	// 				}
	// 				if (valid) {
	// 					add = true;
	// 					break;
	// 				}
	// 			}
	// 		} else {
	// 			add = true;
	// 		}
	// 	} else {
	// 		add = true;
	// 	}
	// 	if (add) outputs.push(rawData[i]);
	// }
	return res.send({ status: "succeeded", content: outputs });
});

// @route     GET /fetch-release-notes
// @desc
// @access    Public
router.get("/fetch-release-notes", async (req, res) => {
	// Set authentication
	const auth = new google.auth.GoogleAuth({
		keyFile: "credentials.json",
		scopes: ["https://www.googleapis.com/auth/spreadsheets", "https://www.googleapis.com/auth/drive.metadata"],
	});
	// Create client instance for auth
	const client = await auth.getClient();

	const spreadsheetId = "1iopXot5OoZwc1KAsztCCxpiQILCK8tsvxCcHdBCv33Q";

	const googleDrive = google.drive({ version: "v3", auth: client });

	let driveResult;
	try {
		driveResult = (
			await googleDrive.files.get({
				fileId: spreadsheetId,
				fields: "modifiedTime",
			})
		)["data"];
	} catch (error) {
		console.log(error);
	}

	const date = Date.parse(driveResult.modifiedTime);

	// Create instance of Google Sheets API
	const googleSheets = google.sheets({ version: "v4", auth: client });
	let i = 0;
	let releaseNotes = [];
	while (true) {
		let releaseNote = { version: undefined, content: [] };
		let result;
		try {
			result = await googleSheets.spreadsheets.values.get({
				auth,
				spreadsheetId,
				range: i.toString(),
			});
		} catch (error) {
			break;
		}
		let values = result.data.values;
		releaseNote.version = values[0][1];
		values.shift();
		values.shift();
		for (let j = 0; j < values.length; j++) {
			const value = values[j];
			if (value[0] === "image") {
				releaseNote.content.push({ type: value[0], url: value[1] });
			} else {
				releaseNote.content.push({ type: value[0], html: value[1] });
			}
		}
		releaseNotes.push(releaseNote);
		i++;
	}
	return res.send({ releaseNotes, date });
});

// EXPORT ===================================================

module.exports = router;

// END ======================================================
