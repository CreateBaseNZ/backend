/*=========================================================================================
REQUIRED MODULES
=========================================================================================*/

const express = require("express");
const mongoose = require("mongoose");

/*=========================================================================================
VARIABLES
=========================================================================================*/

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const router = new express.Router();

/*=========================================================================================
MODELS
=========================================================================================*/

const Make = require("../../model/Make.js");
const Account = require("../../model/Account.js");
const Comment = require("../../model/Comment.js");

/*=========================================================================================
MIDDLEWARE
=========================================================================================*/

const adminAccess = (req, res, next) => {
  if (req.isAuthenticated() && req.user.type === "admin") {
    return next();
  } else {
    res.redirect("/");
  }
};

/*=========================================================================================
ROUTES
=========================================================================================*/

router.get("/admin/make/fetch", adminAccess, async (req, res) => {
  // Pre Validation
  const userId = req.user._id;
  let valid;
  try {
    valid = await validateAdminAccess(userId);
  } catch (error) {
    res.send({ status: "failed", content: error });
    return;
  }
  if (!valid) {
    res.send({ status: "failed", content: "invalid access" });
    return;
  }
  // Get all makes
  let makes;
  try {
    makes = await Make.find();
  } catch (error) {
    res.send({ status: "failed", content: error });
    return;
  }
  res.send({ status: "success", content: makes });
  return;
});

router.post("/admin/make/update/price", adminAccess, async (req, res) => {
  // Declare variables
  const makeId = mongoose.Types.ObjectId(req.body.id);
  const price = req.body.price;
  // Fetch the make
  let make;
  try {
    make = await Make.findById(makeId);
  } catch (error) {
    res.send({ status: "failed", content: error });
    return;
  }
  // Update make
  make.price = price;
  make.updateStatus("checkout");
  // Save make
  try {
    await make.save();
  } catch (error) {
    res.send({ status: "failed", content: error });
    return;
  }
  res.send({ status: "success", content: "price updated" });
  return;
});

router.get("/admin/comment/fetch/:commentId", adminAccess, async (req, res) => {
  const commentId = mongoose.Types.ObjectId(req.params.commentId);
  let comment;
  try {
    comment = await Comment.findById(commentId);
  } catch (error) {
    res.send({ status: "failed", content: error });
    return;
  }
  res.send({ status: "success", content: comment });
  return;
});

/*=========================================================================================
FUNCTIONS
=========================================================================================*/

const validateAdminAccess = (adminId) => {
  return new Promise(async (resolve, reject) => {
    let admin;
    try {
      admin = await Account.findById(adminId);
    } catch (error) {
      reject(error);
      return;
    }
    let valid;
    if (admin.type === "admin") {
      valid = true;
    } else {
      valid = false;
    }
    resolve(valid);
    return;
  });
};

/*=========================================================================================
EXPORT ROUTE
=========================================================================================*/

module.exports = router;

/*=========================================================================================
END
=========================================================================================*/
