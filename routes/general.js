/*=========================================================================================
REQUIRED MODULES
=========================================================================================*/

const express = require("express");
const path = require("path");
const passport = require("passport");

/*=========================================================================================
VARIABLES
=========================================================================================*/

const router = new express.Router();
const customerRouteOptions = {
  root: path.join(__dirname, "../views/public")
};

/*=========================================================================================
MODELS
=========================================================================================*/

const Account = require("./../model/Account.js");

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

// @route     Get /
// @desc      Homepage
// @access    Public
router.get("/", (req, res) => {
  res.sendFile("homepage.html", customerRouteOptions);
});

// @route     Get /login
// @desc      Login Page
// @access    Public
router.get("/login", (req, res) => {
  res.sendFile("login.html", customerRouteOptions);
});

// @route     Get /signup
// @desc      Signup Page
// @access    Public
router.get("/signup", (req, res) => {
  res.sendFile("signup.html", customerRouteOptions);
});

// @route     Get /signup/customer
// @desc      Signup a New Customer Account
// @access    Public
router.post(
  "/signup/customer",
  passport.authenticate("local-customer-signup", {
    successRedirect: "/",
    failureRedirect: "/signup"
  })
);

// @route     Get /login/customer
// @desc      Login Request
// @access    Public
router.post(
  "/login/customer",
  passport.authenticate("local-customer-login", {
    successRedirect: "/",
    failureRedirect: "/login"
  })
);

// @route     Get /logout
// @desc      Logout the user
// @access    Public
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

// @route     Get /3d-printing
// @desc      Get the Make Page
// @access    Public
router.get("/3d-printing", restrictedPages, (req, res) => {
  res.sendFile("make.html", customerRouteOptions);
});

// @route     Get /login-status
// @desc      Get the Login Status
// @access    Public
router.get("/login-status", (req, res) => {
  if (req.isAuthenticated()) return res.send({ status: true });
});

/*=========================================================================================
EXPORT ROUTE
=========================================================================================*/

module.exports = router;

/*=========================================================================================
END
=========================================================================================*/
