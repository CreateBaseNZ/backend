/*=========================================================================================
REQUIRED MODULES
=========================================================================================*/

if (process.env.NODE_ENV !== "production") require("dotenv").config();
const express = require("express");
const path = require("path");

/*=========================================================================================
VARIABLES
=========================================================================================*/

const router = new express.Router();
const viewsOption = { root: path.join(__dirname, "../views") };

/*=========================================================================================
MODELS
=========================================================================================*/

const Mail = require("../model/Mail.js");

/*=========================================================================================
ROUTES
=========================================================================================*/

// @route     Get /
// @desc
// @access    Public
router.get("/", (req, res) => res.sendFile("home.html", viewsOption));

// @route     Get /team
// @desc
// @access    Public
router.get("/team", (req, res) => res.sendFile("team.html", viewsOption));

// @route     Get /about
// @desc
// @access    Public
router.get("/about", (req, res) => res.sendFile("about.html", viewsOption));

// @route     Get /latest
// @desc
// @access    Public
router.get("/latest", (req, res) => res.sendFile("latest.html", viewsOption));

// @route     GET /terms
// @desc
// @access    PUBLIC
router.get("/terms", (req, res) => res.sendFile("terms.html", viewsOption));

// @route     GET /contact
// @desc
// @access    PUBLIC
router.get("/contact", (req, res) => res.sendFile("contact.html", viewsOption));

// @route     GET /privacy
// @desc
// @access    PUBLIC
router.get("/privacy", (req, res) => res.sendFile("privacy.html", viewsOption));

// @route     GET /release-notes
// @desc
// @access    PUBLIC
router.get("/release-notes", (req, res) => res.sendFile("release-notes.html", viewsOption));

// @route     GET /unsubscribe/:email
// @desc
// @access    PUBLIC
router.get("/mailing-list/unsubscribe/:email", async (req, res) => {
	const email = req.params.email;
	try {
		await Mail.demolish({ email });
	} catch (data) {
		return res.status(404).sendFile("error-404.html", viewsOption);
	}
	return res.sendFile("unsubscribe.html", viewsOption);
});

// @route     GET /robots.txt
// @desc
// @access    PUBLIC
router.get("/robots.txt", (req, res) => res.sendFile("robots.txt", viewsOption));

// @route     GET /fetch-release-notes
// @desc
// @access    Public
router.get("/fetch-release-notes", async (req, res) => res.send(releaseNotes));

/*=========================================================================================
EXPORT ROUTE
=========================================================================================*/

module.exports = router;

/*=========================================================================================
END
=========================================================================================*/
