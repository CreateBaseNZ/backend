// MODULES ==================================================

const express = require("express");
const retrieve = require("../algorithms/retrieve.js");
const classUpdate = require("../algorithms/class/update.js");

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

// @route   POST /class/create
// @desc
// @access
router.post("/class/create", checkAPIKeys(false, true), async (req, res) => {
	const input = req.body.input;
	// Initialise failed handler
	let failed = { group: "", class: "" };
	// Generate a unique join code, fetch the group of interest
	// and check if class name is unique
	let code;
	let group;
	let instance;
	const promises1 = [Class.generateCode(input.group), Group.findOne({ _id: input.group }), Class.findOne({ name: input.name, group: input.group })];
	try {
		[code, group, instance] = await Promise.all(promises1);
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	if (!group) {
		failed.group = "does not exist";
		return res.send({ status: "failed", content: failed });
	}
	if (instance) {
		failed.class = "taken";
		return res.send({ status: "failed", content: failed });
	}
	// Create the class instance
	instance = new Class({ name: input.name, subject: input.subject, code });
	// Create links between instances
	group.classes.push(instance._id);
	instance.group = group._id;
	// Save the updated instances
	group.date.modified = input.date;
	const promises2 = [group.save(), instance.save()];
	try {
		await Promise.all(promises2);
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	// Success handler
	return res.send({ status: "succeeded", content: { class: instance } });
});

// @route   POST /class/add-member
// @desc
// @access
router.post("/class/add-member", checkAPIKeys(false, true), async (req, res) => {
	const input = req.body.input;
	// Initialise failed handler
	let failed = { class: "", license: "" };
	// Fetch the class of interest and the license to be added
	let instance;
	let license;
	const promises1 = [Class.findOne({ _id: input.class }), License.findOne({ _id: input.license })];
	try {
		[instance, license] = await Promise.all(promises1);
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	if (!instance) {
		failed.class = "does not exist";
		return res.send({ status: "failed", content: failed });
	}
	if (!license) {
		failed.license = "does not exist";
		return res.send({ status: "failed", content: failed });
	}
	// Create the link between instances
	instance.licenses.push(license._id);
	license.classes.push(instance._id);
	// Save the instances
	license.date.modified = input.date;
	const promises2 = [instance.save(), license.save()];
	try {
		await Promise.all(promises2);
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	// Success handler
	return res.send({ status: "succeeded", content: { class: instance, license } });
});

// @route   POST /class/remove-member
// @desc
// @access
router.post("/class/remove-member", checkAPIKeys(false, true), async (req, res) => {
	const input = req.body.input;
	// Initialise failed handler
	let failed = { class: "", license: "" };
	// Fetch the class of interest and the license to be added
	let instance;
	let license;
	const promises1 = [Class.findOne({ _id: input.class }), License.findOne({ _id: input.license })];
	try {
		[instance, license] = await Promise.all(promises1);
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	if (!instance) {
		failed.class = "does not exist";
		return res.send({ status: "failed", content: failed });
	}
	if (!license) {
		failed.license = "does not exist";
		return res.send({ status: "failed", content: failed });
	}
	// Remove the link between instances
	instance.licenses = instance.licenses.filter((licenseId) => licenseId.toString() !== license._id.toString());
	license.classes = license.classes.filter((classId) => classId.toString() !== instance._id.toString());
	// Save the instances
	license.date.modified = input.date;
	const promises2 = [instance.save(), license.save()];
	try {
		await Promise.all(promises2);
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	// Success handler
	return res.send({ status: "succeeded", content: { class: instance, license } });
});

// @route   POST /class/retrieve
// @desc
// @access
router.post("/class/retrieve", checkAPIKeys(false, true), async (req, res) => {
	const input = req.body.input;
	// Fetch the class instance
	let classes;
	try {
		classes = await Class.find(input.query);
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	if (!classes.length) return res.send({ status: "failed", content: { classes: "do not exist" } });
	// Fetch the classes details
	try {
		classes = await retrieve.classes(classes, input.option);
	} catch (data) {
		return res.send(data);
	}
	// Success handler
	return res.send({ status: "succeeded", content: classes });
});

// @route		POST /class/update
// @desc
// @access
router.post("/class/update", checkAPIKeys(false, true), async (req, res) => {
	const input = req.body.input;
	// Fetch the class instance
	let instance;
	try {
		instance = await Class.findOne(input.query);
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	if (!instance) return res.send({ status: "failed", content: { class: "does not exist" } });
	// Update the class instance
	try {
		instance = await classUpdate.main(instance, input.updates, input.date);
	} catch (data) {
		return res.send(data);
	}
	// Success handler
	return res.send({ status: "succeeded", content: instance });
});

// @route		POST /class/delete-metadata
// @desc
// @access
router.post("/class/delete-metadata", checkAPIKeys(false, true), async (req, res) => {
	const input = req.body.input;
	// Fetch the class of interest
	let instance;
	try {
		instance = await Class.findOne({ _id: input.class });
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	if (!instance) res.send({ status: "failed", content: { class: "does not exist" } });
	// Delete metadata
	for (let i = 0; i < input.properties.length; i++) {
		const property = input.properties[i];
		delete instance.metadata[property];
	}
	instance.markModified("metadata");
	// Save the updates
	instance.date.modified = input.date;
	try {
		await instance.save();
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	// Success handler
	return res.send({ status: "succeeded", content: instance.metadata });
});

// @route		POST /class/delete
// @desc
// @access
router.post("/class/delete", checkAPIKeys(false, true), async (req, res) => {
	const input = req.body.input;
	// Fetch the class of interest
	let instance;
	try {
		instance = await Class.findOne(input.query);
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	// Fetch the licenses attached to the class
	let licenses;
	try {
		licenses = await License.find({ _id: instance.licenses });
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	// Remove links between license and class
	let promises = [];
	for (let i = 0; i < licenses.length; i++) {
		let license = licenses[i];
		license.classes = license.classes.filter((classId) => classId.toString() !== instance._id.toString());
		license.date.modified = input.date;
		promises.push(license.save());
	}
	// Delete the class
	promises.push(Class.deleteOne({ _id: instance._id }));
	// Wait for the promises
	try {
		await Promise.all(promises);
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	// Success handler
	return res.send({ status: "succeeded" });
});

// FUNCTIONS ================================================

// EXPORT ===================================================

module.exports = router;

// END ======================================================
