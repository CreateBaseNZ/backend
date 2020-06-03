/*=========================================================================================
REQUIRED MODULES
=========================================================================================*/

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const path = require("path");
const inlineCSS = require("inline-css");

/*=========================================================================================
VARIABLES
=========================================================================================*/

const router = new express.Router();
const customerRouteOptions = {
  root: path.join(__dirname, "../../views/public"),
};

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

// @route     Get /verfication
// @desc      Verification of account page
// @access    Public
router.get("/verification", (req, res) => {
  // VALIDATE USER VERIFICATION
  if (req.isAuthenticated()) {
    if (req.user.verification.status) {
      return res.redirect("/verified");
    }
  }
  res.sendFile("verification.html", customerRouteOptions);
});

// @route     Get /verified
// @desc      Verification confirmation page
// @access    Public
router.get("/verified", (req, res) => {
  res.sendFile("verified.html", customerRouteOptions);
});

// @route     Get /3d-printing
// @desc      Get the Make Page
// @access    Private
router.get("/3d-printing", verifiedAccess, (req, res) => {
  res.sendFile("make.html", customerRouteOptions);
});

// @route     Get /checkout
// @desc      Get the Make Page
// @access    Private
router.get("/checkout", verifiedAccess, (req, res) => {
  res.sendFile("checkout.html", customerRouteOptions);
});

// @route     Get /profile
// @desc
// @access    Private
router.get("/profile", verifiedAccess, (req, res) => {
  res.sendFile("profile.html", customerRouteOptions);
});



/*=========================================================================================
DEVELOPMENT
=========================================================================================*/

// @route     Get /test
// @desc
// @access    Private
router.get("/test", (req, res) => {
  res.sendFile("test.html", customerRouteOptions);
});

/*=========================================================================================
EXPORT ROUTE
=========================================================================================*/

module.exports = router;

/*=========================================================================================
END
=========================================================================================*/
