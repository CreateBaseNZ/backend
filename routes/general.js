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

// @route     GET /terms-and-conditions
// @desc
// @access    PUBLIC
router.get("/terms-and-conditions", (req, res) => res.sendFile("terms-and-conditions.html", viewsOption));

// @route     GET /contact-us
// @desc      
// @access    PUBLIC
router.get("/contact", (req, res) => res.sendFile("contact-us.html", viewsOption));

// @route     GET /privacy-policy
// @desc
// @access    PUBLIC
router.get("/privacy-policy", (req, res) => res.sendFile("privacy-policy.html", viewsOption));

// @route     GET /survey
// @desc
// @access    PUBLIC
router.get("/survey", (req, res) => res.sendFile("survey.html", viewsOption));

// @route     GET /unsubscribe/:email
// @desc
// @access    PUBLIC
router.get("/unsubscribe/:email", async (req, res) => {
  const email = req.params.email;
  // VALIDATE EMAIL
  let valid = true;
  let emailRE = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email === "") {
    valid = false;
  } else if (!emailRE.test(String(email).toLowerCase())) {
    valid = false;
  }
  // VALIDATE EMAIL
  if (valid) {
    try {
      await Mail.demolish({ email });
    } catch (data) {
      return res.status(404).sendFile("error404.html", viewsOption);
    }
    return res.sendFile("unsubscribe.html", viewsOption);
  } else {
    return res.status(404).sendFile("error404.html", viewsOption);
  }
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
