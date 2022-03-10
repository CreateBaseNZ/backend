// MODULES ==================================================

const express = require("express");
const retrieve = require("../algorithms/retrieve.js");
const updateProfile = require("../algorithms/profile/update.js");

// VARIABLES ================================================

const router = new express.Router();
if (process.env.NODE_ENV !== "production") require("dotenv").config();

// MIDDLEWARE ===============================================

const checkAPIKeys = (public = false, private = false, admin = false) => {
	return (req, res, next) => {
		if (public && req.body.API_KEY_PUBLIC !== process.env.API_KEY_PUBLIC) {
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

// @route		POST /profile/retrieve
// @desc
// @access
router.post("/profile/retrieve", checkAPIKeys(false, true), async (req, res) => {
	const input = req.body.input;
	// Fetch the profile instances
	let profiles;
	try {
		profiles = await Profile.find(input.query);
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	if (!profiles.length) return res.send({ status: "failed", content: { profiles: "do not exist" } });
	// Fetch the profiles details
	try {
		profiles = await retrieve.profiles(profiles, input.option);
	} catch (data) {
		return res.send(data);
	}
	// Success handler
	return res.send({ status: "succeeded", content: profiles });
});

// @route		POST /profile/update
// @desc
// @access
router.post("/profile/update", checkAPIKeys(false, true), async (req, res) => {
	const input = req.body.input;
	// Fetch the profile instance
	let profile;
	try {
		profile = await Profile.findOne(input.query);
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	if (!profile) return res.send({ status: "failed", content: { profile: "does not exist" } });
	// Update the profile instance
	try {
		profile = await updateProfile.main(profile, input.updates, input.date);
	} catch (data) {
		return res.send(data);
	}
	// Success handler
	return res.send({ status: "succeeded", content: profile });
});

// @route		POST /profile/delete-saves
// @desc
// @access
router.post("/profile/delete-saves", checkAPIKeys(false, true), async (req, res) => {
	const input = req.body.input;
	// Fetch the profile of interest
	let profile;
	try {
		profile = await Profile.findOne(input.query);
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	if (!profile) return res.send({ status: "failed", content: { profile: "does not exist" } });
	// Delete saves
	for (let i = 0; i < input.properties.length; i++) {
		const property = input.properties[i];
		delete profile.saves[property];
	}
	profile.markModified("saves");
	// Save the updates
	profile.date.modified = input.date;
	try {
		await profile.save();
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	// Success handler
	return res.send({ status: "succeeded", content: profile.saves });
});

// FUNCTIONS ================================================

// EXPORT ===================================================

module.exports = router;

// END ======================================================
