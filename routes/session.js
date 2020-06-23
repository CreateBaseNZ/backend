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

const Session = require("../model/Session.js");

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
    res.send({ status: "failed", content: error });
    return;
  }
  // Send Success Message to the Client
  res.send({ status: "success", content });
  return;
});

// @route     Get /session/save
// @desc      Make the session persitent
// @access    Public
router.get("/session/save", async (req, res) => {
  // Check if the user is logged in
  if (req.isAuthenticated()) {
    return res.send({ status: "success", content: "a user is logged in" });
  }
  // Retrieve Session ID
  const sessionId = req.sessionID;
  // Set Session Status
  let session;
  try {
    session = await Session.findOne({ sessionId });
  } catch (error) {
    res.send({ status: "failed", content: error });
    return;
  }
  session.status = "persistent";
  // Save update
  try {
    await session.save();
  } catch (error) {
    res.send({ status: "failed", content: error });
    return;
  }
  // Set the Cookie Expiry Date
  req.session.cookie.expires = new Date(Date.now() + 1000 * 60 * 60 * 365);
  // Send Success Message to the Client
  res.send({ status: "success", content: "session saved" });
  return;
});

// @route     Get /session/unsave
// @desc      Make the session impersistent
// @access    Public
router.get("/session/unsave", async (req, res) => {
  // Check if the user is logged in
  if (req.isAuthenticated()) {
    return res.send({ status: "success", content: "a user is logged in" });
  }
  // Retrieve Session ID
  const sessionId = req.sessionID;
  // Set Session Status
  let session;
  try {
    session = await Session.findOne({ sessionId });
  } catch (error) {
    res.send({ status: "failed", content: error });
    return;
  }
  session.status = "impersistent";
  // Save update
  try {
    await session.save();
  } catch (error) {
    res.send({ status: "failed", content: error });
    return;
  }
  // Set the Cookie Expiry Date
  req.session.cookie.expires = false;
  // Send Success Message to the Client
  res.send({ status: "success", content: "session unsaved" });
  return;
});

// @route     Get /session/status
// @desc      Check the persistence of the session
// @access    Public
router.get("/session/status", async (req, res) => {
  // Check if the user is logged in
  if (req.isAuthenticated()) {
    return res.send({ status: "success", content: "a user is logged in" });
  }
  // Retrieve Session ID
  const sessionId = req.sessionID;
  // Set Session Status
  let session;
  try {
    session = await Session.findOne({ sessionId });
  } catch (error) {
    res.send({ status: "failed", content: error });
    return;
  }
  // If status is persistent reset expiry
  if (session.status === "persistent") {
    // Set the Cookie Expiry Date
    req.session.cookie.expires = new Date(Date.now() + 1000 * 60 * 60 * 365);
  }
  // Send Success Message to the Client
  res.send({ status: "success", content: session.status });
  return;
});

/*=========================================================================================
EXPORT ROUTE
=========================================================================================*/

module.exports = router;

/*=========================================================================================
END
=========================================================================================*/
