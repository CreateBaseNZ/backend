// MODULES ==================================================

const express = require("express");
const retrieve = require("../algorithms/retrieve.js");

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

// @route   POST /group/school/register
// @desc
// @access
router.post("/group/school/register", checkAPIKeys(false, true), async (req, res) => {
	const input = req.body.input;
	// Generate a unique number and codes
	let number;
	let join = {};
	let promises = [Group.generateNumber(), Group.generateCode("teacher"), Group.generateCode("student")];
	try {
		[number, join.teacher, join.student] = await Promise.all(promises);
	} catch (data) {
		return res.send(data);
	}
	// Create the group instance
	let group = new Group({
		number,
		name: input.name,
		type: "school",
		location: input.location,
		join,
		date: { created: input.date, modified: input.date },
	});
	// Save the group instance
	try {
		await group.save();
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	// Success handler
	return res.send({ status: "succeeded", content: { group } });
});

// @route   POST /group/add-member
// @desc
// @access
router.post("/group/add-member", checkAPIKeys(false, true), async (req, res) => {
	const input = req.body.input;
	// Initialise failed handler
	let failed = { group: "", profile: "" };
	// Fetch the group and profile instances
	let group;
	let profile;
	const promises1 = [Group.findOne({ _id: input.group }), Profile.findOne({ _id: input.profile })];
	try {
		[group, profile] = await Promise.all(promises1);
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	if (!group) {
		failed.group = "does not exist";
		return res.send({ status: "failed", content: failed });
	}
	if (!profile) {
		failed.profile = "does not exist";
		return res.send({ status: "failed", content: failed });
	}
	// Create a license
	let license = new License({
		role: input.role,
		date: { created: input.date },
		status: input.status,
	});
	// Create the links between instances
	if (license.status === "activated") {
		group.licenses.active.push(license._id);
	} else {
		group.licenses.queue.push(license._id);
	}
	profile.licenses.push(license._id);
	license.group = group._id;
	license.profile = profile._id;
	// Save instances
	group.date.modified = input.date;
	license.date.modified = input.date;
	profile.date.modified = input.date;
	const promises2 = [group.save(), profile.save(), license.save()];
	try {
		await Promise.all(promises2);
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	// Success handler
	return res.send({ status: "succeeded", content: { group, profile, license } });
});

// @route   POST /group/remove-member
// @desc
// @access
router.post("/group/remove-member", checkAPIKeys(false, true), async (req, res) => {
	const input = req.body.input;
	// Initialise failed handler
	let failed = { group: "", license: "", profile: "" };
	// Fetch the group and the license
	let group;
	let license;
	const promises1 = [Group.findOne({ _id: input.group }), License.findOne({ _id: input.license })];
	try {
		[group, license] = await Promise.all(promises1);
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	if (!group) {
		failed.group = "does not exist";
		return res.send({ status: "failed", content: failed });
	}
	if (!license) {
		failed.license = "does not exist";
		return res.send({ status: "failed", content: failed });
	}
	// Fetch the profile
	let profile;
	try {
		profile = await Profile.findOne({ _id: license.profile });
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	if (!profile) {
		failed.profile = "does not exist";
		return res.send({ status: "failed", content: failed });
	}
	// Remove linkage
	if (license.status === "activated") {
		group.licenses.active = group.licenses.active.filter((licenseId) => licenseId.toString() !== license._id.toString());
	} else {
		group.licenses.queue = group.licenses.queue.filter((licenseId) => licenseId.toString() !== license._id.toString());
	}
	group.licenses.inactive.push(license._id);
	license.status = "deactivated";
	license.date.deactivated = input.date;
	profile.licenses = profile.licenses.filter((licenseId) => licenseId.toString() !== license._id.toString());
	// Update instances
	group.date.modified = input.date;
	license.date.modified = input.date;
	profile.date.modified = input.date;
	const promises2 = [group.save(), profile.save(), license.save()];
	try {
		await Promise.all(promises2);
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	// Success handler
	return res.send({ status: "succeeded", content: { group, profile, license } });
});

// @route   POST /group/retrieve-by-code
// @desc
// @access
router.post("/group/retrieve-by-code", checkAPIKeys(false, true), async (req, res) => {
	const input = req.body.input;
	// Initialise failed handler
	let failed = { group: "", role: "" };
	// Fetch the group instance
	let promise;
	switch (input.role) {
		case "school-teacher":
			promise = Group.findOne({ type: "school", "join.teacher": input.code });
			break;
		case "school-student":
			promise = Group.findOne({ type: "school", "join.student": input.code });
			break;
		default:
			failed.role = "invalid";
			return res.send({ status: "failed", content: failed });
	}
	let group;
	try {
		group = await promise;
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	if (!group) {
		failed.group = "does not exist";
		return res.send({ status: "failed", content: failed });
	}
	// Success handler
	return res.send({ status: "succeeded", content: group });
});

// @route   POST /group/retrieve
// @desc
// @access
router.post("/group/retrieve", checkAPIKeys(false, true), async (req, res) => {
	const input = req.body.input;
	// Fetch the group instance
	let groups;
	try {
		groups = await Group.find(input.query);
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	if (!groups.length) return res.send({ status: "failed", content: { groups: "do not exists" } });
	// Fetch the groups details
	try {
		groups = await retrieve.groups(groups, input.option);
	} catch (data) {
		return res.send(data);
	}
	// Success handler
	return res.send({ status: "succeeded", content: groups });
});

// @route		POST /group/update
// @desc
// @access
router.post("/group/update", checkAPIKeys(false, true), async (req, res) => {});

// @route		POST /group/metadata/update
// @desc
// @access
router.post("/group/metadata/update", checkAPIKeys(false, true), async (req, res) => {
	const input = req.body.input;
	// Initialise failed handler
	let failed = { group: "" };
	// Fetch the group of interest
	let group;
	try {
		group = await Group.findOne({ _id: input.group });
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	if (!group) {
		failed.group = "does not exist";
		return res.send({ status: "failed", content: failed });
	}
	// Update metadata
	Object.assign(group.metadata, input.metadata);
	// Save the updates
	group.date.modified = input.date;
	group.markModified("metadata");
	try {
		group.save();
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	// Success handler
	return res.send({ status: "succeeded", content: group.metadata });
});

// @route		POST /group/metadata/read
// @desc
// @access
router.post("/group/metadata/read", checkAPIKeys(false, true), async (req, res) => {
	const input = req.body.input;
	// Initialise failed handler
	let failed = { group: "" };
	// Fetch the group of interest
	let group;
	try {
		group = await Group.findOne({ _id: input.group });
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	if (!group) {
		failed.group = "does not exist";
		return res.send({ status: "failed", content: failed });
	}
	// Success handler
	return res.send({ status: "succeeded", content: group.metadata });
});

// @route		POST /group/metadata/delete
// @desc
// @access
router.post("/group/metadata/delete", checkAPIKeys(false, true), async (req, res) => {
	const input = req.body.input;
	// Initialise failed handler
	let failed = { group: "" };
	// Fetch the group of interest
	let group;
	try {
		group = await Group.findOne({ _id: input.group });
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	if (!group) {
		failed.group = "does not exist";
		return res.send({ status: "failed", content: failed });
	}
	// Delete metadata
	for (let i = 0; i < input.properties.length; i++) {
		const property = input.properties[i];
		delete group.metadata[property];
	}
	// Save the updates
	group.date.modified = input.date;
	group.markModified("metadata");
	try {
		group.save();
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	// Success handler
	return res.send({ status: "succeeded", content: group.metadata });
});

// FUNCTIONS ================================================

// EXPORT ===================================================

module.exports = router;

// END ======================================================
