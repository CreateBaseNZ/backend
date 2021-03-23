/*=========================================================================================
REQUIRED MODULES
=========================================================================================*/

const express = require("express");

/*=========================================================================================
VARIABLES
=========================================================================================*/

if (process.env.NODE_ENV !== "production") require("dotenv").config();
const router = new express.Router();
const email = require("../config/email.js");

/*=========================================================================================
MODELS
=========================================================================================*/

const Mail = require("../model/Mail.js");

/*=========================================================================================
ROUTES
=========================================================================================*/

// @route     POST /notification/subscribe-email
// @desc      
// @access    Public
router.post("/notification/subscribe-email", async (req, res) => {
  const object = { email: req.body.email };
  // CREATE MAIL
  let mail;
  try {
    mail = await Mail.build(object);
  } catch (data) {
    return res.send(data);
  }
  // SEND SUCCESS
  return res.send({ status: "succeeded", content: "Subscription successful!" });
});

// @route     POST /notification/unsubscribe-email
// @desc      
// @access    Public
router.post("/notification/unsubscribe-email", async (req, res) => {
  const object = { email: req.body.email }
  // DELETE MAIL
  try {
    await Mail.demolish(object);
  } catch (data) {
    return res.send(data);
  }
  // SEND SUCCESS
  res.send({ status: "succeeded", content: "You are now unsubscribed!" });
});

/*=========================================================================================
EXPORT ROUTE
=========================================================================================*/

module.exports = router;

/*=========================================================================================
END
=========================================================================================*/
