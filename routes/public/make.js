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

const restrictedPages = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/login");
  }
};
const upload = require("../../config/upload.js");

/*=========================================================================================
ROUTES
=========================================================================================*/

router.post(
  "/make/submit",
  upload.single("file"),
  restrictedPages,
  async (req, res) => {
    const accountId = mongoose.Types.ObjectId(req.user._id);
    const file = {
      id: mongoose.Types.ObjectId(req.file.id),
      name: req.file.filename
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
      quantity
    });

    // Set status
    make.updateStatus("awaitingQuote");
    // Create a comment
    if (message) {
      let comment = new Comment({
        accountId,
        message
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

/*=========================================================================================
EXPORT ROUTE
=========================================================================================*/

module.exports = router;

/*=========================================================================================
END
=========================================================================================*/
