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
    customer: { address: undefined, subscription: undefined }
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
  // RETURN SUCCESS
  return res.send({ status: "success", content: details });
})

/*=========================================================================================
EXPORT ROUTE
=========================================================================================*/

module.exports = router;

/*=========================================================================================
END
=========================================================================================*/
