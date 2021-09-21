// MODULES ==================================================

const express = require("express");

// VARIABLES ================================================

if (process.env.NODE_ENV !== "production") require("dotenv").config();
const router = new express.Router();
const email = require("../configs/email.js");

// MODELS ===================================================

const Account = require("../model/Account.js");
const License = require("../model/License.js");
const Organisation = require("../model/Organisation.js");
const Profile = require("../model/Profile.js");

// ROUTES ===================================================

// @route     POST /organisation/create
// @desc
// @access    Backend
router.post("/organisation/create", async (req, res) => {
	// Validate if the PRIVATE_API_KEY match
	if (req.body.PRIVATE_API_KEY !== process.env.PRIVATE_API_KEY) {
		return res.send({ status: "critical error", content: "" });
	}
	// Fetch the license
	let license;
	try {
		license = await License.findOne({ _id: req.body.input.license, access: "educator" });
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	if (!license) return res.send({ status: "critical error", content: "" });
	// Create the organisation and its instance
	const organisationObject = {
		name: req.body.input.name,
		license: req.body.input.license,
		type: req.body.input.type,
		lite: { activated: false, date: "" },
		city: req.body.input.city,
		country: req.body.input.country,
		date: req.body.input.date,
		metadata: req.body.input.metadata,
	};
	let organisation;
	try {
		organisation = await Organisation.build(organisationObject);
	} catch (data) {
		return res.send(data);
	}
	// Create a link between the organisation and the license, and make the user's license an admin
	license.organisation = organisation._id;
	license.access = "admin";
	try {
		await license.save();
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	// Process: Send the admin user an email containing the necessary information
	// Fetch the profile
	let profile;
	try {
		profile = await Profile.findOne({ _id: license.profile });
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	if (!profile) return res.send({ status: "error", content: "no profile found" });
	// Fetch the account
	let account;
	try {
		account = await Account.findOne({ _id: profile.account.local });
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	if (!account) return res.send({ status: "error", content: "no account found" });
	// Build the email object
	const emailObject = {
		email: account.email,
		displayName: profile.displayName,
		orgName: organisation.name,
		orgId: organisation.metadata.id,
		eduCode: organisation.join.educator,
		lerCode: organisation.join.learner,
	};
	// Create the email object
	let mail;
	try {
		mail = await email.create(emailObject, "organisation-detail");
	} catch (data) {
		return res.send(data);
	}
	// Send the verification email
	try {
		await email.send(mail);
	} catch (data) {
		return res.send(data);
	}
	// Build the email object
	const emailObject2 = {
		displayName: profile.displayName,
		orgName: organisation.name,
	};
	// Create the email object
	let mail2;
	try {
		mail2 = await email.create(emailObject2, "new-org-notif", true);
	} catch (data) {
		return res.send(data);
	}
	// Send the verification email
	try {
		await email.send(mail2);
	} catch (data) {
		return res.send(data);
	}
	// Success handler
	return res.send({ status: "succeeded", content: "" });
});

// @route     POST /organisation/account-read
// @desc
// @access    Backend
router.post("/organisation/account-read", async (req, res) => {
	// Validate if the PRIVATE_API_KEY match
	if (req.body.PRIVATE_API_KEY !== process.env.PRIVATE_API_KEY) {
		return res.send({ status: "critical error", content: "" });
	}
	// Fetch the organisation
	let organisation;
	try {
		organisation = await Organisation.findOne({ _id: req.body.input.organisation });
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	if (!organisation) return res.send({ status: "error", content: "there is no organisation found" });
	// Fetch all licenses
	let licenses;
	try {
		licenses = await License.find({ organisation: organisation._id });
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	// Get all learner licenses
	const learners = licenses.filter((license) => {
		return license.access === "learner";
	});
	// Get all educator licenses
	const educators = licenses.filter((license) => {
		return license.access === "educator";
	});
	// Get all educator licenses
	const admins = licenses.filter((license) => {
		return license.access === "admin";
	});
	// Build the return object
	const content = {
		name: organisation.name,
		type: organisation.type,
		location: organisation.location ? organisation.location : {},
		metadata: organisation.metadata,
		numberOfLicenses: { admin: admins.length, educator: educators.length, learner: learners.length },
	};
	// Success handler
	return res.send({ status: "succeeded", content });
});

// @route     POST /organisation/educator-join
// @desc
// @access    Backend
router.post("/organisation/educator-join", async (req, res) => {
	// Validate if the PRIVATE_API_KEY match
	if (req.body.PRIVATE_API_KEY !== process.env.PRIVATE_API_KEY) {
		return res.send({ status: "critical error", content: "" });
	}
	// Fetch the organisation
	const organisationObject = { name: req.body.input.name, "metadata.id": req.body.input.metadata.id };
	let organisation;
	try {
		organisation = await Organisation.findOne(organisationObject);
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	// There is no organisation found with this name or id
	if (!organisation) return res.send({ status: "failed", content: { organisation: "invalid organisation name or id" } });
	// Validate code
	if (req.body.input.code !== organisation.join.educator) return res.send({ status: "failed", content: { code: "incorrect code" } });
	// Fetch the license
	let license;
	try {
		license = await License.findOne({ _id: req.body.input.license });
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	if (!license) return res.send({ status: "error", content: "no license found" });
	// Check if the license is already attached to an organisation
	if (license.organisation) return res.send({ status: "critical error", content: "" });
	// Create the link
	organisation.licenses.push(license._id);
	organisation.date.modified = req.body.input.date;
	license.organisation = organisation._id;
	license.date.modified = req.body.input.date;
	// Save updates
	const promises = [organisation.save(), license.save()];
	try {
		await Promise.all(promises);
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	// Fetch the profile
	let profile;
	try {
		profile = await Profile.findOne({ _id: license.profile });
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	if (!profile) return res.send({ status: "error", content: "no profile found" });
	// Fetch the account
	let account;
	try {
		account = await Account.findOne({ _id: profile.account.local });
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	if (!account) return res.send({ status: "error", content: "no account found" });
	// Construct the email input
	const input = {
		email: account.email,
		recipient: profile.displayName,
		orgName: organisation.name,
		orgId: organisation.metadata.id,
		eduCode: organisation.join.educator,
		lerCode: organisation.join.learner,
	};
	let mail;
	try {
		mail = await email.create(input, "educator-accept");
	} catch (data) {
		return res.send(data);
	}
	try {
		await email.send(mail);
	} catch (data) {
		return res.send(data);
	}
	// Fetch all licenses
	let licenses;
	try {
		licenses = await License.find({ organisation: organisation._id });
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	// Get all learner licenses
	const learners = licenses.filter((license) => {
		return license.access === "learner";
	});
	// Get all educator licenses
	const educators = licenses.filter((license) => {
		return license.access === "educator";
	});
	// Get all educator licenses
	const admins = licenses.filter((license) => {
		return license.access === "admin";
	});
	// Build the return object
	const content = {
		name: organisation.name,
		type: organisation.type,
		location: organisation.location ? organisation.location : {},
		metadata: organisation.metadata,
		numberOfLicenses: { admin: admins.length, educator: educators.length, learner: learners.length },
	};
	// Success handler
	return res.send({ status: "succeeded", content });
});

// @route     POST /organisation/invite-educator/generate-link
// @desc
// @access    Backend
router.post("/organisation/invite-educator/generate-link", async (req, res) => {
	// Validate if the PRIVATE_API_KEY match
	if (req.body.PRIVATE_API_KEY !== process.env.PRIVATE_API_KEY) {
		return res.send({ status: "critical error", content: "" });
	}
	// Fetch the organisation
	let organisation;
	try {
		organisation = await Organisation.findOne({ _id: req.body.input.organisation });
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	if (!organisation) return res.send({ status: "error", content: "no organisation found" });
	// Construct the url
	let orgName = "";
	for (let i = 0; i < organisation.name.length; i++) {
		const character = organisation.name[i];
		if (character === " ") {
			orgName = orgName + "-";
		} else {
			orgName = orgName + character;
		}
	}
	const url = `${process.env.APP_PREFIX}/invite/educator/${organisation.metadata.id}__${orgName}__${organisation.join.educator}`;
	// Success handler
	return res.send({ status: "succeeded", content: url });
});

// @route     POST /organisation/invite-educator/send
// @desc
// @access    Backend
router.post("/organisation/invite-educator/send", async (req, res) => {
	// Validate if the PRIVATE_API_KEY match
	if (req.body.PRIVATE_API_KEY !== process.env.PRIVATE_API_KEY) {
		return res.send({ status: "critical error", content: "" });
	}
	// Fetch the organisation
	let organisation;
	try {
		organisation = await Organisation.findOne({ _id: req.body.input.organisation });
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	if (!organisation) return res.send({ status: "error", content: "no organisation found" });
	// Fetch the profile of the invitation sender
	let profile1;
	try {
		profile1 = await Profile.findOne({ _id: req.body.input.profile });
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	if (!profile1) return res.send({ status: "error", content: "no profile found" });
	const sender = profile1.displayName;
	const orgName = organisation.name;
	// Process each email
	for (let i = 0; i < req.body.input.emails.length; i++) {
		const emailAddress = req.body.input.emails[i];
		// Fetch the account associated with the email
		let account;
		try {
			account = await Account.findOne({ email: emailAddress });
		} catch (error) {
			return res.send({ status: "error", content: error });
		}
		// Generate the base elements of the email
		let orgName = "";
		for (let i = 0; i < organisation.name.length; i++) {
			const character = organisation.name[i];
			if (character === " ") {
				orgName = orgName + "-";
			} else {
				orgName = orgName + character;
			}
		}
		let url = `${emailAddress}__${organisation.metadata.id}__${orgName}__${organisation.join.educator}`;
		let recipient = "there";
		if (account) {
			/// Fetch the profile
			let profile2;
			try {
				profile2 = await Profile.findOne({ "account.local": account._id });
			} catch (error) {
				return res.send({ status: "error", content: error });
			}
			if (!profile2) return res.send({ status: "error", content: "no profile found" });
			// Fetch the license
			let license;
			try {
				license = await License.findOne({ profile: profile2._id });
			} catch (error) {
				return res.send({ status: "error", content: error });
			}
			if (!license) return res.send({ status: "error", content: "no license found" });
			// Generate invitation code
			try {
				await license.generateInviteCode();
			} catch (data) {
				return res.send(data);
			}
			url = url + `__${license.invite.code}`;
			recipient = profile2.displayName;
		}
		// Send the email invitation
		const input = { sender, orgName, url, email: emailAddress, recipient };
		let mail;
		try {
			mail = await email.create(input, "invite-educator");
		} catch (data) {
			return res.send(data);
		}
		try {
			await email.send(mail);
		} catch (data) {
			return res.send(data);
		}
	}
	// Success handler
	return res.send({ status: "succeeded", content: undefined });
});

// @route     POST /organisation/invite-educator/join
// @desc
// @access    Backend
router.post("/organisation/invite-educator/join", async (req, res) => {
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
	if (!account) return res.send({ status: "failed", content: { email: "no account found" } });
	if (req.body.input.account) {
		if (account._id.toString() !== req.body.input.account.toString()) {
			return res.send({ status: "failed", content: { account: "incorrect logged in user" } });
		}
	}
	// Generate the organisation fetch query
	const query = { name: req.body.input.orgName, "metadata.id": req.body.input.orgId };
	// Fetch the organisation
	let organisation;
	try {
		organisation = await Organisation.findOne(query);
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	if (!organisation) return res.send({ status: "error", content: "no organisation found" });
	// Validate the educator code
	if (organisation.join.educator !== req.body.input.eduCode) {
		return res.send({ status: "error", content: "incorrect educator code" });
	}
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
	// Check if the license is already in an organisation
	if (license.organisation) {
		return res.send({ status: "failed", content: { account: "already in an organisation" } });
	}
	// Validate the invitation approval authorisation
	if (license.invite.code !== req.body.input.invCode) {
		return res.send({ status: "error", content: "not authorised" });
	}
	// Add the educator to the organisation
	organisation.licenses.push(license._id);
	license.organisation = organisation._id;
	// Save the changes
	organisation.date.modified = req.body.input.date;
	license.date.modified = req.body.input.date;
	const promises = [organisation.save(), license.save()];
	try {
		await Promise.all(promises);
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	// Construct the email input
	const input = {
		email: account.email,
		recipient: profile.displayName,
		orgName: organisation.name,
		orgId: organisation.metadata.id,
		eduCode: organisation.join.educator,
		lerCode: organisation.join.learner,
	};
	let mail;
	try {
		mail = await email.create(input, "educator-accept");
	} catch (data) {
		return res.send(data);
	}
	try {
		await email.send(mail);
	} catch (data) {
		return res.send(data);
	}
	// Success handler
	return res.send({ status: "succeeded", content: undefined });
});

// @route     POST /organisation/educator-join/request
// @desc
// @access    Backend
router.post("/organisation/educator-join/request", async (req, res) => {
	// Validate if the PRIVATE_API_KEY match
	if (req.body.PRIVATE_API_KEY !== process.env.PRIVATE_API_KEY) {
		return res.send({ status: "critical error", content: "" });
	}
	// Fetch the organisation
	const query = { name: req.body.input.orgName, "metadata.id": req.body.input.orgId };
	let organisation;
	try {
		organisation = await Organisation.findOne(query);
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	if (!organisation) return res.send({ status: "error", content: "no organisation found" });
	// Fetch the account
	let account1;
	try {
		account1 = await Account.findOne({ _id: req.body.input.account });
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	if (!account1) return res.send({ status: "error", content: "no account found" });
	// Fetch the profile
	let profile1;
	try {
		profile1 = await Profile.findOne({ "account.local": account1._id });
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	if (!profile1) return res.send({ status: "error", content: "no profile found" });
	// Fetch the license
	let license1;
	try {
		license1 = await License.findOne({ profile: profile1._id });
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	if (!license1) return res.send({ status: "error", content: "no license found" });
	// Generate the join code
	try {
		await license1.generateJoinCode();
	} catch (data) {
		return res.send(data);
	}
	// Fetch the license of the admin
	let license2;
	try {
		license2 = await License.findOne({ organisation: organisation._id, access: "admin" });
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	if (!license2) return res.send({ status: "error", content: "no license found" });
	// Fetch the profile of the admin
	let profile2;
	try {
		profile2 = await Profile.findOne({ license: license2._id });
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	if (!profile2) return res.send({ status: "error", content: "no profile found" });
	// Fetch the account of the admin
	let account2;
	try {
		account2 = await Account.findOne({ profile: profile2._id });
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	if (!account2) return res.send({ status: "error", content: "no account found" });
	// Construct the url
	let orgName = "";
	for (let i = 0; i < organisation.name.length; i++) {
		const character = organisation.name[i];
		if (character === " ") {
			orgName = orgName + "-";
		} else {
			orgName = orgName + character;
		}
	}
	const url = `${account1.email}__${organisation.metadata.id}__${orgName}__${organisation.join.educator}__${license1.join.code}`;
	// Construct the email input
	const input = { email: account2.email, sender: profile1.displayName, recipient: profile2.displayName, url, orgName: organisation.name };
	let mail;
	try {
		mail = await email.create(input, "educator-join");
	} catch (data) {
		return res.send(data);
	}
	try {
		await email.send(mail);
	} catch (data) {
		return res.send(data);
	}
	// Success handler
	return res.send({ status: "succeeded", content: undefined });
});

// @route     POST /organisation/educator-join/accept
// @desc
// @access    Backend
router.post("/organisation/educator-join/accept", async (req, res) => {
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
	if (!account) return res.send({ status: "error", content: "no account found" });
	// Generate the organisation fetch query
	const query = { name: req.body.input.orgName, "metadata.id": req.body.input.orgId };
	// Fetch the organisation
	let organisation;
	try {
		organisation = await Organisation.findOne(query);
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	if (!organisation) return res.send({ status: "error", content: "no organisation found" });
	// Validate the educator code
	if (organisation.join.educator !== req.body.input.eduCode) {
		return res.send({ status: "error", content: "incorrect educator code" });
	}
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
	// Check if the license is already in an organisation
	if (license.organisation) {
		return res.send({ status: "failed", content: { account: "already in an organisation" } });
	}
	// Validate the invitation approval authorisation
	if (license.join.code !== req.body.input.joinCode) {
		return res.send({ status: "error", content: "not authorised" });
	}
	// Add the educator to the organisation
	organisation.licenses.push(license._id);
	license.organisation = organisation._id;
	// Save the changes
	organisation.date.modified = req.body.input.date;
	license.date.modified = req.body.input.date;
	const promises = [organisation.save(), license.save()];
	try {
		await Promise.all(promises);
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	// Construct the email input
	const input = {
		email: account.email,
		recipient: profile.displayName,
		orgName: organisation.name,
		orgId: organisation.metadata.id,
		eduCode: organisation.join.educator,
		lerCode: organisation.join.learner,
	};
	let mail;
	try {
		mail = await email.create(input, "educator-accept");
	} catch (data) {
		return res.send(data);
	}
	try {
		await email.send(mail);
	} catch (data) {
		return res.send(data);
	}
	// Success handler
	return res.send({ status: "succeeded", content: undefined });
});

// @route     POST /organisation/invite-learner/generate-link
// @desc
// @access    Backend
router.post("/organisation/invite-learner/generate-link", async (req, res) => {
	// Validate if the PRIVATE_API_KEY match
	if (req.body.PRIVATE_API_KEY !== process.env.PRIVATE_API_KEY) {
		return res.send({ status: "critical error", content: "" });
	}
	// Fetch the organisation
	let organisation;
	try {
		organisation = await Organisation.findOne({ _id: req.body.input.organisation });
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	if (!organisation) return res.send({ status: "error", content: "no organisation found" });
	// Construct the url
	let orgName = "";
	for (let i = 0; i < organisation.name.length; i++) {
		const character = organisation.name[i];
		if (character === " ") {
			orgName = orgName + "-";
		} else {
			orgName = orgName + character;
		}
	}
	const url = `${process.env.APP_PREFIX}/invite/learner/${organisation.metadata.id}__${orgName}__${organisation.join.learner}`;
	// Success handler
	return res.send({ status: "succeeded", content: url });
});

// ADMIN ----------------------------------------------------

// @route     POST /organisation/admin/read
// @desc
// @access    Backend
router.post("/organisation/admin/read", async (req, res) => {
	// Validate if the PRIVATE_API_KEY match
	if (req.body.PRIVATE_API_KEY !== process.env.PRIVATE_API_KEY) {
		return res.send({ status: "critical error", content: "" });
	}
	// Fetch the organisation
	let organisation;
	try {
		organisation = await Organisation.findOne({ _id: req.body.input.organisation });
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	if (!organisation) return res.send({ status: "error", content: "no organisation found" });
	// Fetch all licenses
	let licenses;
	try {
		licenses = await License.find({ organisation: organisation._id });
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	let profileIds = [];
	for (let i = 0; i < licenses.length; i++) {
		const license = licenses[i];
		profileIds.push(license.profile);
	}
	// Fetch all profiles
	let profiles;
	try {
		profiles = await Profile.find({ _id: profileIds });
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	let accountIds = [];
	for (let i = 0; i < profiles.length; i++) {
		const profile = profiles[i];
		if (profile.account) if (profile.account.local) accountIds.push(profile.account.local);
	}
	// Fetch all accounts
	let accounts;
	try {
		accounts = await Account.find({ _id: accountIds });
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	// Build the return object
	let contentOne = {
		name: organisation.name,
		type: organisation.type,
		location: organisation.location ? organisation.location : {},
		join: organisation.join,
		date: organisation.date,
		metadata: organisation.metadata,
		licenses: [],
		classes: []
	};
	let contentTwo = [];
	for (let i = 0; i < licenses.length; i++) {
		const license = licenses[i];
		const profile = profiles.find((profile) => {
			return profile._id.toString() === license.profile.toString();
		});
		const account = accounts.find((account) => {
			if (profile.account) if (profile.account.local) return account._id.toString() === profile.account.local.toString();
			return false;
		});
		let contentThree;
		if (account) contentThree = { email: account.email, date: account.date, verified: account.verified.status };
		contentTwo.push({
			username: license.username,
			identification: license.identification,
			status: "free", // Temporary
			access: license.access,
			date: license.date,
			profile: { 
				displayName: profile.displayName, account: contentThree, saves: profile.saves },
		});
	}
	contentOne.licenses = contentTwo;
	// Success handler
	return res.send({ status: "succeeded", content: contentOne });
});

// @route     POST /organisation/admin/create-learner
// @desc
// @access    Backend
router.post("/organisation/admin/create-learner", async (req, res) => {
	// Validate if the PRIVATE_API_KEY match
	if (req.body.PRIVATE_API_KEY !== process.env.PRIVATE_API_KEY) {
		return res.send({ status: "critical error", content: "" });
	}
	// Fetch the organisation
	let organisation;
	try {
		organisation = await Organisation.findOne({ _id: req.body.input.organisation });
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	if (!organisation) return res.send({ status: "critical error", content: "" });
	// Create a learner license
	const licenseObject = {
		username: req.body.input.username,
		password: req.body.input.password,
		statuses: [{ type: req.body.input.status, date: req.body.input.date }],
		access: "learner",
		date: req.body.input.date,
		join: { approved: true, date: req.body.input.date },
	};
	let license;
	try {
		license = await License.build(licenseObject, false);
	} catch (data) {
		return res.send(data);
	}
	// Create the profile of the new learner
	let profileObject = { displayName: req.body.input.displayName, date: req.body.input.date };
	if (req.body.input.saves) profileObject.saves = req.body.input.saves;
	let profile;
	try {
		profile = await Profile.build(profileObject, false);
	} catch (data) {
		return res.send(data);
	}
	// Establish links
	organisation.licenses.push(license._id);
	license.organisation = organisation._id;
	license.profile = profile._id;
	profile.license = license._id;
	profile.licenses = [license._id];
	// Save instances
	organisation.date.modified = req.body.input.date;
	const promises = [organisation.save(), license.save(), profile.save()];
	try {
		await Promise.all(promises);
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	// Success handler
	return res.send({ status: "succeeded", content: "" });
});

// @route     POST /organisation/admin/update-learner-license
// @desc
// @access    Backend
router.post("/organisation/admin/update-learner-license", async (req, res) => {
	// Validate if the PRIVATE_API_KEY match
	if (req.body.PRIVATE_API_KEY !== process.env.PRIVATE_API_KEY) {
		return res.send({ status: "critical error", content: "" });
	}
	// Fetch the license
	const query = { organisation: req.body.input.organisation, username: req.body.input.username, access: "learner" };
	let license;
	try {
		license = await License.findOne(query);
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	if (!license) return res.send({ status: "critical error", content: "" });
	// Update the license
	let valid = true;
	errors = {};
	for (const property in req.body.input.updates) {
		const value = req.body.input.updates[property];
		switch (property) {
			case "username":
				// TODO: validate the username input
				try {
					await License.validateUsername(value, false);
				} catch (data) {
					if (data.status === "error") {
						return res.send(data);
					} else if (data.status === "failed") {
						valid = false;
						errors[property] = data.content;
					}
				}
				license[property] = value;
				break;
			case "password":
				// TODO: validate the password input
				license[property] = value;
				break;
			case "status":
				// TODO: License status update logic
				break;
			default:
				break;
		}
	}
	// Check if the update was successful
	if (!valid) return res.send({ status: "failed", content: errors });
	// Save the updates
	license.date.modified = req.body.input.date;
	try {
		await license.save();
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	// Success handler
	return res.send({ status: "succeeded", content: undefined });
});

// EXPORT ===================================================

module.exports = router;

// END ======================================================
