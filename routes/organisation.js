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
		return reject(data);
	}
	// Send the verification email
	try {
		await email.send(mail);
	} catch (data) {
		return reject(data);
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
		return reject(data);
	}
	// Send the verification email
	try {
		await email.send(mail2);
	} catch (data) {
		return reject(data);
	}
	// Success handler
	return res.send({ status: "succeeded", content: "" });
});

// @route     POST /organisation/admin-read
// @desc
// @access    Backend
router.post("/organisation/admin-read", async (req, res) => {
	// Validate if the PRIVATE_API_KEY match
	if (req.body.PRIVATE_API_KEY !== process.env.PRIVATE_API_KEY) {
		return res.send({ status: "critical error", content: "Invalid API Key" });
	}
	// Fetch the organisation
	let organisation;
	try {
		organisation = await Organisation.findOne({ _id: req.body.input.organisation });
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	if (!organisation) {
		return res.send({ status: "failed", content: "There is no organisation found" });
	}
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
	// Build the return object
	let contentOne = {
		name: organisation.name,
		type: organisation.type,
		location: organisation.location,
		join: organisation.join,
		metadata: organisation.metadata,
		licenses: [],
	};
	let contentTwo = [];
	for (let i = 0; i < licenses.length; i++) {
		const license = licenses[i];
		const profile = profiles.find((profile) => {
			return profile._id.toString() === license.profile.toString();
		});
		contentTwo.push({
			username: license.username,
			status: "free", // Temporary
			access: license.access,
			profile: { displayName: profile.displayName, saves: profile.saves },
		});
	}
	contentOne.licenses = contentTwo;
	// Success handler
	return res.send({ status: "succeeded", content: contentOne });
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
		location: organisation.location,
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
		location: organisation.location,
		metadata: organisation.metadata,
		numberOfLicenses: { admin: admins.length, educator: educators.length, learner: learners.length },
	};
	// Success handler
	return res.send({ status: "succeeded", content });
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
			case "password":
			// TODO: validate the password input
			case "status":
				// TODO: License status update logic
				break;
			default:
				license[property] = value;
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
	return res.send({ status: "succeeded", content: "" });
});

// EXPORT ===================================================

module.exports = router;

// END ======================================================
