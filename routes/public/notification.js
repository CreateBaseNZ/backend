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

const restrictedPages = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/login");
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
    return res.send({ status: "failed", data: error });
  }
  if (mail) {
    return res.send({ status: "success", data: "already subscribed" });
  }
  // Check if the user is registered
  let account;
  try {
    account = await Account.findByEmail(email);
  } catch (error) {
    return res.send({ status: "failed", data: error });
  }
  if (account) {
    const newMail = new Mail({
      accountId: account._id,
      email,
    });

    try {
      await newMail.save();
    } catch (error) {
      return res.send({ status: "failed", data: error });
    }

    // Update user subscription mailing status
    let customer;
    try {
      customer = await Customer.findByAccountId(account._id);
    } catch (error) {
      return res.send({ status: "failed", data: error });
    }

    customer.subscription = {
      mail: true,
    };

    try {
      await customer.save();
    } catch (error) {
      return res.send({ status: "failed", data: error });
    }

    return res.send({ status: "success", data: "subscribed" });
  }
  // If user is not registered and not subscribed
  const newMail = new Mail({
    email,
  });

  try {
    await newMail.save();
  } catch (error) {
    return res.send({ status: "failed", data: error });
  }

  return res.send({ status: "success", data: "subscribed" });
});

// @route     POST /unsubscribe/mailing-list
// @desc      Unsubscribing from mailing list
// @access    Public
router.post("/unsubscribe/mailing-list", async (req, res) => {
  // Declare Email Variable
  // Check if Email Exist in the Mailing List
  // Check if User is Registered
  // If Registered Update Subscription
  // Remove Email from the Mailing List
});

/*=========================================================================================
EXPORT ROUTE
=========================================================================================*/

module.exports = router;

/*=========================================================================================
END
=========================================================================================*/
