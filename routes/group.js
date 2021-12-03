// MODULES ==================================================

const express = require("express");
const retrieve = require("../algorithms/retrieve.js");
const groupUpdate = require("../algorithms/group/update.js");
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
		lowerCase: {
			name: input.name.toLowerCase(),
			location: { country: input.location.country.toLowerCase() },
		},
	});
	// Save the group instance
	try {
		await group.save();
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	// Success handler
	return res.send({ status: "succeeded", content: group });
});

// @route   POST /group/school/verify
// @desc
// @access
router.post("/group/school/verify", checkAPIKeys(false, true), async (req, res) => {
	const input = req.body.input;
	// Fetch the group instance
	let group;
	try {
		group = await Group.findOne(input.query);
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	if (!group) return res.send({ status: "failed", content: { group: "does not exist" } });
	// Update the verification status
	group.verified = true;
	group.date.verified = input.date;
	// Save update
	group.date.modified = input.date;
	try {
		await group.save();
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	// Fetch the details of the admin
	try {
		group = (await retrieve.groups([group], { license: [], profile: [], account: [] }))[0];
	} catch (error) {
		return res.send(error);
	}
	// Send the email
	for (let i = 0; i < group.licenses.active.length; i++) {
		const license = group.licenses.active[i];
		if (license.role === "admin" || license.role === "teacher") {
			const option = {
				recipient: license.profile.account.email,
				name: license.profile.name.first,
				receive: "organisation-verified",
				notification: "general",
				tone: "friendly",
				group: group.name,
			};
			agenda.now("email", { option });
		}
	}
	// Success handler
	return res.send({ status: "succeeded", content: { group } });
});

// @route   POST /group/check-privileges
// @desc
// @access
router.post("/group/check-privileges", checkAPIKeys(false, true), async (req, res) => {
	const input = req.body.input;
	// Fetch the group of interest
	let group;
	try {
		group = await Group.findOne(input.query.group);
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	if (!group) return res.send({ status: "failed", content: { group: "does not exist" } });
	// Fetch all the licenses of interest
	let licenses;
	try {
		licenses = await License.find(input.query.license);
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	// Check privileges
	let checks = [];
	for (let i = 0; i < input.licenseIds.length; i++) {
		const licenseId = input.licenseIds[i];
		const license = licenses.find((element) => element._id.toString() === licenseId.toString());
		let privilege = { member: { active: false, queue: false, inactive: false }, admin: false, teacher: false, student: false };
		if (group.licenses.active.some((element) => element.toString() === license._id.toString())) {
			privilege.member.active = true;
		}
		if (group.licenses.queue.some((element) => element.toString() === license._id.toString())) {
			privilege.member.queue = true;
		}
		if (group.licenses.inactive.some((element) => element.toString() === license._id.toString())) {
			privilege.member.inactive = true;
		}
		if (privilege.member.active || privilege.member.queue || privilege.member.inactive) {
			if (license.role === "admin") privilege.admin = true;
			if (license.role === "teacher") privilege.teacher = true;
			if (license.role === "student") privilege.student = true;
		}
		checks.push({ licenseId, privilege });
	}
	// Success handler
	return res.send({ status: "succeeded", content: checks });
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
		license.date.joined = input.date;
	} else {
		license.metadata.requestMessage = input.requestMessage;
		license.metadata.inviteMessage = input.inviteMessage;
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
	console.log("Remove Member");
	const input = req.body.input;
	console.log(input);
	// Initialise failed handler
	let failed = { group: "", license: "", profile: "", classes: "" };
	// Fetch the group and the license
	let group;
	let license;
	const promises1 = [Group.findOne(input.query.group), License.findOne(input.query.license)];
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
	let classes;
	const promises2 = [Profile.findOne({ _id: license.profile }), Class.find({ _id: license.classes })];
	try {
		[profile, classes] = await Promise.all(promises2);
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	if (!profile) {
		failed.profile = "does not exist";
		return res.send({ status: "failed", content: failed });
	}
	let promises3 = [];
	// Remove license from all the classes
	if (classes.length) {
		for (let i = 0; i < classes.length; i++) {
			let instance = classes[i];
			instance.licenses.active = instance.licenses.active.filter((licenseId) => licenseId.toString() !== license._id.toString());
			instance.licenses.requested = instance.licenses.requested.filter((licenseId) => licenseId.toString() !== license._id.toString());
			instance.licenses.invited = instance.licenses.invited.filter((licenseId) => licenseId.toString() !== license._id.toString());
			license.classes = license.classes.filter((classId) => classId.toString() !== instance._id.toString());
			promises3.push(instance.save());
		}
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
	promises3.push(group.save(), profile.save(), license.save());
	try {
		await Promise.all(promises3);
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	// Success handler
	return res.send({ status: "succeeded", content: { group, profile, license } });
});

// @route   POST /group/accept-member
// @desc
// @access
router.post("/group/accept-member", checkAPIKeys(false, true), async (req, res) => {
	const input = req.body.input;
	// Initialise failed handler
	let failed = {};
	// Fetch the group and the license of the user
	let group;
	let license;
	try {
		[group, license] = await Promise.all([Group.findOne(input.query.group), License.findOne(input.query.license)]);
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	if (!group) return res.send({ status: "failed", content: { group: "does not exist" } });
	if (!license) return res.send({ status: "failed", content: { license: "does not exist" } });
	// Check if the user has already been accepted
	if (group.licenses.active.find((licenseId) => licenseId.toString() === license._id.toString())) {
		failed.license = "already a member";
		return res.send({ status: "failed", content: failed });
	}
	// Remove the license from the queue
	group.licenses.queue = group.licenses.queue.filter((licenseId) => licenseId.toString() !== license._id.toString());
	group.licenses.active.push(license._id);
	license.status = "activated";
	license.date.joined = input.date;
	// Update instances
	group.date.modified = input.date;
	license.date.modified = input.date;
	try {
		await Promise.all([group.save(), license.save()]);
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	// Success handler
	return res.send({ status: "succeeded", content: { group, license } });
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
	// Fetch the groups details
	try {
		group = (await retrieve.groups([group], input.option))[0];
	} catch (data) {
		return res.send(data);
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
router.post("/group/update", checkAPIKeys(false, true), async (req, res) => {
	const input = req.body.input;
	// Fetch the group instance
	let group;
	try {
		group = await Group.findOne(input.query);
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	if (!group) return res.send({ status: "failed", content: { group: "does not exist" } });
	// Update the group instance
	try {
		group = await groupUpdate.main(group, input.updates, input.date);
	} catch (data) {
		return res.send(data);
	}
	// Success handler
	return res.send({ status: "succeeded", content: group });
});

// @route		POST /group/delete-metadata
// @desc
// @access
router.post("/group/delete-metadata", checkAPIKeys(false, true), async (req, res) => {
	const input = req.body.input;
	// Fetch the group of interest
	let group;
	try {
		group = await Group.findOne({ _id: input.group });
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	if (!group) return res.send({ status: "failed", content: { group: "does not exist" } });
	// Delete metadata
	for (let i = 0; i < input.properties.length; i++) {
		const property = input.properties[i];
		delete group.metadata[property];
	}
	group.markModified("metadata");
	// Save the updates
	group.date.modified = input.date;
	try {
		await group.save();
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
