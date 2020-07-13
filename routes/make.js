/*=========================================================================================
REQUIRED MODULES
=========================================================================================*/

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const mongoose = require("mongoose");

/*=========================================================================================
VARIABLES
=========================================================================================*/

const router = new express.Router();

/*=========================================================================================
MODELS
=========================================================================================*/

const Make = require("../model/Make.js");
const Comment = require("../model/Comment.js");

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

const upload = require("../config/upload.js");

/*=========================================================================================
ROUTES
=========================================================================================*/

// @route   POST /make/build/new-model
// @desc    
// @access  PUBLIC
router.post("/make/build/new-model", upload.single("file"), async (req, res) => {
  // DECLARE AND INITIALISE VARIABLES
  let accountId = undefined;
  let sessionId = req.sessionID;
  if (req.isAuthenticated()) {
    accountId = req.user._id;
    sessionId = undefined;
  }
  const message = req.body.note;
  const file = { id: req.file.id, name: req.file.filename };
  const status = "awaitingQuote";
  const build = req.body.build;
  const quick = req.body.quick;
  const process = req.body.material.split("-")[0];
  const material = req.body.material.split("-")[1];
  const quality = req.body.quality;
  const strength = req.body.strength;
  const colour = req.body.colour;
  const quantity = { ordered: req.body.quantity };
  // CREATE THE COMMENT OBJECT
  let promises = [];
  let commentId = undefined;
  if (message) {
    const commentObject = {
      accountId, sessionId,
      message: `For ${req.file.filename}: ${message}`
    };
    let comment;
    try {
      comment = await Comment.build(commentObject, false);
    } catch (data) {
      return res.send(data);
    }
    commentId = comment._id
    promises.push(comment.save());
  }
  // CREATE THE MAKE OBJECT
  let make = ({
    accountId, sessionId, file, status, build, quick, process,
    material, quality, strength, colour, quantity, comment: commentId
  });
  try {
    make = await Make.build(make, false);
  } catch (data) {
    return res.send(data);
  }
  promises.push(make.save());
  // SAVE COMMENT AND MAKE
  try {
    await Promise.all(promises);
  } catch (error) {
    return res.send({ status: "error", content: error });
  }
  // SUCCESS HANDLER
  return res.send({ status: "succeeded", content: "created a make successfully" });
});

router.get("/profile/customer/fetch/makes", verifiedContent, async (req, res) => {
  // INITIALISE AND DECLARE VARIABLES
  const account = req.user;
  // RETRIEVE ALL MAKES
  let makes;
  try {
    makes = await Make.fetch({ accountId: account._id });
  } catch (error) {
    res.send({ status: "failed", content: error });
    return;
  }
  // RETURN ALL MAKES TO CLIENT
  res.send({ status: "succeeded", content: makes });
  return;
})

/*=========================================================================================
EXPORT ROUTE
=========================================================================================*/

module.exports = router;

/*=========================================================================================
END
=========================================================================================*/
