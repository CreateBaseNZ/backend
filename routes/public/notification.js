/*=========================================================================================
REQUIRED MODULES
=========================================================================================*/

const express = require("express");
const nodemailer = require("nodemailer");
const inlineCSS = require("inline-css");

/*=========================================================================================
VARIABLES
=========================================================================================*/

const router = new express.Router();

/*=========================================================================================
MODELS
=========================================================================================*/

const Mail = require("../../model/Mail.js");
const Account = require("../../model/Account.js");
const Customer = require("../../model/Customer.js");

/*=========================================================================================
MIDDLEWARE
=========================================================================================*/

const verifiedAccess = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.verification.status) {
      return next();
    } else {
      return res.redirect("/verification");
    }
  } else {
    return res.redirect("/login");
  }
};

const restrictedAccess = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return res.redirect("/login");
  }
};

/*=========================================================================================
ROUTES
=========================================================================================*/

// @route     POST /subscribe/mailing-list
// @desc      Subscribing to mailing list
// @access    Public
router.post("/subscribe/mailing-list", async (req, res) => {
  const email = req.body.email;
  // Check if the email is already in the mailing list
  let mail;
  try {
    mail = await Mail.findByEmail(email);
  } catch (error) {
    return res.send({ status: "failed", content: error });
  }
  if (mail) {
    return res.send({ status: "success", content: "already subscribed" });
  }
  // Check if the user is registered
  let account;
  try {
    account = await Account.findByEmail(email);
  } catch (error) {
    return res.send({ status: "failed", content: error });
  }
  if (account) {
    const newMail = new Mail({
      accountId: account._id,
      email,
    });

    try {
      await newMail.save();
    } catch (error) {
      return res.send({ status: "failed", content: error });
    }

    // Update user subscription mailing status
    let customer;
    try {
      customer = await Customer.findByAccountId(account._id);
    } catch (error) {
      return res.send({ status: "failed", content: error });
    }

    customer.subscription = {
      mail: true,
    };

    try {
      await customer.save();
    } catch (error) {
      return res.send({ status: "failed", content: error });
    }

    return res.send({ status: "success", content: "subscribed" });
  }
  // If user is not registered and not subscribed
  const newMail = new Mail({
    email,
  });

  try {
    await newMail.save();
  } catch (error) {
    return res.send({ status: "failed", content: error });
  }

  return res.send({ status: "success", content: "subscribed" });
});

// @route     POST /unsubscribe/mailing-list
// @desc      Unsubscribing from mailing list
// @access    Public
router.get("/unsubscribe/mailing-list/:email", async (req, res) => {
  // Declare Email Variable
  const email = req.params.email;
  // Check if Email Exist in the Mailing List
  let mail;
  try {
    mail = await Mail.findByEmail(email);
  } catch (error) {
    return res.send({ status: "failed", content: error });
  }
  // Check if User is Registered
  let account;
  try {
    account = await Account.findOne({ email });
  } catch (error) {
    return res.send({ status: "failed", content: error });
  }
  // If Registered Update Subscription
  if (account) {
  }
  // Remove Email from the Mailing List
  try {
    await Mail.deleteMail(email);
  } catch (error) {
    return res.send({ status: "failed", content: error });
  }
  // Send Success Status
  // res.send({ status: "success", content: "unsubscribed successfully" });
  res.redirect("/login");
});

// @route     POST /unsubscribe/mailing-list
// @desc      Unsubscribing from mailing list
// @access    Public
router.post("/unsubscribe/mailing-list", async (req, res) => {
  // Declare Email Variable
  const email = req.body.email;
  // Check if Email Exist in the Mailing List
  let mail;
  try {
    mail = await Mail.findByEmail(email);
  } catch (error) {
    return res.send({ status: "failed", content: error });
  }
  // Check if User is Registered
  let account;
  try {
    account = await Account.findOne({ email });
  } catch (error) {
    return res.send({ status: "failed", content: error });
  }
  // If Registered Update Subscription
  if (account) {
  }
  // Remove Email from the Mailing List
  try {
    await Mail.deleteMail(email);
  } catch (error) {
    return res.send({ status: "failed", content: error });
  }
  // Send Success Status
  res.send({ status: "success", content: "unsubscribed successfully" });
});

/*=========================================================================================
EXPORT ROUTE
=========================================================================================*/

module.exports = router;

/*=========================================================================================
END
=========================================================================================*/
