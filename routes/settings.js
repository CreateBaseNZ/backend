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

const Account = require("../model/Account.js");
const Customer = require("../model/Customer.js");
const Transaction = require("../model/Transaction.js");

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

const upload = require("../config/upload.js");

/*=========================================================================================
ROUTES
=========================================================================================*/

// @route     POST /settings/change-email
// @desc      
// @access    
router.post("/settings/change-email", verifiedAccess, async (req, res) => {
  // DECLARE AND INITIALISE VARIABLES
  const accountId = req.user._id;
  const email = req.body.email;
  const password = req.body.password;
  // CHECK IF EMAIL IS TAKEN, GET THE USER'S ACCOUNT AND DETAILS
  const promises1 = [Account.findOne({ email }), Account.findOne({ _id: accountId }), Customer.findOne({ accountId })];
  try {
    [account1, account2, customer] = await Promise.all(promises1);
  } catch (error) {
    return res.send({ status: "failed", content: error });
  }
  // VALIDATE
  // Password Match
  let message;
  try {
    message = await account2.validatePassword(password);
  } catch (error) {
    return res.send({ status: "failed", content: error });
  }
  if (message === "incorrect password") return res.send({ status: "failed", content: message });
  // Email is Taken
  if (account1) return res.send({ status: "failed", content: "email is taken" });
  // CHANGE EMAIL
  // Unsubscribe user
  try {
    await customer.unsubscribeMail();
  } catch (error) {
    return res.send({ status: "failed", content: error });
  }
  // Update user details
  account2.updateEmail(email);
  // SAVE UPDATES
  const promises2 = [customer.save(), account2.save()];
  try {
    await Promise.all(promises2);
  } catch (error) {
    return res.send({ status: "failed", content: error });
  }
  // SEND EMAIL VERIFICATION
  try {
    await Account.verification(email);
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
  const newPassword = req.body.newPassword;
  const password = req.body.password;
  // GET THE USER'S ACCOUNT
  let account;
  try {
    account = await Account.findOne({ _id: accountId });
  } catch (error) {
    return res.send({ status: "failed", content: error });
  }
  // VALIDATE PASSWORD MATCH
  let message;
  try {
    message = await account.validatePassword(password);
  } catch (error) {
    return res.send({ status: "failed", content: error });
  }
  if (message === "incorrect password") return res.send({ status: "failed", content: message });
  // CHANGE THE PASSWORD
  account.password = newPassword;
  // SAVE UPDATE
  try {
    await account.save();
  } catch (error) {
    return res.send({ status: "failed", content: error });
  }
  // RETURN SUCCESS
  return res.send({ status: "success", content: "password changed" });
});

// @route     POST /settings/update
// @desc      
// @access    
router.post("/settings/update", verifiedAccess, async (req, res) => {
  // DECLARE AND INITIALISE VARIABLES
  const account = req.user;
  const updates = req.body;
  // GET USER DETAILS
  let customer;
  try {
    customer = await Customer.findOne({ accountId: account._id });
  } catch (error) {
    return res.send({ status: "failed", content: error });
  }
  // UPDATE
  // Subscription Mail
  if (updates.subscription.mail !== undefined) {
    if (customer.subscription.mail !== updates.subscription.mail) {
      if (updates.subscription.mail) {
        try {
          await customer.subscribeMail(account.email);
        } catch (error) {
          return res.send({ status: "failed", content: error });
        }
      } else {
        try {
          await customer.unsubscribeMail(account.email);
        } catch (error) {
          return res.send({ status: "failed", content: error });
        }
      }
    }
  }
  // Address
  if (updates.address !== undefined) {
    customer.address = updates.address;
  }
  // SAVE
  try {
    await customer.save();
  } catch (error) {
    return res.send({ status: "failed", content: error });
  }
  // RETURN SUCCESS
  return res.send({ status: "success", content: "update successful" });
});

// @route     GET /settings/fetch-customer-details
// @desc      
// @access    
router.get("/settings/fetch-customer-details", verifiedAccess, async (req, res) => {
  // DECLARE AND INITIALISE VARIABLES
  const account = req.user;
  let details = {
    account: { type: account.type, email: account.email, wallet: account.wallet },
    customer: { address: undefined, subscription: undefined },
    balance: undefined
  }
  // GET USER DETAILS
  let customer;
  try {
    customer = await Customer.findOne({ accountId: account._id });
  } catch (error) {
    return res.send({ status: "failed", content: error });
  }
  details.customer.address = customer.address;
  details.customer.subscription = customer.subscription;
  // GET BALANCE DETAILS
  let balance;
  try {
    balance = await Transaction.fetchBalance(account._id);
  } catch (error) {
    return res.send({ status: "failed", content: error });
  }
  details.balance = balance;
  // RETURN SUCCESS
  return res.send({ status: "success", content: details });
})

// @route     GET /settings/delete-account
// @desc      
// @access    
router.post("/settings/delete-account", verifiedAccess, async (req, res) => {
  // DECLARE AND INITIALISE VARIABLES
  const accountId = req.user._id;
  const password = req.body.password;
  // CHECK IF EMAIL IS TAKEN, GET THE USER'S ACCOUNT AND DETAILS
  let account;
  try {
    account = await Account.findOne({ _id: accountId });
  } catch (error) {
    return res.send({ status: "failed", content: error });
  }
  // VALIDATE
  // Password Match
  let message;
  try {
    message = await account.validatePassword(password);
  } catch (error) {
    return res.send({ status: "failed", content: error });
  }
  if (message === "incorrect password") return res.send({ status: "failed", content: message });
  // DELETE ACCOUNT
  try {
    await Account.deleteOne({ _id: accountId });
  } catch (error) {
    return res.send({ status: "failed", content: error });
  }
  // RETURN SUCCESS
  return res.send({ status: "success", content: "account deleted" });
})

/*=========================================================================================
EXPORT ROUTE
=========================================================================================*/

module.exports = router;

/*=========================================================================================
END
=========================================================================================*/
