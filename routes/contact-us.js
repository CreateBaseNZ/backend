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

const Message = require("../model/Message.js");

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
    return res.sendFile("login.html", customerRouteOptions);
  }
};

const verifiedDataAccess = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.verification.status) {
      return next();
    } else {
      return res.send({ status: "failed", content: "Account needs to be verified" });
    }
  } else {
    return res.redirect("/login");
  }
};

const restrictedAccess = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return res.sendFile("login.html", customerRouteOptions);
  }
};

const unrestrictedAccess = (req, res, next) => {
  if (req.isAuthenticated()) {
    // TO DO .....
    // REDIRECT TO "ALREADY LOGGED IN" PAGE
    // TO DO .....
    return res.redirect("/"); // TEMPORARILY SEND THEM BACK HOME
  } else {
    return next();
  }
};

/*=========================================================================================
ROUTES
=========================================================================================*/

// @route   POST /contact-us/submit-inquiry
// @desc    
// @access  PUBLIC
router.post("/contact-us/submit-inquiry", async (req, res) => {
  // DECLARE AND INITIALISE VARIABLES
  const accountId = req.isAuthenticated() ? req.user._id : undefined;
  const sessionId = req.sessionID;
  // CREATE THE INQUIRY
  // inquiry number
  let inquiries;
  try {
    inquiries = await Message.find({ type: "inquiry" });
  } catch (error) {
    return res.send({ status: "error", content: error });
  }
  const number = { inquiry: (inquiries.length + 1) };
  const inquiry = {
    accountId, sessionId, type: "inquiry", name: req.body.name, email: req.body.email,
    subject: req.body.subject, message: req.body.message, number
  };
  // CREATE THE MESSAGE
  let message;
  try {
    message = await Message.build(inquiry);
  } catch (data) {
    return res.send(data);
  }
  // SUCCESS HANDLER
  return res.send({ status: "succeeded", content: "Inquiry has been sent" });
});

/*=========================================================================================
EXPORT ROUTE
=========================================================================================*/

module.exports = router;

/*=========================================================================================
END
=========================================================================================*/
