// MODULES ==================================================

const express = require("express");
const mailer = require("../configs/email/main.js");

// VARIABLES ================================================

const router = new express.Router();
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

const Account = require("../model/Account.js");
const Class = require("../model/Class.js");
const Group = require("../model/Group.js");
const License = require("../model/License.js");
const Mail = require("../model/Mail.js");
const Profile = require("../model/Profile.js");

// ROUTES ===================================================

// @route   POST /signup
// @desc
// @access
router.post("/signup", checkAPIKeys(false, true), async (req, res) => {
	const input = req.body.input;
	// Check if the email is already taken by another account instance
	let account;
	try {
		account = await Account.findOne({ email: input.email });
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	if (account) return res.send({ status: "failed", content: { email: "taken" } });
	// Create the account and profile instances
	account = new Account({
		email: input.email,
		password: input.password,
		date: { created: input.date, modified: input.date },
	});
	let profile = new Profile({
		name: { first: input.first, last: input.last },
		date: { created: input.date, modified: input.date, visited: input.date },
	});
	// Check if a mail instance exist with this email
	let mail;
	try {
		mail = await Mail.findOne({ email: input.email });
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	if (!mail) mail = new Mail({ email: input.email });
	Object.assign(mail.notification, { onboarding: true, product: true, cold: false });
	// Create the links between instances
	account.profile = profile._id;
	profile.account = { local: account._id };
	mail.account = account._id;
	// Save instances
	const promises = [account.save(), profile.save(), mail.save()];
	try {
		await Promise.all(promises);
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	// Success handler
	return res.send({ status: "succeeded", content: { profile, account, mail } });
});

// @route   POST /login
// @desc
// @access
router.post("/login", checkAPIKeys(false, true), async (req, res) => {
	const input = req.body.input;
	// Initialise failed handler
	let failed = { account: "", password: "" };
	// Check if an account with this email exist
	let account;
	try {
		account = await Account.findOne({ email: input.email });
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	if (!account) {
		failed.account = "does not exist";
		return res.send({ status: "failed", content: failed });
	}
	// Check if the input password match with the account's password
	let match;
	try {
		match = await account.matchPassword(input.password);
	} catch (data) {
		return res.send(data);
	}
	if (!match) {
		failed.password = "incorrect";
		return res.send({ status: "failed", content: failed });
	}
	// Success handler
	return res.send({ status: "succeeded", content: account._id });
});

// @route   POST /session
// @desc
// @access
router.post("/session", checkAPIKeys(false, true), async (req, res) => {
	const input = req.body.input;
	// Initialise failed handler
	let failed = { account: "", profile: "" };
	// Initialise the session object
	let session = { groups: [] };
	// Fetch the account instance
	let account;
	try {
		account = await Account.findOne({ _id: input.account });
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	if (!account) {
		failed.account = "does not exist";
		return res.send({ status: "failed", content: failed });
	}
	session.account = account._id;
	session.verified = account.verified.status;
	// Fetch the profile instance
	let profile;
	try {
		profile = await Profile.findOne({ _id: account.profile });
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	if (!profile) {
		failed.profile = "does not exist";
		return res.send({ status: "failed", content: failed });
	}
	session.profile = profile._id;
	// Construct group details
	for (let i = 0; i < profile.licenses.length; i++) {
		// TODO: Construct group details
	}
	// Success handler
	return res.send({ status: "succeeded", content: session });
});

// @route   POST /account/verification/email
// @desc
// @access
router.post("/account/verification/email", checkAPIKeys(false, true), async (req, res) => {
	const input = req.body.input;
	// Initialise failed handler
	let failed = { account: "", profile: "" };
	// Check if an account with this email exist
	let account;
	try {
		account = await Account.findOne({ _id: input.account });
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	if (!account) {
		failed.account = "does not exist";
		return res.send({ status: "failed", content: failed });
	}
	// Update the verification code
	account.updateCode();
	account.date.modified = input.date;
	// Save account instance and fetch the profile associated with the account
	let profile;
	const promises = [Profile.findOne({ _id: account.profile }), account.save()];
	try {
		[profile] = await Promise.all(promises);
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	if (!profile) {
		failed.profile = "does not exist";
		return res.send({ status: "failed", content: failed });
	}
	// Send the verification email
	const options = {
		recipient: account.email,
		name: profile.name.first,
		receive: "account-verification",
		notification: "general",
		tone: "friendly",
		help: true,
		social: true,
		code: account.verified.code,
	};
	try {
		await mailer.execute(options);
	} catch (data) {
		return res.send(data);
	}
	// Success handler
	return res.send({ status: "succeeded" });
});

// @route   POST /account/verification/verify
// @desc
// @access
router.post("/account/verification/verify", checkAPIKeys(false, true), async (req, res) => {
	const input = req.body.input;
	// Initialise failed handler
	let failed = { account: "", code: "" };
	// Check if an account with this email exist
	let account;
	try {
		account = await Account.findOne({ email: input.email });
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	if (!account) {
		failed.account = "does not exist";
		return res.send({ status: "failed", content: failed });
	}
	// Check if code match
	try {
		account.matchCode(input.code);
	} catch (error) {
		failed.code = error;
		return res.send({ status: "failed", content: failed });
	}
	// Update account verification status
	account.verified.status = true;
	Object.assign(account.date, { modified: input.date, verified: input.date });
	// Save the updated account instance
	try {
		await account.save();
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	// Success handler
	return res.send({ status: "succeeded" });
});

// @route   POST /account/reset-password/email
// @desc
// @access
router.post("/account/reset-password/email", checkAPIKeys(false, true), async (req, res) => {
	const input = req.body.input;
	// Initialise failed handler
	let failed = { account: "", profile: "" };
	// Check if an account with this email exist
	let account;
	try {
		account = await Account.findOne({ email: input.email });
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	if (!account) {
		failed.account = "does not exist";
		return res.send({ status: "failed", content: failed });
	}
	// Update the reset password code
	account.updateCode("resetPassword");
	account.date.modified = input.date;
	// Save account instance and fetch the profile associated with the account
	let profile;
	const promises = [Profile.findOne({ _id: account.profile }), account.save()];
	try {
		[profile] = await Promise.all(promises);
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	if (!profile) {
		failed.profile = "does not exist";
		return res.send({ status: "failed", content: failed });
	}
	// Send the reset password email
	const options = {
		recipient: account.email,
		name: profile.name.first,
		receive: "password-reset",
		notification: "general",
		tone: "friendly",
		help: true,
		social: true,
		code: account.resetPassword.code,
	};
	try {
		await mailer.execute(options);
	} catch (data) {
		return res.send(data);
	}
	// Success handler
	return res.send({ status: "succeeded" });
});

// @route   POST /account/reset-password/set
// @desc
// @access
router.post("/account/reset-password/set", checkAPIKeys(false, true), async (req, res) => {
	const input = req.body.input;
	// Initialise failed handler
	let failed = { account: "", code: "" };
	// Check if an account with this email exist
	let account;
	try {
		account = await Account.findOne({ email: input.email });
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	if (!account) {
		failed.account = "does not exist";
		return res.send({ status: "failed", content: failed });
	}
	// Check if code match
	try {
		account.matchCode(input.code, "resetPassword");
	} catch (error) {
		failed.code = error;
		return res.send({ status: "failed", content: failed });
	}
	// Set the password
	account.password = input.password;
	account.date.modified = input.date;
	// Save the updated account instance
	try {
		await account.save();
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	// Success handler
	return res.send({ status: "succeeded" });
});

// @route		POST /account/retrieve
// @desc
// @access
router.post("/account/retrieve", checkAPIKeys(false, true), async (req, res) => {
	const input = req.body.input;
	// Initialise failed handler
	let failed = { account: "" };
	// Fetch the account of interest
	let account;
	try {
		account = await Account.findOne({ _id: input.account });
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	if (!account) {
		failed.account = "does not exist";
		return res.send({ status: "failed", content: failed });
	}
	// Success handler
	return res.send({ status: "succeeded", content: account });
});

// @route		POST /account/metadata/update
// @desc
// @access
router.post("/account/metadata/update", checkAPIKeys(false, true), async (req, res) => {
	const input = req.body.input;
	// Initialise failed handler
	let failed = { account: "" };
	// Fetch the account of interest
	let account;
	try {
		account = await Account.findOne({ _id: input.account });
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	if (!account) {
		failed.account = "does not exist";
		return res.send({ status: "failed", content: failed });
	}
	// Update metadata
	Object.assign(account.metadata, input.metadata);
	// Save the updates
	account.date.modified = input.date;
	account.markModified("metadata");
	try {
		account.save();
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	// Success handler
	return res.send({ status: "succeeded", content: account.metadata });
});

// @route		POST /account/metadata/read
// @desc
// @access
router.post("/account/metadata/read", checkAPIKeys(false, true), async (req, res) => {
	const input = req.body.input;
	// Initialise failed handler
	let failed = { account: "" };
	// Fetch the account of interest
	let account;
	try {
		account = await Account.findOne({ _id: input.account });
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	if (!account) {
		failed.account = "does not exist";
		return res.send({ status: "failed", content: failed });
	}
	// Success handler
	return res.send({ status: "succeeded", content: account.metadata });
});

// @route		POST /account/metadata/delete
// @desc
// @access
router.post("/account/metadata/delete", checkAPIKeys(false, true), async (req, res) => {
	const input = req.body.input;
	// Initialise failed handler
	let failed = { account: "" };
	// Fetch the account of interest
	let account;
	try {
		account = await Account.findOne({ _id: input.account });
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	if (!account) {
		failed.account = "does not exist";
		return res.send({ status: "failed", content: failed });
	}
	// Delete metadata
	for (let i = 0; i < input.properties.length; i++) {
		const property = input.properties[i];
		delete account.metadata[property];
	}
	// Save the updates
	account.date.modified = input.date;
	account.markModified("metadata");
	try {
		account.save();
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	// Success handler
	return res.send({ status: "succeeded", content: account.metadata });
});

// FUNCTIONS ================================================

// EXPORT ===================================================

module.exports = router;

// END ======================================================
