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
const customerRouteOptions = { root: path.join(__dirname, "../views") };

/*=========================================================================================
MODELS
=========================================================================================*/

const Account = require("../model/Account.js");
const Customer = require("../model/Customer.js");
const Make = require("../model/Make.js");

/*=========================================================================================
MIDDLEWARE
=========================================================================================*/

const verifiedAccess = (req, res, next) => {
  // IF USER IS NOT LOGGED IN
  if (!req.isAuthenticated()) {
    return res.sendFile("login.html", customerRouteOptions);
  }
  // IF USER IS NOT VERIFIED
  if (!req.user.verification.status) {
    return res.redirect("/verification");
  }
  // SUCCESS HANDLER
  return next();
};

const verifiedContent = (req, res, next) => {
  const account = req.user;
  // CHECK IF USER IS LOGGED IN
  if (!req.isAuthenticated()) {
    return res.send({ status: "failed", content: "user is not logged in" });
  }
  // CHECK IF USER IS NOT VERIFIED
  if (!account.verification.status) {
    return res.send({ status: "failed", content: "user is not verified" });
  }
  // SUCCESS HANDLER
  return next();
};

const restrictedAccess = (req, res, next) => {
  // IF USER IS NOT LOGGED IN
  if (!req.isAuthenticated()) {
    return res.sendFile("login.html", customerRouteOptions);
  }
  // SUCCESS HANDLER
  return next();
};

const restrictedContent = (req, res, next) => {
  const account = req.user;
  // CHECK IF USER IS LOGGED IN
  if (!req.isAuthenticated()) {
    return res.send({ status: "failed", content: "user is not logged in" });
  }
  // SUCCESS HANDLER
  return next();
};

const unrestrictedAccess = (req, res, next) => {
  if (req.isAuthenticated()) {
    // TO DO .....
    // REDIRECT TO ALREADY LOGGED IN PAGE
    // TO DO .....
    return res.redirect("/"); // TEMPORARILY SEND THEM BACK HOME
  } else {
    return next();
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
router.get("/login", unrestrictedAccess, (req, res) => {
  res.sendFile("login.html", customerRouteOptions);
});

// @route     Get /signup
// @desc      Signup Page
// @access    Public
router.get("/signup", unrestrictedAccess, (req, res) => {
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
router.get("/verification", restrictedAccess, (req, res) => {
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

// @route     Get /make
// @desc      Get the Make Page
// @access    Private
router.get("/make", verifiedAccess, (req, res) => {
  res.sendFile("make.html", customerRouteOptions);
});

// @route     Get /checkout
// @desc      Get the Make Page
// @access    Private
router.get("/checkout", verifiedAccess, (req, res) => {
  res.sendFile("checkout.html", customerRouteOptions);
});

// @route     Get /change-password
// @desc      Homepage
// @access    Public
router.get("/change-password", unrestrictedAccess, (req, res) => res.sendFile("change-password.html", customerRouteOptions));
router.get("/change-password/*", unrestrictedAccess, (req, res) => res.sendFile("change-password.html", customerRouteOptions));
router.get("/change-password/*/*", unrestrictedAccess, (req, res) => res.sendFile("change-password.html", customerRouteOptions));

// @route     GET /terms-and-conditions
// @desc      The Website's Terms and Conditions
// @access    PUBLIC
router.get("/terms-and-conditions", (req, res) => {
  res.sendFile("terms-and-conditions.html", customerRouteOptions);
});

// @route     GET /contact-us
// @desc      The Company's Contact Details
// @access    PUBLIC
router.get("/contact-us", (req, res) => {
  res.sendFile("contact-us.html", customerRouteOptions);
});

// @route     GET /faq
// @desc
// @access    PUBLIC
router.get("/faq", (req, res) => {
  res.sendFile("faq.html", customerRouteOptions);
});

// @route     GET /privacy-policy
// @desc
// @access    PUBLIC
router.get("/privacy-policy", (req, res) => {
  res.sendFile("privacy-policy.html", customerRouteOptions);
});

// @route     Get /test
// @desc      Homepage
// @access    Public
router.get("/test", (req, res) => {
  res.sendFile("test.html", customerRouteOptions);
});

// @route     Get /test
// @desc      Homepage
// @access    Public
router.post("/test", async (req, res) => {
  const account = req.user;
  const query = { accountId: account._id };
  let makes;
  try {
    makes = await Make.fetch(query, true);
  } catch (data) {
    return res.send(data);
  }
  return res.send({ status: "succeeded", content: makes });
});

/* ----------------------------------------------------------------------------------------
NAVIGATION
---------------------------------------------------------------------------------------- */

router.get("/navigation/fetch-user", restrictedContent, async (req, res) => {
  // DECLARE AND INITIALISE VARIABLES
  const account = req.user;
  // FETCH DETAILS
  let customer;
  try {
    customer = await Customer.findOne({ accountId: account._id });
  } catch (error) {
    return res.send({ status: "error", content: error });
  }
  if (!customer) return res.send({ status: "failed", content: "no user details found" });
  // SUCCESS HANDLER
  return res.send({ status: "succeeded", content: customer });
});

/*=========================================================================================
EXPORT ROUTE
=========================================================================================*/

module.exports = router;

/*=========================================================================================
END
=========================================================================================*/
