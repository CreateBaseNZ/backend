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

// @route     POST /email-login
// @desc
// @access    Backend
router.post("/email-login", async (req, res) => {
	// Validate if the PRIVATE_API_KEY match
	if (req.body.PRIVATE_API_KEY !== process.env.PRIVATE_API_KEY) {
		return res.send({ status: "critical error", content: "Invalid API Key" });
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
	// Validate if the PRIVATE_API_KEY match
	if (req.body.PRIVATE_API_KEY !== process.env.PRIVATE_API_KEY) {
		return res.send({ status: "critical error", content: "Invalid API Key" });
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
		return res.send({ status: "critical error", content: "Invalid API Key" });
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
	profile.licenses = [license._id];
	license.profile = profile._id;
	// Save these new instances
	const promises2 = [account.save(), profile.save(), license.save()];
	try {
		await Promise.all(promises2);
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	// Send the verification code
	try {
		await account.sendAccountVerificationEmail();
	} catch (data) {
		return res.send(data);
	}
	// Success handler
	return res.send({ status: "succeeded", content: "A new educator account has been registered" });
});

// @route     POST /signup/educator-organisation
// @desc
// @access    Backend
router.post("/signup/educator-organisation", async (req, res) => {
	// Validate if the PRIVATE_API_KEY match
	if (req.body.PRIVATE_API_KEY !== process.env.PRIVATE_API_KEY) {
		return res.send({ status: "critical error", content: "Invalid API Key" });
	}
	// Fetch the organisation
	let organisation;
	try {
		organisation = await Organisation.findOne(req.body.input.search);
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	// Validate if the organisation exist
	if (!organisation) return res.send({ status: "failed", content: "No organisation were found with these identification info" });
	// Check if the join code is correct
	if (organisation.join.educator !== req.body.input.code) {
		return res.send({ status: "failed", content: "Invalid code" });
	}
	// Create the account instance
	const accountObject = {
		email: req.body.input.email,
		password: req.body.input.password,
		date: req.body.input.date,
	};
	let account;
	try {
		account = await Account.build(accountObject, false);
	} catch (data) {
		return res.send(data);
	}
	// Create the profile instance
	const profileObject = {
		displayName: req.body.input.displayName,
		date: req.body.input.date,
	};
	let profile;
	try {
		profile = await Profile.build(profileObject, false);
	} catch (data) {
		return res.send(data);
	}
	// Create the license instance
	const licenseObject = {
		username: req.body.input.username,
		password: req.body.input.password,
		statuses: [{ type: "free", date: req.body.input.date }],
		access: "educator",
		date: req.body.input.date,
	};
	let license;
	try {
		license = await License.build(licenseObject, false);
	} catch (data) {
		return res.send(data);
	}
	// Create links
	account.profile = profile._id;
	profile.account.local = account._id;
	profile.license = license._id;
	profile.licenses = [license._id];
	license.profile = profile._id;
	license.organisation = organisation._id;
	organisation.licenses.push(license._id);
	organisation.date.modified = req.body.input.date;
	// Save instances
	let promises = [account.save(), profile.save(), license.save(), organisation.save()];
	try {
		await Promise.all(promises);
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	// Success handler
	return res.send({ status: "succeeded", content: "A new educator account has been registered and has joined an organisation" });
});

// @route     POST /signup/learner-organisation
// @desc
// @access    Backend
router.post("/signup/learner-organisation", async (req, res) => {
	// Validate if the PRIVATE_API_KEY match
	if (req.body.PRIVATE_API_KEY !== process.env.PRIVATE_API_KEY) {
		return res.send({ status: "critical error", content: "Invalid API Key" });
	}
	// Fetch the organisation
	let organisation;
	try {
		organisation = await Organisation.findOne(req.body.input.search);
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	// Validate if the organisation exist
	if (!organisation) return res.send({ status: "failed", content: "No organisation were found with these identification info" });
	// Check if the join code is correct
	if (organisation.join.learner !== req.body.input.code) {
		return res.send({ status: "failed", content: "Invalid code" });
	}
	// Create the profile instance
	const profileObject = {
		displayName: req.body.input.displayName,
		date: req.body.input.date,
	};
	let profile;
	try {
		profile = await Profile.build(profileObject, false);
	} catch (data) {
		return res.send(data);
	}
	// Create the license instance
	const licenseObject = {
		username: req.body.input.username,
		password: req.body.input.password,
		statuses: [{ type: "free", date: req.body.input.date }],
		access: "learner",
		date: req.body.input.date,
	};
	let license;
	try {
		license = await License.build(licenseObject, false);
	} catch (data) {
		return res.send(data);
	}
	// Create links
	profile.license = license._id;
	profile.licenses = [license._id];
	license.profile = profile._id;
	license.organisation = organisation._id;
	organisation.licenses.push(license._id);
	organisation.date.modified = req.body.input.date;
	// Save instances
	let promises = [profile.save(), license.save(), organisation.save()];
	try {
		await Promise.all(promises);
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	// Success handler
	return res.send({ status: "succeeded", content: "A new learner account has been registered and has joined an organisation" });
});

// @route     POST /update-session
// @desc
// @access    Backend
router.post("/update-session", async (req, res) => {
	// Validate if the PRIVATE_API_KEY match
	if (req.body.PRIVATE_API_KEY !== process.env.PRIVATE_API_KEY) {
		return res.send({ status: "critical error", content: "Invalid API Key" });
	}
	let session = new Object();
	// Fetch License and Profile
	let license;
	let profile;
	const promises1 = [License.findOne({ _id: req.body.input.license }), Profile.findOne({ _id: req.body.input.profile })];
	try {
		[license, profile, account] = await Promise.all(promises1);
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	if (!license || !profile) {
		return res.send({ status: "failed", content: "Failed to fetch a license or a profile" });
	}
	session = {
		license: license._id,
		profile: profile._id,
		access: license.access,
		status: "free", // TEMPORARY
		verified: false,
	};
	if (license.organisation) session.organisation = license.organisation;
	if (profile.account.local) {
		let account;
		try {
			account = await Account.findOne({ _id: profile.account.local });
		} catch (error) {
			return reject({ status: "error", content: error });
		}
		session.account = account._id;
		session.verified = account.verified.status;
	}
	// Update visits
	const date = new Date().toString();
	license.date.visited = date;
	profile.date.visited = date;
	const promises2 = [license.save(), profile.save()];
	try {
		await Promise.all(promises2);
	} catch (error) {
		return reject({ status: "error", content: error });
	}
	// Success handler
	return res.send({ status: "succeeded", content: session });
});

// @route     POST /send-email-verification
// @desc
// @access    Backend
router.post("/send-email-verification", async (req, res) => {
	// Validate if the PRIVATE_API_KEY match
	if (req.body.PRIVATE_API_KEY !== process.env.PRIVATE_API_KEY) {
		return res.send({ status: "critical error", content: "Invalid API Key" });
	}
	// Build the query object
	let query = new Object();
	let errorFetch = "";
	if (req.body.input.email) {
		query = { email: req.body.input.email };
		errorFetch = "There is no account with this email";
	} else if (req.body.input.account) {
		query = { _id: req.body.input.account };
		errorFetch = "There is no account with this ID";
	} else {
		return res.send({ status: "critical error", content: "No required information provided" });
	}
	// Fetch the account
	let account;
	try {
		account = await Account.findOne(query);
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	if (!account) return res.send({ status: "failed", content: errorFetch });
	// Check if the account is already verified
	if (account.verified.status) {
		return res.send({ status: "failed", content: "This account is already verified" });
	}
	// Send the verification code
	try {
		await account.sendAccountVerificationEmail();
	} catch (data) {
		return res.send(data);
	}
	// Success handler
	return res.send({ status: "succeeded", content: "The verification email has been sent" });
});

// @route     POST /verify-account
// @desc
// @access    Backend
router.post("/verify-account", async (req, res) => {
	// Validate if the PRIVATE_API_KEY match
	if (req.body.PRIVATE_API_KEY !== process.env.PRIVATE_API_KEY) {
		return res.send({ status: "critical error", content: "Invalid API Key" });
	}
	// Build the query object
	let query = new Object();
	let errorFetch = "";
	if (req.body.input.email) {
		query = { email: req.body.input.email };
		errorFetch = "There is no account with this email";
	} else if (req.body.input.account) {
		query = { _id: req.body.input.account };
		errorFetch = "There is no account with this ID";
	} else {
		return res.send({ status: "critical error", content: "No required information provided" });
	}
	// Fetch the account
	let account;
	try {
		account = await Account.findOne(query);
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	if (!account) return res.send({ status: "failed", content: errorFetch });
	// Check if the account is already verified
	if (account.verified.status) {
		return res.send({ status: "failed", content: "This account is already verified" });
	}
	// Verify the account
	try {
		await account.verify({ code: req.body.input.code });
	} catch (data) {
		return res.send(data);
	}
	// Success handler
	return res.send({ status: "succeeded", content: "The account has been verified" });
});

// EXPORT ===================================================

module.exports = router;

// END ======================================================
