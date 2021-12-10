// MODULES ==================================================

const express = require("express");
const retrieve = require("../algorithms/retrieve.js");
const agenda = require("../configs/agenda.js");

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
const GoogleAccount = require("../model/GoogleAccount.js");
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
		account = await Account.findOne({ email: input.email.toLowerCase() });
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	if (account) return res.send({ status: "failed", content: { email: "taken" } });
	// Create the account and profile instances
	account = new Account({
		email: input.email.toLowerCase(),
		password: input.password,
		date: { created: input.date, modified: input.date },
	});
	// Check if there is a Google Account that exist
	let googleAccount;
	try {
		googleAccount = await GoogleAccount.findOne({ email: input.email.toLowerCase() });
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	let profile;
	if (googleAccount) {
		try {
			profile = await Profile.findOne({ _id: googleAccount.profile });
		} catch (error) {
			return res.send({ status: "error", content: error });
		}
	} else {
		profile = new Profile({
			name: { first: input.name.first, last: input.name.last },
			date: { created: input.date, modified: input.date, visited: input.date },
		});
	}
	// Check if a mail instance exist with this email
	let mail;
	try {
		mail = await Mail.findOne({ email: input.email.toLowerCase() });
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	if (!mail) mail = new Mail({ email: input.email.toLowerCase() });
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
		account = await Account.findOne({ email: input.email.toLowerCase() });
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
	return res.send({ status: "succeeded", content: { id: account._id } });
});

// @route   POST /login/google-auth
// @desc
// @access
router.post("/login/google-auth", checkAPIKeys(false, true), async (req, res) => {
	const input = req.body.input;
	// Check if there is a Google Account created
	let googleAccount;
	try {
		googleAccount = await GoogleAccount.findOne({ googleId: input.id });
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	if (googleAccount) return res.send({ status: "succeeded" });
	// Create a google account
	googleAccount = new GoogleAccount({ googleId: input.id, email: input.email.toLowerCase(), date: new Date().toString() });
	try {
		await googleAccount.save();
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	// Check if a mail instance exist with this email
	let mail;
	try {
		mail = await Mail.findOne({ email: input.email.toLowerCase() });
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	if (!mail) {
		mail = new Mail({ email: input.email.toLowerCase() });
	}
	// If there is no Google Account check if an account with this email already exists
	let localAccount;
	try {
		localAccount = await Account.findOne({ email: input.email });
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	let profile;
	if (localAccount) {
		// Fetch the profile associated with the local account
		try {
			profile = await Profile.findOne({ _id: localAccount.profile });
		} catch (error) {
			return res.send({ status: "error", content: error });
		}
	} else {
		// Create a new profile
		profile = new Profile({
			name: input.name,
			date: { created: new Date().toString(), modified: new Date().toString(), visited: new Date().toString() },
		});
		Object.assign(mail.notification, { onboarding: true, product: true, cold: false });
	}
	if (!profile) return res.send({ status: "error", content: { profile: "does not exist" } });
	// Link the Google Account and the profile together
	profile.account.google = googleAccount._id;
	googleAccount.profile = profile._id;
	// Save the instances
	try {
		await Promise.all([profile.save(), googleAccount.save(), mail.save()]);
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	// Success handler
	return res.send({ status: "succeeded" });
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
	let promise;
	if (input.provider === "credentials") {
		promise = Account.findOne({ _id: input.accountId });
	} else if (input.provider === "google") {
		promise = GoogleAccount.findOne({ googleId: input.accountId });
	} else {
		return res.send({ status: "error", content: { provider: "invalid" } });
	}
	let account;
	try {
		account = await promise;
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	if (!account) return res.send({ status: "failed", content: { account: "does not exist" } });
	session.accountId = input.accountId;
	session.provider = input.provider;
	session.verified = input.provider === "credentials" ? account.verified.status : true;
	session.email = account.email;
	// Fetch the profile instance
	let profile;
	try {
		profile = await Profile.findOne({ _id: account.profile });
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	if (!profile) return res.send({ status: "failed", content: { profile: "does not exist" } });
	session.profileId = profile._id;
	session.firstName = profile.name.first;
	session.lastName = profile.name.last;
	// Fetch the licenses
	let licenses;
	try {
		licenses = await License.find({ _id: profile.licenses });
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	// Construct group details
	for (let i = 0; i < licenses.length; i++) {
		// Fetch the group associated with the license
		let group;
		try {
			group = await Group.findOne({ _id: licenses[i].group });
		} catch (error) {
			return res.send({ status: "error", content: error });
		}
		// Create the group session object
		let numOfUsers;
		if (group.type === "school") {
			// Fetch group details
			try {
				group = (await retrieve.groups([group], { license: [] }))[0];
			} catch (data) {
				return res.send(data);
			}
			numOfUsers = {
				admins: group.licenses.active.filter((license) => license.role === "admin").length,
				teachers: group.licenses.active.filter((license) => license.role === "teacher").length,
				students: group.licenses.active.filter((license) => license.role === "student").length,
			};
		} else if (group.type === "family") {
			numOfUsers = { members: group.licenses.active.length };
		}
		let object = {
			licenseId: licenses[i]._id,
			id: group._id,
			number: group.number,
			name: group.name,
			role: licenses[i].role,
			type: group.type,
			numOfUsers,
			verified: group.verified,
			status: licenses[i].status,
			studentCode: group.join.student,
			inClass: licenses[i].classes.length ? true : false,
		};
		for (let j = 0; j < input.properties.license.length; j++) {
			const property = input.properties.license[j];
			object[property] = licenses[i].metadata[property];
		}
		session.groups.push(object);
	}
	session.numOfGroups = session.groups.length;
	for (let k = 0; k < input.properties.profile.length; k++) {
		const property = input.properties.profile[k];
		session[property] = profile.saves[property];
	}
	// Update profile's last visit
	profile.date.visited = input.date;
	try {
		await profile.save();
	} catch (error) {
		return res.send({ status: "error", content: error });
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
	try {
		await account.save();
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	// Send the verification email
	const option = {
		recipient: account.email,
		receive: "account-verification",
		notification: "general",
		tone: "friendly",
		code: account.verified.code,
	};
	agenda.now("email", { option, accountId: account._id });
	// Success handler
	return res.send({ status: "succeeded" });
});

// @route   POST /account/verification/verify
// @desc
// @access
router.post("/account/verification/verify", checkAPIKeys(false, true), async (req, res) => {
	const input = req.body.input;
	// Initialise failed handler
	let failed = { account: "", code: "", profile: "" };
	// Check if an account with this email exist
	let account;
	try {
		account = await Account.findOne({ email: input.email.toLowerCase() });
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
	return res.send({ status: "succeeded", content: account });
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
		account = await Account.findOne({ email: input.email.toLowerCase() });
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
	// Save account instance
	try {
		await account.save();
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	// Send the reset password email
	const option = {
		recipient: account.email,
		receive: "password-reset",
		notification: "general",
		tone: "friendly",
		code: account.resetPassword.code,
	};
	agenda.now("email", { option, accountId: account._id });
	// Success handler
	return res.send({ status: "succeeded" });
});

// @route   POST /account/reset-password/verify
// @desc
// @access
router.post("/account/reset-password/verify", checkAPIKeys(false, true), async (req, res) => {
	const input = req.body.input;
	// Initialise failed handler
	let failed = { account: "", code: "" };
	// Check if an account with this email exist
	let account;
	try {
		account = await Account.findOne({ email: input.email.toLowerCase() });
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
	// Success handler
	return res.send({ status: "succeeded" });
});

// @route   POST /account/reset-password/set
// @desc
// @access
router.post("/account/reset-password/set", checkAPIKeys(false, true), async (req, res) => {
	const input = req.body.input;
	// Initialise failed handler
	let failed = { account: "" };
	// Check if an account with this email exist
	let account;
	try {
		account = await Account.findOne({ email: input.email.toLowerCase() });
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	if (!account) {
		failed.account = "does not exist";
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

// @route		POST /account/match-password
// @desc
// @access
router.post("/account/match-password", checkAPIKeys(false, true), async (req, res) => {
	const input = req.body.input;
	// Initialise failed handler
	let failed = { account: "", password: "" };
	// Fetch the account of interest
	let account;
	try {
		account = await Account.findOne({ email: input.email.toLowerCase() });
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	if (!account) return res.send({ status: "failed", content: { account: "does not exist" } });

	// Check if the input password match with the account's password
	let match;
	try {
		match = await account.matchPassword(input.password);
	} catch (data) {
		return res.send(data);
	}
	// Success handler
	return res.send({ status: "succeeded", content: match });
});

// @route		POST /account/retrieve
// @desc
// @access
router.post("/account/retrieve", checkAPIKeys(false, true), async (req, res) => {
	const input = req.body.input;
	// Fetch the account of interest
	let accounts;
	try {
		accounts = await Account.find(input.query);
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	if (!accounts.length) return res.send({ status: "failed", content: { accounts: "do not exist" } });
	// Success handler
	return res.send({ status: "succeeded", content: accounts });
});

// @route		POST /account/update-metadata
// @desc
// @access
router.post("/account/update-metadata", checkAPIKeys(false, true), async (req, res) => {
	const input = req.body.input;
	// Fetch the account of interest
	let account;
	try {
		account = await Account.findOne({ _id: input.account });
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	if (!account) return res.send({ status: "failed", content: { account: "does not exist" } });
	// Update metadata
	Object.assign(account.metadata, input.metadata);
	account.markModified("metadata");
	// Save the updates
	account.date.modified = input.date;
	try {
		await account.save();
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	// Success handler
	return res.send({ status: "succeeded", content: account.metadata });
});

// @route		POST /account/delete-metadata
// @desc
// @access
router.post("/account/delete-metadata", checkAPIKeys(false, true), async (req, res) => {
	const input = req.body.input;
	// Fetch the account of interest
	let account;
	try {
		account = await Account.findOne({ _id: input.account });
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	if (!account) return res.send({ status: "failed", content: { account: "does not exist" } });
	// Delete metadata
	for (let i = 0; i < input.properties.length; i++) {
		const property = input.properties[i];
		delete account.metadata[property];
	}
	account.markModified("metadata");
	// Save the updates
	account.date.modified = input.date;
	try {
		await account.save();
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
