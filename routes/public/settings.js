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

const upload = require("../../config/upload.js");

/*=========================================================================================
ROUTES
=========================================================================================*/

// @route     POST /settings/change-email
// @desc      
// @access    
router.post("/settings/change-email", verifiedAccess, async (req, res) => {
  // DECLARE AND INITIALISE VARIABLES
  const accountId = req.user._id;
  const email = req.body;
  // CHECK IF EMAIL IS TAKEN, GET THE USER'S ACCOUNT AND DETAILS
  const promises1 = [Account.findOne({ email }), Account.findOne({ _id: accountId }), Customer.findOne({ accountId })];
  try {
    [account1, account2, customer] = await Promise.all(promises1);
  } catch (error) {
    return res.send({ status: "failed", content: error });
  }
  if (account1) return res.send({ status: "failed", content: "registered email" });
  // CHANGE EMAIL
  // Unsubscribe user
  try {
    await customer.unsubscribeMail();
  } catch (error) {
    return res.send({ status: "failed", content: error });
  }
  // Update user details
  account2.updateEmail(email);
  // SAVE UPDATES AND SEND EMAIL VERIFICATION
  const promises2 = [customer.save(), account2.save(), Account.verification(email)];
  try {
    await Promise.all(promises2);
  } catch (error) {
    return res.send({ status: "failed", content: error });
  }
  // RETURN SUCCESS
  return res.send({ status: "success", content: "email changed" });
});

// @route     POST /settings/change-password
// @desc      
// @access    
router.post("/settings/change-password", verifiedAccess, async (req, res) => {
  // DECLARE AND INITIALISE VARIABLES
  const accountId = req.user._id;
  const password = req.body;
  // GET THE USER'S ACCOUNT
  let account;
  try {
    account = await Account.findOne({ _id: accountId });
  } catch (error) {
    return res.send({ status: "failed", content: error });
  }
  // CHANGE THE PASSWORD
  account.password = password;
  // SAVE UPDATE
  try {
    await account.save();
  } catch (error) {
    return res.send({ status: "failed", content: error });
  }
  // RETURN SUCCESS
  return res.send({ status: "success", content: "password changed" });
});

/*=========================================================================================
EXPORT ROUTE
=========================================================================================*/

module.exports = router;

/*=========================================================================================
END
=========================================================================================*/
