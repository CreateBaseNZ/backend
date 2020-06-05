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

const Make = require("../../model/Make.js");
const Comment = require("../../model/Comment.js");

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

router.post("/make/submit", upload.single("file"), verifiedAccess, async (req, res) => {
  const accountId = mongoose.Types.ObjectId(req.user._id);
  const file = {
    id: mongoose.Types.ObjectId(req.file.id),
    name: req.file.filename,
  };
  const build = req.body.build;
  const quick = req.body.quick;
  const process = req.body.material.split("-")[0];
  const material = req.body.material.split("-")[1];
  const quality = req.body.quality;
  const strength = req.body.strength;
  const colour = req.body.colour;
  const quantity = req.body.quantity;
  const message = req.body.note;

  // Create a make object
  let make = new Make({
    accountId,
    file,
    build,
    quick,
    process,
    material,
    quality,
    strength,
    colour,
    quantity,
  });

  // Set status
  make.updateStatus("awaitingQuote");
  // Create a comment
  if (message) {
    let comment = new Comment({
      accountId,
      message,
    });

    try {
      await comment.setDate();
    } catch (error) {
      return res.send({ status: "failed", data: error });
    }

    let savedComment;

    try {
      savedComment = await comment.save();
    } catch (error) {
      return res.send({ status: "failed", data: error });
    }

    make.comment = mongoose.Types.ObjectId(savedComment._id);
  }
  // Save make
  let savedMake;

  try {
    savedMake = await make.save();
  } catch (error) {
    return res.send({ status: "failed", data: error });
  }

  return res.send({ status: "success", data: savedMake });
}
);

router.get("/profile/customer/fetch/makes", verifiedAccess, async (req, res) => {
  // INITIALISE AND DECLARE VARIABLES
  const account = req.user._id;
  // VALIDATE REQUIRED VARIABLES
  if (!account) {
    res.send({ status: "failed", content: "invalid user ID" });
    return;
  }
  // RETRIEVE ALL MAKES
  let makes;
  try {
    makes = await Make.retrieve(account);
  } catch (error) {
    res.send({ status: "failed", content: error });
    return;
  }
  // RETURN ALL MAKES TO CLIENT
  res.send({ status: "success", content: makes });
  return;
})

/*=========================================================================================
EXPORT ROUTE
=========================================================================================*/

module.exports = router;

/*=========================================================================================
END
=========================================================================================*/
