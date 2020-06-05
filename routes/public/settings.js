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
  const email = req.body;
  // CHECK IF EMAIL IS TAKEN
  let account;
  try {
    account = await Account.findOne({ email });
  } catch (error) {
    return res.send({ status: "failed", content: error });
  }
  if (account) return res.send({ status: "failed", content: "registered email" });
  // CHANGE EMAIL
  // TO DO .....
  // Unsubscribe user
  // Update user details
  // Send verification email
  // TO DO .....
  // RETURN SUCCESS
  return res.send({ status: "success", content: "email changed" });
});

/*=========================================================================================
EXPORT ROUTE
=========================================================================================*/

module.exports = router;

/*=========================================================================================
END
=========================================================================================*/
