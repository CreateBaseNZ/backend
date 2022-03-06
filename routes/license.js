// MODULES ==================================================

const express = require("express");
const retrieve = require("../algorithms/retrieve.js");
const licenseUpdate = require("../algorithms/license/update.js");

// VARIABLES ================================================

const router = new express.Router();
if (process.env.NODE_ENV !== "production") require("dotenv").config();

// MIDDLEWARE ===============================================

const checkAPIKeys = (public = false, private = false, admin = false) => {
	return (req, res, next) => {
		if (public && req.body.PUBLIC_API_KEY !== process.env.PUBLIC_API_KEY) {
			return res.send({ status: "critical error" });
		}
		if (private && req.body.API_KEY_PRIVATE !== process.env.API_KEY_PRIVATE) {
			return res.send({ status: "critical error" });
		}
		if (admin && req.body.API_KEY_ADMIN !== process.env.API_KEY_ADMIN) {
			return res.send({ status: "critical error" });
		}
		return next();
	};
};

// MODELS ===================================================

const Account = require("../model/Account.js");
const Class = require("../model/Class.js");
const Group = require("../model/Group.js");
const License = require("../model/License.js");
const Mail = require("../model/Mail.js");
const Profile = require("../model/Profile.js");

// ROUTES ===================================================

// @route		POST /license/retrieve
// @desc
// @access
router.post("/license/retrieve", checkAPIKeys(false, true), async (req, res) => {
	const input = req.body.input;
	// Fetch the license instances
	let licenses;
	try {
		licenses = await License.find(input.query);
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	if (!licenses.length) return res.send({ status: "failed", content: { licenses: "do not exist" } });
	// Fetch the licenses details
	try {
		licenses = await retrieve.licenses(licenses, input.option);
	} catch (data) {
		return res.send(data);
	}
	// Success handler
	return res.send({ status: "succeeded", content: licenses });
});

// @route		POST /license/update
// @desc
// @access
router.post("/license/update", checkAPIKeys(false, true), async (req, res) => {
	const input = req.body.input;
	// Fetch the license instance
	let license;
	try {
		license = await License.findOne(input.query);
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	if (!license) return res.send({ status: "failed", content: { license: "does not exist" } });
	// Update the license instance
	try {
		license = await licenseUpdate.main(license, input.updates, input.date);
	} catch (data) {
		return res.send(data);
	}
	// Success handler
	return res.send({ status: "succeeded", content: license });
});

// @route		POST /license/delete-metadata
// @desc
// @access
router.post("/license/delete-metadata", checkAPIKeys(false, true), async (req, res) => {
	const input = req.body.input;
	// Fetch the license of interest
	let license;
	try {
		license = await License.findOne(input.query);
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	if (!license) res.send({ status: "failed", content: { license: "does not exist" } });
	// Delete metadata
	for (let i = 0; i < input.properties.length; i++) {
		const property = input.properties[i];
		delete license.metadata[property];
	}
	license.markModified("metadata");
	// Save the updates
	license.date.modified = input.date;
	try {
		await license.save();
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	// Success handler
	return res.send({ status: "succeeded", content: license.metadata });
});

// FUNCTIONS ================================================

// EXPORT ===================================================

module.exports = router;

// END ======================================================
