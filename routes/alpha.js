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

const Feedback = require("../model/Feedback.js");
const Message = require("../model/Message.js");
const Cookie = require("../model/Cookie.js");
const UserSession = require("../model/UserSession.js");
const Behaviour = require("../model/Behaviour.js");

/*=========================================================================================
ROUTES
=========================================================================================*/

// @route   POST /alpha/user-session/create
// @desc
// @access  PUBLIC
router.post("/alpha/user-session/create", async (req, res) => {
  // Declare variables
  const object = req.body.object;
  // Create the session
  try {
    await UserSession.build(object);
  } catch (data) {
    return res.send(data);
  }
  // Success handler
  return res.send({
    status: "succeeded",
    content: "A user session has been created successfully.",
  });
});

// @route   POST /alpha/behaviour/add
// @desc
// @access  PUBLIC
router.post("/alpha/behaviour/add", async (req, res) => {
  // Declare variables
  const session = req.body.session;
  let object = req.body.object;
  // Fetch the user session
  let userSession;
  try {
    userSession = await UserSession.findOne(session);
  } catch (error) {
    return res.send({ status: "error", content: error });
  }
  // Validate the user session
  if (!userSession) {
    try {
      userSession = await UserSession.build(session);
    } catch (data) {
      return res.send(data);
    }
  }
  object.sessionId = userSession.sessionId;
  // Create the behaviour instance
  let behaviour;
  try {
    behaviour = await Behaviour.build(object);
  } catch (data) {
    return res.send(data);
  }
  // Add the behaviour to the user session
  userSession.behaviours.push(behaviour._id);
  // Save the updates session
  try {
    await userSession.save();
  } catch (error) {
    return res.send({ status: "error", content: error });
  }
  // Success handler
  return res.send({ status: "succeeded", content: { userSession, behaviour } });
});

// @route   POST /alpha/user-session/update-saves
// @desc
// @access  PUBLIC
router.post("/alpha/user-session/update-saves", async (req, res) => {});

// @route   POST /alpha/feedback/version-2/submit
// @desc
// @access  PUBLIC
router.post("/alpha/feedback/version-2/submit", async (req, res) => {
  // Declare variables
  const title = "Testing Platform Version 2 Feedback Version 2";
  const items = req.body.items;
  const object = { title, items };
  // Build feedback
  let feedback;
  try {
    feedback = await Feedback.build(object);
  } catch (data) {
    return res.send(data);
  }
  // Success handler
  return res.send({ status: "succeeded", content: feedback });
});

// @route   POST /alpha/message/submit
// @desc
// @access  PUBLIC
router.post("/alpha/message/submit", async (req, res) => {
  // Declare variables
  let object = new Object(req.body);
  object.type = "alpha";
  // Build message
  let message;
  try {
    message = await Message.build(object);
  } catch (data) {
    return res.send(data);
  }
  // Success handler
  return res.send({ status: "succeeded", content: message });
});

// @route   POST /alpha/feedback/test/submit
// @desc
// @access  PUBLIC
router.post("/alpha/feedback/test/submit", async (req, res) => {
  // Declare variables
  const title = "Test Feedback Submission";
  const items = req.body.items;
  const object = { title, items };
  // Build feedback
  let feedback;
  try {
    feedback = await Feedback.build(object);
  } catch (data) {
    return res.send(data);
  }
  // Success handler
  return res.send({ status: "succeeded", content: feedback });
});

router.post("/alpha/cookie-save", async (req, res) => {
  // Declare variables
  const id = req.body.id;
  const type = req.body.type;
  const date = req.body.date;
  const behaviours = req.body.behaviours;
  // Fetch cookie
  let cookie;
  try {
    cookie = await Cookie.findOne({ id });
  } catch (error) {
    return res.send({ status: "error", content: error });
  }
  // Check: If cookie exist, update
  if (cookie) {
    cookie.behaviours = behaviours;
    try {
      await cookie.save();
    } catch (error) {
      return res.send({ status: "error", content: error });
    }
  }
  // Check: If cookie does not exist, create
  if (!cookie) {
    try {
      cookie = await Cookie.build({ id, type, date, behaviours });
    } catch (data) {
      return res.send(data);
    }
  }
  // Success handler
  return res.send({ status: "succeeded", content: cookie });
});

/*=========================================================================================
EXPORT ROUTE
=========================================================================================*/

module.exports = router;

/*=========================================================================================
END
=========================================================================================*/
