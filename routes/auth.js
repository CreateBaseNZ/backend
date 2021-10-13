// MODULES ==================================================

const express = require("express");

// VARIABLES ================================================

if (process.env.NODE_ENV !== "production") require("dotenv").config();
const router = new express.Router();
const email = require("../configs/email/main.js");

// MODELS ===================================================

const Account = require("../model/Account.js");
const License = require("../model/License.js");
const Organisation = require("../model/Organisation.js");
const Profile = require("../model/Profile.js");
const Mail = require("../model/Mail.js");

// ROUTES ===================================================

// @route     POST /email-login
// @desc
// @access    Backend
router.post("/email-login", async (req, res) => {
	// Validate if the PRIVATE_API_KEY match
	if (req.body.PRIVATE_API_KEY !== process.env.PRIVATE_API_KEY) {
		return res.send({ status: "critical error", content: "Invalid API Key" });
	}
	// Process: Create the session
	// Fetch the account
	let account;
	try {
		account = await Account.findOne({ email: req.body.input.email });
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	if (!account) return res.send({ status: "failed", content: { email: "invalid email" } });
	// Check if the password match
	let match;
	try {
		match = await account.validatePassword(req.body.input.password);
	} catch (data) {
		return res.send(data);
	}
	if (!match) return res.send({ status: "failed", content: { password: "incorrect password" } });
	// Fetch the profile
	let profile;
	try {
		profile = await Profile.findOne({ "account.local": account._id });
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	if (!profile) return res.send({ status: "error", content: "no profile found" });
	// Fetch the license
	let license;
	try {
		license = await License.findOne({ profile: profile._id });
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	if (!license) return res.send({ status: "error", content: "no license found" });
	// Create the session
	let session = new Object({
		organisation: license.organisation,
		license: license._id,
		profile: profile._id,
		account: account._id,
		access: license.access,
		status: "free",
	});
	if (session.access === "learner") {
		session.verified = true;
	} else {
		session.verified = account.verified.status;
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
		return res.send({ status: "critical error", content: "" });
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
	// Check if the Mail instance already exist
	let mail;
	try {
		mail = await Mail.findOne({ email: req.body.input.email });
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	// If no Mail instance exist, create one
	if (!mail) mail = new Mail({ email: req.body.input.email });
	mail.account = account._id;
	mail.notification.onboarding = true;
	mail.notification.product = true;
	mail.metadata === undefined ? (mail.metadata = { name: profile.displayName }) : (mail.metadata.name = profile.displayName);
	// Save these new instances
	const promises2 = [account.save(), profile.save(), license.save(), mail.save()];
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
	return res.send({ status: "succeeded" });
});

// @route     POST /signup/educator-organisation
// @desc
// @access    Backend
router.post("/signup/educator-organisation", async (req, res) => {
	// Validate if the PRIVATE_API_KEY match
	if (req.body.PRIVATE_API_KEY !== process.env.PRIVATE_API_KEY) {
		return res.send({ status: "critical error", content: "" });
	}
	// Fetch the organisation
	let organisation;
	try {
		organisation = await Organisation.findOne(req.body.input.search);
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	// Validate if the organisation exist
	if (!organisation) return res.send({ status: "failed", content: { organisation: "invalid organisation name or id" } });
	// Check if the join code is correct
	if (organisation.join.educator !== req.body.input.code) {
		return res.send({ status: "failed", content: { code: "incorrect code" } });
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
	return res.send({ status: "succeeded", content: "" });
});

// @route     POST /signup/learner-organisation
// @desc
// @access    Backend
router.post("/signup/learner-organisation", async (req, res) => {
	// Validate if the PRIVATE_API_KEY match
	if (req.body.PRIVATE_API_KEY !== process.env.PRIVATE_API_KEY) {
		return res.send({ status: "critical error", content: "" });
	}
	// Fetch the organisation
	let organisation;
	try {
		organisation = await Organisation.findOne(req.body.input.search);
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	// Validate if the organisation exist
	if (!organisation) return res.send({ status: "failed", content: { organisation: "invalid organisation name or id" } });
	// Check if the join code is correct
	if (organisation.join.learner !== req.body.input.code) {
		return res.send({ status: "failed", content: { code: "incorrect code" } });
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
	return res.send({ status: "succeeded", content: "" });
});

// @route     POST /validate-username
// @desc
// @access    Backend
router.post("/validate-username", async (req, res) => {
	// Validate if the PRIVATE_API_KEY match
	if (req.body.PRIVATE_API_KEY !== process.env.PRIVATE_API_KEY) {
		return res.send({ status: "critical error", content: "" });
	}
	// Fetch the license
	let license;
	try {
		license = await License.findOne({ username: req.body.input.username });
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	if (license) {
		return res.send({ status: "failed", content: { username: "already taken" } });
	}
	// Success handler
	return res.send({ status: "succeeded", content: "" });
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
			return res.send({ status: "error", content: error });
		}
		session.account = account._id;
		session.verified = account.verified.status;
	} else if (session.access === "learner") {
		session.verified = true;
	}
	// Update visits
	const date = new Date().toString();
	license.date.visited = date;
	profile.date.visited = date;
	const promises2 = [license.save(), profile.save()];
	try {
		await Promise.all(promises2);
	} catch (error) {
		return res.send({ status: "error", content: error });
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
		return res.send({ status: "critical error", content: "" });
	}
	// Build the query object
	let query = new Object();
	let errorFetch = new Object();
	if (req.body.input.email) {
		query = { email: req.body.input.email };
		errorFetch = { status: "failed", content: { email: "invalid email" } };
	} else if (req.body.input.account) {
		query = { _id: req.body.input.account };
		errorFetch = { status: "critical error", content: "" };
	} else {
		return res.send({ status: "critical error", content: "" });
	}
	// Fetch the account
	let account;
	try {
		account = await Account.findOne(query);
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	if (!account) return res.send(errorFetch);
	// Check if the account is already verified
	if (account.verified.status) {
		return res.send({ status: "failed", content: { email: "already verified" } });
	}
	// Send the verification code
	try {
		await account.sendAccountVerificationEmail();
	} catch (data) {
		return res.send(data);
	}
	// Success handler
	return res.send({ status: "succeeded", content: "" });
});

// @route     POST /verify-account
// @desc
// @access    Backend
router.post("/verify-account", async (req, res) => {
	// Validate if the PRIVATE_API_KEY match
	if (req.body.PRIVATE_API_KEY !== process.env.PRIVATE_API_KEY) {
		return res.send({ status: "critical error", content: "" });
	}
	// Build the query object
	let query = new Object();
	let errorFetch = "";
	if (req.body.input.email) {
		query = { email: req.body.input.email };
		errorFetch = { status: "failed", content: { email: "invalid email" } };
	} else if (req.body.input.account) {
		query = { _id: req.body.input.account };
		errorFetch = { status: "critical error", content: "" };
	} else {
		return res.send({ status: "critical error", content: "" });
	}
	// Fetch the account
	let account;
	try {
		account = await Account.findOne(query);
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	if (!account) return res.send(errorFetch);
	// Check if the account is already verified
	if (account.verified.status) {
		return res.send({ status: "failed", content: { email: "already verified" } });
	}
	// Verify the account
	try {
		await account.verify({ code: req.body.input.code });
	} catch (data) {
		return res.send(data);
	}
	// Fetch the profile of the user
	let profile;
	try {
		profile = await Profile.findOne({ "account.local": account._id });
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	// Fetch the mail instance associated with the account
	let mail;
	try {
		mail = await Mail.findOne({ email: account.email });
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	// Send the welcome email
	const options = {
		recipient: account.email,
		name: profile.displayName,
		receive: "welcome",
		notification: "onboarding",
		tone: "friendly",
		help: true,
		social: true,
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

// @route     POST /send-reset-password-email
// @desc
// @access    Backend
router.post("/send-reset-password-email", async (req, res) => {
	// Validate if the PRIVATE_API_KEY match
	if (req.body.PRIVATE_API_KEY !== process.env.PRIVATE_API_KEY) {
		return res.send({ status: "critical error", content: "" });
	}
	// Fetch the account
	let account;
	try {
		account = await Account.findOne({ email: req.body.input.email });
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	if (!account) return res.send({ status: "failed", content: "invalid email" });
	// Send the verification code
	try {
		await account.sendPasswordResetEmail();
	} catch (data) {
		return res.send(data);
	}
	// Success handler
	return res.send({ status: "succeeded", content: "" });
});

// @route     POST /reset-password
// @desc
// @access    Backend
router.post("/reset-password", async (req, res) => {
	// Validate if the PRIVATE_API_KEY match
	if (req.body.PRIVATE_API_KEY !== process.env.PRIVATE_API_KEY) {
		return res.send({ status: "critical error", content: "" });
	}
	// Fetch the account
	let account;
	try {
		account = await Account.findOne({ email: req.body.input.email });
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	if (!account) {
		return res.send({ status: "failed", content: { email: "invalid email" } });
	}
	// Check if the code matches
	if (account.resetPassword.code !== req.body.input.code) {
		return res.send({ status: "failed", content: { code: "incorrect code" } });
	}
	// Check if a password is provided
	if (!req.body.input.password) {
		return res.send({ status: "failed", content: { password: "no password" } });
	}
	// Fetch the profile
	let profile;
	try {
		profile = await Profile.findOne({ "account.local": account._id });
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	if (!profile) {
		return res.send({ status: "error", content: "there is no profile associated with this account" });
	}
	// Fetch license
	let license;
	try {
		license = await License.findOne({ _id: profile.license });
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	if (!license) {
		return res.send({ status: "error", content: "there is no license associated with this profile" });
	}
	// Change password of both account and license
	account.password = req.body.input.password;
	account.date.modified = new Date().toString();
	license.password = req.body.input.password;
	license.date.modified = new Date().toString();
	// Save the new passwords
	const promises = [account.save(), license.save()];
	try {
		await Promise.all(promises);
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	// Success handler
	return res.send({ status: "succeeded", content: "" });
});

// @route     POST /send-test-email
// @desc
// @access    Backend
router.post("/send-test-email", async (req, res) => {
	// Validate if the PRIVATE_API_KEY match
	if (req.body.PRIVATE_API_KEY !== process.env.PRIVATE_API_KEY) {
		return res.send({ status: "critical error", content: "Invalid API key" });
	}
	// Create the email object
	let mail;
	try {
		mail = await email.create({ email: req.body.input.email }, "test");
	} catch (data) {
		return res.send(data);
	}
	// Send the verification email
	try {
		await email.send(mail);
	} catch (data) {
		return res.send(data);
	}
	// Success handler
	return res.send({ status: "succeeded", content: "The test email has been sent" });
});

// EXPORT ===================================================

module.exports = router;

// END ======================================================
