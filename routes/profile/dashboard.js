/* ========================================================================================
REQUIRED MODULES
======================================================================================== */

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

const Project = require("../../model/Project.js");
const Make = require("../../model/Make.js");

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

const upload = require("../../config/upload.js");

/*=========================================================================================
GRIDFS
=========================================================================================*/

const gridFsStream = require("gridfs-stream");

let GridFS;

mongoose.createConnection(
  process.env.MONGODB_URL,
  { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
  (error, client) => {
    if (error) throw error;

    GridFS = gridFsStream(client.db, mongoose.mongo);
    GridFS.collection("fs");
  });

/*=========================================================================================
ROUTES
=========================================================================================*/

// @route   POST /profile/dashboard/save
// @desc    
// @access  VERIFIED - CONTENT
router.post("/profile/dashboard/save", upload.single("picture"), verifiedContent, async (req, res) => {
  // DECLARE AND INITIALISE VARIABLES
  const accountId = req.user._id;
  // BUILD UPDATE OBJECT
  let update = {};
  if (req.body.displayName) {
    update.displayName = req.body.displayName;
  }
  if (req.body.bio) {
    update.bio = req.body.bio;
  }
  if (req.file) {
    update.picture = req.file.id;
  }
  // UPDATE CUSTOMER DETAILS
  // fetch customer
  let customer;
  try {
    customer = await Customer.findOne({ accountId });
  } catch (error) {
    return res.send({ status: "error", content: error });
  }
  // delete current profile picture
  if (req.file) {
    if (customer.picture) {
      try {
        await GridFS.remove({ _id: customer.picture, root: "fs" });
      } catch (error) {
        return res.send({ status: "error", content: error });
      }
    }
  }
  // update details
  let updatedCustomer;
  try {
    updatedCustomer = await customer.update(update, true);
  } catch (error) {
    return res.send(error);
  }
  return res.send({ status: "succeeded", content: updatedCustomer });
});

/*=========================================================================================
EXPORT ROUTE
=========================================================================================*/

module.exports = router;

/*=========================================================================================
END
=========================================================================================*/
