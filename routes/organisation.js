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

// @route     POST /organisation/create
// @desc
// @access    Backend
router.post("/organisation/create", async (req, res) => {
	// Validate if the PRIVATE_API_KEY match
	if (req.body.PRIVATE_API_KEY !== process.env.PRIVATE_API_KEY) {
		return res.send({ status: "critical error", content: "Invalid API Key" });
	}
	// Fetch the license
	const licenseObject = {
		_id: req.body.input.license,
		access: "educator",
	};
	let license;
	try {
		license = await License.findOne(licenseObject);
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	if (!license) {
		return res.send({ status: "critical error", content: "There is no license found" });
	}
	// Create the organisation and its instance
	const organisationObject = {
		name: req.body.input.name,
		license: req.body.input.license,
		type: req.body.input.type,
		lite: { activated: false, date: "" },
		location: { city: req.body.input.city, country: req.body.input.country },
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
	// Success handler
	return res.send({ status: "succeeded", content: "A new organisation has been created" });
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
			profile: {
				displayName: profile.displayName,
				saves: profile.saves,
			},
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
		return res.send({ status: "critical error", content: "Invalid API Key" });
	}
	// Fetch the organisation
	const organisationObject = {
		name: req.body.input.name,
		"metadata.id": req.body.input.metadata.id,
	};
	let organisation;
	try {
		organisation = await Organisation.findOne(organisationObject);
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	// There is no organisation found with this name or id
	if (!organisation) {
		return res.send({ status: "failed", content: "Invalid organisation name or/and ID" });
	}
	// Validate code
	if (req.body.input.code !== organisation.join.educator) {
		return res.send({ status: "failed", content: "Invalid code" });
	}
	// Fetch the license
	let license;
	try {
		license = await License.findOne({ _id: req.body.input.license });
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	// Check if the license is already attached to an organisation
	if (license.organisation) {
		return res.send({ status: "critical error", content: "This license is already in an organisation" });
	}
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

// @route     POST /organisation/admin-create-learner
// @desc
// @access    Backend
router.post("/organisation/admin-create-learner", async (req, res) => {
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
	// Create a license
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
	// Create a profile
	let profileObject = {
		displayName: req.body.input.displayName,
		date: { created: req.body.input.date, visited: req.body.input.date, modified: req.body.input.date },
	};
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
	const promises = [organisation.save(), license.save(), profile.save()];
	try {
		await Promise.all(promises);
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	// Success handler
	return res.send({ status: "succeeded", content: "Successfully created a learner license" });
});

// EXPORT ===================================================

module.exports = router;

// END ======================================================
