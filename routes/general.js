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

const Mail = require("./../model/Mail.js");
const Account = require("./../model/Account.js");
const Customer = require("./../model/Customer.js");

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
  res.sendFile("home.html", customerRouteOptions);
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

// @route     Get /story
// @desc      Our story Page
// @access    Public
router.get("/story", (req, res) => {
  res.sendFile("story.html", customerRouteOptions);
});

// @route     Get /team
// @desc      Our team Page
// @access    Public
router.get("/team", (req, res) => {
  res.sendFile("team.html", customerRouteOptions);
});

// @route     Get /products/engkits
// @desc      Engineering Kits Info Page
// @access    Public
router.get("/products/engkits", (req, res) => {
  res.sendFile("engkits.html", customerRouteOptions);
});

// @route     Get /services/3d-printing
// @desc      3D Printing Info Page
// @access    Public
router.get("/services/3d-printing", (req, res) => {
  res.sendFile("printing.html", customerRouteOptions);
});

// @route     Get /services/marketplace
// @desc      Marketplace Info Page
// @access    Public
router.get("/services/marketplace", (req, res) => {
  res.sendFile("market.html", customerRouteOptions);
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
// @access    Private
router.get("/3d-printing", restrictedPages, (req, res) => {
  res.sendFile("make.html", customerRouteOptions);
});

// @route     Get /checkout
// @desc      Get the Make Page
// @access    Private
router.get("/checkout", restrictedPages, (req, res) => {
  res.sendFile("checkout.html", customerRouteOptions);
});

// @route     Get /profile/projects
// @desc
// @access    Private
router.get("/profile/projects", restrictedPages, (req, res) => {
  res.sendFile("projects.html", customerRouteOptions);
});

// @route     Get /profile/settings
// @desc
// @access    Private
router.get("/profile/settings", restrictedPages, (req, res) => {
  res.sendFile("settings.html", customerRouteOptions);
});

// @route     Get /profile/billing
// @desc
// @access    Private
router.get("/profile/billing", restrictedPages, (req, res) => {
  res.sendFile("billing.html", customerRouteOptions);
});

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
      email
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
      mail: true
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
    email
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
  // Initialise Email Variable
  // Check if Email Exist in the Mailing List
  // Check if User is Registered
  // If Registered Update Subscription
  // Remove Email from the Mailing List
});

// @route     Get /login-status
// @desc      Get the Login Status
// @access    Public
router.get("/login-status", (req, res) => {
  if (req.isAuthenticated()) return res.send({ status: true });

  res.send({ status: false });
});

/*=========================================================================================
EXPORT ROUTE
=========================================================================================*/

module.exports = router;

/*=========================================================================================
END
=========================================================================================*/
