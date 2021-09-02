// MODULES ==================================================

const express = require("express");

// VARIABLES ================================================

if (process.env.NODE_ENV !== "production") require("dotenv").config();
const router = new express.Router();

// MODELS ===================================================

const Account = require("../model/Account.js");
const License = require("../model/License.js");
const Organisation = require("../model/Organisation.js");
const Profile = require("../model/Profile.js");

// ROUTES ===================================================

// @route     POST /profile/update
// @desc
// @access    Backend
router.post("/profile/update", async (req, res) => {
	// Validate if the PRIVATE_API_KEY match
	if (req.body.PRIVATE_API_KEY !== process.env.PRIVATE_API_KEY) {
		return res.send({ status: "critical error", content: "Invalid API Key" });
	}
	// Update the profile
	try {
		await Profile.reform(req.body.input);
	} catch (data) {
		return res.send(data);
	}
	// Success handler
	return res.send({ status: "succeeded", content: "The profile has been updated" });
});

// @route     POST /profile/read
// @desc
// @access    Backend
router.post("/profile/read", async (req, res) => {
	// Validate if the PRIVATE_API_KEY match
	if (req.body.PRIVATE_API_KEY !== process.env.PRIVATE_API_KEY) {
		return res.send({ status: "critical error", content: "Invalid API Key" });
	}
	// Read data
	let data;
	try {
		data = await Profile.retrieve(req.body.input);
	} catch (data) {
		return res.send(data);
	}
	// Success handler
	return res.send({ status: "succeeded", content: data });
});

// @route     POST /profile/delete-saves
// @desc
// @access    Backend
router.post("/profile/delete-saves", async (req, res) => {
	// Validate if the PRIVATE_API_KEY match
	if (req.body.PRIVATE_API_KEY !== process.env.PRIVATE_API_KEY) {
		return res.send({ status: "critical error", content: "Invalid API Key" });
	}
	// Delete data
	try {
		await Profile.demolishSaves(req.body.input);
	} catch (data) {
		return res.send(data);
	}
	// Success handler
	return res.send({ status: "succeeded", content: "The data has been deleted" });
});

// EXPORT ===================================================

module.exports = router;

// END ======================================================
