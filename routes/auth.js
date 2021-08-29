// MODULES ==================================================

const express = require("express");

// VARIABLES ================================================

if (process.env.NODE_ENV !== "production") require("dotenv").config();
const router = new express.Router();

// MODELS ===================================================

const Account = require("../model/Account.js");
const Profile = require("../model/Profile.js");
const License = require("../model/License.js");

// ROUTES ===================================================

// @route     POST /email-login
// @desc
// @access    Backend
router.post("/email-login", async (req, res) => {
	// Validate if the PRIVATE_API_KEY match
	if (req.body.PRIVATE_API_KEY !== process.env.PRIVATE_API_KEY) {
		return res.send({ status: "critical error", content: "Invalid API Key." });
	}
	// Account email login
	let session;
	try {
		session = await Account.login({ email: req.body.input.email, password: req.body.input.password });
	} catch (data) {
		return res.send(data);
	}
	// Success handler
	return res.send({ status: "succeeded", content: session });
});

// @route     POST /username-login
// @desc
// @access    Backend
router.post("/username-login", async (req, res) => {
	console.log("Logging In");
	// Validate if the PRIVATE_API_KEY match
	if (req.body.PRIVATE_API_KEY !== process.env.PRIVATE_API_KEY) {
		return res.send({ status: "critical error", content: "Invalid API Key." });
	}
	// Account username login
	let session;
	try {
		session = await License.login({ username: req.body.input.username, password: req.body.input.password });
	} catch (data) {
		return res.send(data);
	}
	// Success handler
	return res.send({ status: "succeeded", content: session });
});

// @route     POST /signup/educator
// @desc
// @access    Backend
router.post("/signup/educator", async (req, res) => {
	// Validate if the PRIVATE_API_KEY match
	if (req.body.PRIVATE_API_KEY !== process.env.PRIVATE_API_KEY) {
		return res.send({ status: "critical error", content: "Invalid API Key." });
	}
	// Create the account
	const accountObject = {
		email: req.body.input.email,
		password: req.body.input.password,
		date: req.body.input.date,
	};
	// Create the profile
	const profileObject = {
		displayName: req.body.input.displayName,
		date: req.body.input.date,
	};
	// Create the license
	const licenseObject = {
		username: req.body.input.username,
		password: req.body.input.password,
		statuses: [{ type: "free", date: req.body.input.date }],
		access: "educator",
		date: req.body.input.date,
	};
	// Create these instances
	let account;
	let profile;
	let license;
	const promises1 = [Account.build(accountObject, false), Profile.build(profileObject, false), License.build(licenseObject, false)];
	try {
		[account, profile, license] = await Promise.all(promises1);
	} catch (data) {
		return res.send(data);
	}
	// Establish the link between these instances
	account.profile = profile._id;
	profile.account.local = account._id;
	profile.license = license._id;
	license.profile = profile._id;
	// Save these new instances
	const promises2 = [account.save(), profile.save(), license.save()];
	try {
		await Promise.all(promises2);
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	// Success handler
	return res.send({ status: "succeeded", content: "A new educator account has been registered." });
});

// EXPORT ===================================================

module.exports = router;

// END ======================================================
