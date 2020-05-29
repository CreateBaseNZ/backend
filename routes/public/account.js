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

const restrictedAccess = (req, res, next) => {
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
    res.send({ status: "failed", content: error });
    return;
  }
  // Logout User
  req.logout();
  // Redirect User to the Home Page
  res.redirect("/");
});

// @route     Get /login-status
// @desc      Get the Login Status
// @access    Public
router.get("/login-status", (req, res) => {
  if (req.isAuthenticated()) return res.send({ status: true });
  res.send({ status: false });
});

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
  // TO DO.....
  // REDIRECT TO A SUCCESS PAGE
  // TO DO.....
  return res.redirect("/");
});

router.get("/account/email-verification", async (req, res) => {
  // DECLARE AND INITIALISE VARIABLES
  const email = req.user.email;
  // SEND VEIFICATION
  try {
    await Account.verification(email);
  } catch (error) {
    return res.send({ status: "failed", content: error });
  }
  // SUCCESS RESPONSE
  return res.send({ status: "success", content: "success" });
});

/*=========================================================================================
EXPORT ROUTE
=========================================================================================*/

module.exports = router;

/*=========================================================================================
END
=========================================================================================*/
