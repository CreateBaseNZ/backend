/*=========================================================================================
REQUIRED MODULES
=========================================================================================*/

const express = require("express");

/*=========================================================================================
VARIABLES
=========================================================================================*/

const router = new express.Router();

/*=========================================================================================
MODELS
=========================================================================================*/

const Session = require("../../model/Session.js");

/*=========================================================================================
MIDDLEWARE
=========================================================================================*/

/*=========================================================================================
ROUTES
=========================================================================================*/

// @route     Get /session/create
// @desc      Creates the network of database for the given session ID
// @access    Public
router.get("/session/create", async (req, res) => {
  // Check if the user is logged in
  if (req.isAuthenticated()) {
    return res.send({ status: "success", content: "a user is logged in" });
  }
  // Retrieve Session ID
  const sessionId = req.sessionID;
  // Create Session
  let content;
  try {
    content = await Session.create(sessionId);
  } catch (error) {
    return res.send({ status: "failed", content: error });
  }
  res.send({ status: "success", content });
});

// @route     Get /session/save
// @desc      Make the session persitent
// @access    Public
router.get("/session/save", async (req, res) => {
  req.session.cookie.expires = new Date(Date.now() + 1000 * 60 * 60 * 365);
  res.send({ status: "success", content: "session saved" });
});

// @route     Get /session/unsave
// @desc      Make the session impersistent
// @access    Public
router.get("/session/unsave", async (req, res) => {
  req.session.cookie.expires = false;
  res.send({ status: "success", content: "session unsaved" });
});

// @route     Get /session/status
// @desc      Check the persistence of the session
// @access    Public
router.get("/session/status", async (req, res) => {
  let content;
  if (req.session.cookie.expires) {
    content = "persistent";
  } else {
    content = "impersistent";
  }
  res.send({ status: "success", content });
});

/*=========================================================================================
EXPORT ROUTE
=========================================================================================*/

module.exports = router;

/*=========================================================================================
END
=========================================================================================*/
