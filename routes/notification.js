/*=========================================================================================
REQUIRED MODULES
=========================================================================================*/

const express = require("express");

/*=========================================================================================
VARIABLES
=========================================================================================*/

if (process.env.NODE_ENV !== "production") require("dotenv").config();
const router = new express.Router();
const email = require("../configs/email.js");

/*=========================================================================================
MODELS
=========================================================================================*/

const Account = require("../model/Account.js");
const Mail = require("../model/Mail.js");

/*=========================================================================================
ROUTES
=========================================================================================*/

// @route     POST /notification/subscribe-email
// @desc      
// @access    Public
router.post("/notification/subscribe-email", async (req, res) => {
  const email = req.body.email;
  // Check if the email is an existing account
  let account;
  try {
    account = await Account.findOne({ email });
  } catch (error) {
    return res.send({ status: "error", content: error });
  }
  let object;
  if (account) {
    object = { email, owner: account._id };
  } else {
    object = { email };
  }
  // CREATE MAIL
  let mail;
  try {
    mail = await Mail.subscribe(object);
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
