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

// @route     Get /story
// @desc      
// @access    Public
router.get("/story", (req, res) => res.sendFile("story.html", viewsOption));

// @route     Get /team
// @desc      
// @access    Public
router.get("/team", (req, res) => res.sendFile("team.html", viewsOption));

// @route     Get /products/kits
// @desc      
// @access    Public
router.get("/products/kits", (req, res) => res.sendFile("kits.html", viewsOption));

// @route     Get /services/3d-printing
// @desc      
// @access    Public
router.get("/services/3d-printing", (req, res) => res.sendFile("printing.html", viewsOption));

// @route     GET /terms
// @desc
// @access    PUBLIC
router.get("/terms", (req, res) => res.sendFile("terms.html", viewsOption));

// @route     GET /contact-us
// @desc      
// @access    PUBLIC
router.get("/contact", (req, res) => res.sendFile("contact-us.html", viewsOption));

// @route     GET /privacy
// @desc
// @access    PUBLIC
router.get("/privacy", (req, res) => res.sendFile("privacy.html", viewsOption));

// @route     GET /survey
// @desc
// @access    PUBLIC
router.get("/survey", (req, res) => res.sendFile("survey.html", viewsOption));

// @route     GET /unsubscribe/:email
// @desc
// @access    PUBLIC
router.get("/mailing-list/unsubscribe/:email", async (req, res) => {
  const email = req.params.email;
  try {
    await Mail.demolish({ email });
  } catch (data) {
    return res.status(404).sendFile("error404.html", viewsOption);
  }
  return res.sendFile("unsubscribe.html", viewsOption);
});

// @route     GET /robots.txt
// @desc
// @access    PUBLIC
router.get("/robots.txt", (req, res) => res.sendFile("robots.txt", viewsOption));

/*=========================================================================================
EXPORT ROUTE
=========================================================================================*/

module.exports = router;

/*=========================================================================================
END
=========================================================================================*/
