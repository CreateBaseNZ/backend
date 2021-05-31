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

/*=========================================================================================
ROUTES
=========================================================================================*/

// @route   POST /alpha/feedback/version-1/submit
// @desc
// @access  PUBLIC
router.post("/alpha/feedback/version-1/submit", async (req, res) => {
  // Declare variables
  const title = "Alpha Testing Version 2";
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

/*=========================================================================================
EXPORT ROUTE
=========================================================================================*/

module.exports = router;

/*=========================================================================================
END
=========================================================================================*/
