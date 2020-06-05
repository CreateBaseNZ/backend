/*=========================================================================================
REQUIRED MODULES
=========================================================================================*/

const express = require("express");
const passport = require("passport");

/*=========================================================================================
VARIABLES
=========================================================================================*/

const router = new express.Router();

/*=========================================================================================
MODELS
=========================================================================================*/

const Session = require("../../model/Session.js");
const Account = require("../../model/Account.js");

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

// @route     Get /signup/customer
// @desc      Signup a New Customer Account
// @access    Public
router.post("/signup/customer", passport.authenticate("local-customer-signup", {
  successRedirect: "/",
  failureRedirect: "/signup",
}));

// @route     Get /login/customer
// @desc      Login Request
// @access    Public
router.post("/login/customer", passport.authenticate("local-customer-login", {
  successRedirect: "/",
  failureRedirect: "/login",
}));

// @route     Get /logout
// @desc      Logout the user
// @access    Public
router.get("/logout", async (req, res) => {
  // Create a session
  // Retrieve Session ID
  const sessionId = req.sessionID;
  // Create Session
  let content;
  try {
    content = await Session.create(sessionId);
  } catch (error) {
    return res.send({ status: "failed", content: error });
  }
  // Logout User
  req.logout();
  // Redirect User to the Home Page
  return res.redirect("/");
});

// @route     Get /login-status
// @desc      Get the Login Status
// @access    Public
router.get("/login-status", (req, res) => {
  if (req.isAuthenticated()) return res.send({ status: true });
  res.send({ status: false });
});

// @route     Get /account-verification/:email/:code
// @desc      Verify the account for a given email
// @access    Public
router.get("/account-verification/:email/:code", async (req, res) => {
  // DECLARE AND INITIALISE VARIABLES
  const email = req.params.email;
  const code = req.params.code;
  // VERIFY ACCOUNT
  try {
    await Account.verify(email, code);
  } catch (error) {
    // TO DO.....
    // REDIRECT TO A FAILED PAGE
    // TO DO.....
    return res.redirect("/login");
  }
  return res.redirect("/verified");
});

// @route     Get /account/email-verification
// @desc      Send the verification email
// @access    Public
router.get("/account/email-verification", async (req, res) => {
  // DECLARE AND INITIALISE VARIABLES
  const email = req.user.email;
  // VALIDATE USER VERIFICATION
  const verification = req.user.verification.status;
  if (verification) return res.redirect("/verified");
  // SEND VEIFICATION
  try {
    await Account.verification(email);
  } catch (error) {
    return res.send({ status: "failed", content: error });
  }
  // SUCCESS RESPONSE
  return res.send({ status: "success", content: "success" });
});

// @route     Get /account/verify
// @desc      Verify the account
// @access    Public
router.post("/account/verify", async (req, res) => {
  // DECLARE AND INITIALISE VARIABLES
  let email;
  const code = req.body.code;
  if (req.user) {
    email = req.user.email;
  } else {
    email = req.body.email;
  }
  if (!email) return res.send({ status: "failed", content: "no email" });
  // VALIDATE USER VERIFICATION
  const verification = req.user.verification.status;
  if (verification) return res.redirect("/verified");
  // VERIFY ACCOUNT
  try {
    await Account.verify(email, code);
  } catch (error) {
    // TO DO.....
    // REDIRECT TO A FAILED PAGE
    // TO DO.....
    return res.send({ status: "failed", content: error });
  }
  return res.redirect("/verified");
});

// @route     POST /account/login/validate
// @desc      Validate the login inputs
// @access    Public
router.post("/account/login/validate", async (req, res) => {
  // DECLARE AND INITIALISE VARIABLES
  const inputs = req.body.inputs;
  // VALIDATION
  let validation = {
    email: { valid: undefined, message: undefined },
    password: { valid: undefined, message: undefined }
  };
  // Email
  let account = undefined;
  if (inputs.email) {
    try {
      account = await Account.fineOne({ email: inputs.email });
    } catch (error) {
      return res.send({ status: "failed", content: error });
    }
    if (!account) {
      validation.email.valid = false;
      validation.email.message = "unregistered email";
    } else {
      validation.email.valid = true;
      validation.email.message = "registered email";
    }
  }
  // Password
  if (inputs.password) {
    if (!account) {
      validation.password.valid = false;
      validation.password.message = "registered email required";
    } else {
      let message;
      try {
        message = await account.validatePassword(inputs.password);
      } catch (error) {
        return res.send({ status: "failed", content: error });
      }
      validation.password.message = message;
      if (message === "incorrect password") {
        validation.password.valid = false;
      } else if (message === "password match") {
        validation.password.valid = true;
      }
    }
  }
  // Return Validation Outcome to Client
  return res.send({ status: "success", content: validation });
});

// @route     POST /account/signup/validate
// @desc      Validate the signup inputs
// @access    Public
router.post("/account/signup/validate", async (req, res) => { });

/*=========================================================================================
EXPORT ROUTE
=========================================================================================*/

module.exports = router;

/*=========================================================================================
END
=========================================================================================*/
