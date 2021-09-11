// MODULES ==================================================

const express = require("express");

// VARIABLES ================================================

const router = new express.Router();

// MODELS ===================================================

const Class = require("../model/Class.js");
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
