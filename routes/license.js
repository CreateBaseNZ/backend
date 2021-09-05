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

// @route     POST /license/update
// @desc
// @access    Backend
router.post("/license/update", async (req, res) => {
	// Validate if the PRIVATE_API_KEY match
	if (req.body.PRIVATE_API_KEY !== process.env.PRIVATE_API_KEY) {
		return res.send({ status: "critical error", content: "" });
	}
	// Update the license
	try {
		await License.reform(req.body.input);
	} catch (data) {
		return res.send(data);
	}
	// Success handler
	return res.send({ status: "succeeded", content: "" });
});

// @route     POST /license/read
// @desc
// @access    Backend
router.post("/license/read", async (req, res) => {
	// Validate if the PRIVATE_API_KEY match
	if (req.body.PRIVATE_API_KEY !== process.env.PRIVATE_API_KEY) {
		return res.send({ status: "critical error", content: "" });
	}
	// Retrieve the information
	let data;
	try {
		data = await License.retrieve(req.body.input);
	} catch (data) {
		return res.send(data);
	}
	// Success handler
	return res.send({ status: "succeeded", content: data });
});

// @route     POST /license/validate-password
// @desc
// @access    Backend
router.post("/license/validate-password", async (req, res) => {
	// Validate if the PRIVATE_API_KEY match
	if (req.body.PRIVATE_API_KEY !== process.env.PRIVATE_API_KEY) {
		return res.send({ status: "critical error", content: "" });
	}
	// Fetch the license
	let license;
	try {
		license = await License.findOne({ _id: req.body.input.license });
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	// Validate password
	let match;
	try {
		match = await license.validatePassword(req.body.input.password);
	} catch (data) {
		return res.send(data);
	}
	// Process validation
	if (!match) {
		return res.send({ status: "failed", content: { password: "incorrect password" } });
	}
	// Success handler
	return res.send({ status: "succeeded", content: "" });
});

// EXPORT ===================================================

module.exports = router;

// END ======================================================
