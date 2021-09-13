// MODULES ==================================================

const express = require("express");

// VARIABLES ================================================

const router = new express.Router();

// MODELS ===================================================

const Class = require("../model/Class.js");
const License = require("../model/License.js");
const ProjectConfig = require("../model/ProjectConfig.js");

// ROUTES ===================================================

// @route   POST /class/create
// @desc
// @access  PUBLIC
router.post("/class/create", async (req, res) => {
	// Validate if the PRIVATE_API_KEY match
	if (req.body.PRIVATE_API_KEY !== process.env.PRIVATE_API_KEY) {
		return res.send({ status: "critical error", content: "" });
	}
	// Create the instance object
	const object = new Object({
		organisation: req.body.input.organisation,
		admin: req.body.input.admin,
		name: req.body.input.name,
		date: { created: req.body.input.date, modified: req.body.input.date },
	});
	// Create the instance
	try {
		await Class.build(object);
	} catch (data) {
		return res.send(data);
	}
	// Success handler
	return res.send({ status: "succeeded", content: undefined });
});

// @route   POST /class/archive
// @desc
// @access  PUBLIC
router.post("/class/archive", async (req, res) => {
	// Validate if the PRIVATE_API_KEY match
	if (req.body.PRIVATE_API_KEY !== process.env.PRIVATE_API_KEY) {
		return res.send({ status: "critical error", content: "" });
	}
	// Success handler
	return res.send({ status: "succeeded", content: undefined });
});

// @route   POST /class/delete
// @desc
// @access  PUBLIC
router.post("/class/delete", async (req, res) => {
	// Validate if the PRIVATE_API_KEY match
	if (req.body.PRIVATE_API_KEY !== process.env.PRIVATE_API_KEY) {
		return res.send({ status: "critical error", content: "" });
	}
	// Success handler
	return res.send({ status: "succeeded", content: undefined });
});

// DATA -----------------------------------------------------

// @route   POST /class/data/read
// @desc
// @access  PUBLIC
router.post("/class/data/read", async (req, res) => {
	// Validate if the PRIVATE_API_KEY match
	if (req.body.PRIVATE_API_KEY !== process.env.PRIVATE_API_KEY) {
		return res.send({ status: "critical error", content: "" });
	}
	// Success handler
	return res.send({ status: "succeeded", content: undefined });
});

// @route   POST /class/data/update
// @desc
// @access  PUBLIC
router.post("/class/data/update", async (req, res) => {
	// Validate if the PRIVATE_API_KEY match
	if (req.body.PRIVATE_API_KEY !== process.env.PRIVATE_API_KEY) {
		return res.send({ status: "critical error", content: "" });
	}
	// Success handler
	return res.send({ status: "succeeded", content: undefined });
});

// @route   POST /class/data/delete
// @desc
// @access  PUBLIC
router.post("/class/data/delete", async (req, res) => {
	// Validate if the PRIVATE_API_KEY match
	if (req.body.PRIVATE_API_KEY !== process.env.PRIVATE_API_KEY) {
		return res.send({ status: "critical error", content: "" });
	}
	// Success handler
	return res.send({ status: "succeeded", content: undefined });
});

// MEMBER ---------------------------------------------------

// @route   POST /class/member/add-educators
// @desc
// @access  PUBLIC
router.post("/class/member/add-educators", async (req, res) => {
	// Validate if the PRIVATE_API_KEY match
	if (req.body.PRIVATE_API_KEY !== process.env.PRIVATE_API_KEY) {
		return res.send({ status: "critical error", content: "" });
	}
	// Success handler
	return res.send({ status: "succeeded", content: undefined });
});

// @route   POST /class/member/remove-educators
// @desc
// @access  PUBLIC
router.post("/class/member/remove-educators", async (req, res) => {
	// Validate if the PRIVATE_API_KEY match
	if (req.body.PRIVATE_API_KEY !== process.env.PRIVATE_API_KEY) {
		return res.send({ status: "critical error", content: "" });
	}
	// Success handler
	return res.send({ status: "succeeded", content: undefined });
});

// @route   POST /class/member/join-educator
// @desc
// @access  PUBLIC
router.post("/class/member/join-educator", async (req, res) => {
	// Validate if the PRIVATE_API_KEY match
	if (req.body.PRIVATE_API_KEY !== process.env.PRIVATE_API_KEY) {
		return res.send({ status: "critical error", content: "" });
	}
	// Success handler
	return res.send({ status: "succeeded", content: undefined });
});

// @route   POST /class/member/leave-educator
// @desc
// @access  PUBLIC
router.post("/class/member/leave-educator", async (req, res) => {
	// Validate if the PRIVATE_API_KEY match
	if (req.body.PRIVATE_API_KEY !== process.env.PRIVATE_API_KEY) {
		return res.send({ status: "critical error", content: "" });
	}
	// Success handler
	return res.send({ status: "succeeded", content: undefined });
});

// @route   POST /class/member/add-learners
// @desc
// @access  PUBLIC
router.post("/class/member/add-learners", async (req, res) => {
	// Validate if the PRIVATE_API_KEY match
	if (req.body.PRIVATE_API_KEY !== process.env.PRIVATE_API_KEY) {
		return res.send({ status: "critical error", content: "" });
	}
	// Fetch the class
	let classInstance;
	try {
		classInstance = await Class.findOne({ organisation: req.body.input.organisation, name: req.body.input.name });
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	if (!classInstance) return res.send({ status: "error", content: "no class found" });
	// Validate if the user can add learners
	if (classInstance.educators.indexOf(req.body.input.license) === -1 && classInstance.admin !== req.body.input.license) {
		return res.send({ status: "error", content: "invalid access" });
	}
	// Fetch the licenses
	let licenses;
	try {
		licenses = await License.find({ organisation: req.body.input.organisation, username: req.body.input.usernames });
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	let licenseIds = licenses.map((license) => license._id);
	// Add the learner licenses onto the class
	for (let i = 0; i < licenseIds.length; i++) {
		const licenseId = licenseIds[i];
		if (classInstance.learners.indexOf(licenseId) === -1) {
			classInstance.learners.push(licenseId);
		}
	}
	// Save changes
	classInstance.date.modified = req.body.input.date;
	try {
		await classInstance.save();
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	// Success handler
	return res.send({ status: "succeeded", content: undefined });
});

// @route   POST /class/member/remove-learners
// @desc
// @access  PUBLIC
router.post("/class/member/remove-learners", async (req, res) => {
	// Validate if the PRIVATE_API_KEY match
	if (req.body.PRIVATE_API_KEY !== process.env.PRIVATE_API_KEY) {
		return res.send({ status: "critical error", content: "" });
	}
	// Success handler
	return res.send({ status: "succeeded", content: undefined });
});

// @route   POST /class/member/join-learner
// @desc
// @access  PUBLIC
router.post("/class/member/join-learner", async (req, res) => {
	// Validate if the PRIVATE_API_KEY match
	if (req.body.PRIVATE_API_KEY !== process.env.PRIVATE_API_KEY) {
		return res.send({ status: "critical error", content: "" });
	}
	// Success handler
	return res.send({ status: "succeeded", content: undefined });
});

// @route   POST /class/member/leave-learner
// @desc
// @access  PUBLIC
router.post("/class/member/leave-learner", async (req, res) => {
	// Validate if the PRIVATE_API_KEY match
	if (req.body.PRIVATE_API_KEY !== process.env.PRIVATE_API_KEY) {
		return res.send({ status: "critical error", content: "" });
	}
	// Success handler
	return res.send({ status: "succeeded", content: undefined });
});

// PROJECT --------------------------------------------------

// @route   POST /class/project/add
// @desc
// @access  PUBLIC
router.post("/class/project/add", async (req, res) => {
	// Validate if the PRIVATE_API_KEY match
	if (req.body.PRIVATE_API_KEY !== process.env.PRIVATE_API_KEY) {
		return res.send({ status: "critical error", content: "" });
	}
	// Fetch the class
	let classInstance;
	try {
		classInstance = await Class.findOne({ organisation: req.body.input.organisation, name: req.body.input.name });
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	if (!classInstance) return res.send({ status: "error", content: "no class found" });
	// Validate if the user can add a project
	if (classInstance.educators.indexOf(req.body.input.license) === -1 && classInstance.admin !== req.body.input.license) {
		return res.send({ status: "error", content: "invalid access" });
	}
	// Set the authors
	let authors = classInstance.educators ? classInstance.educators : [];
	if (authors.indexOf(classInstance.admin) === -1) authors.push(classInstance.admin);
	// Create the project config instance
	const object = new Object({ authors, project: req.body.input.project });
	let projectConfig;
	try {
		projectConfig = await ProjectConfig.build(object);
	} catch (data) {
		return res.send(data);
	}
	// Update the class
	classInstance.projects.push(projectConfig._id);
	classInstance.date.modified = req.body.input.date;
	try {
		await classInstance.save();
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	// Success handler
	return res.send({ status: "succeeded", content: undefined });
});

// @route   POST /class/project/remove
// @desc
// @access  PUBLIC
router.post("/class/project/remove", async (req, res) => {
	// Validate if the PRIVATE_API_KEY match
	if (req.body.PRIVATE_API_KEY !== process.env.PRIVATE_API_KEY) {
		return res.send({ status: "critical error", content: "" });
	}
	// Success handler
	return res.send({ status: "succeeded", content: undefined });
});

// EXPORT ===================================================

module.exports = router;

// END ======================================================