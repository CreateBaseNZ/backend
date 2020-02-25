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

const Make = require("./../model/Make.js");
const Comment = require("./../model/Comment.js");

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
const upload = require("./../config/upload.js");

/*=========================================================================================
GRIDFS
=========================================================================================*/

const gridFsStream = require("gridfs-stream");

let GridFS;

mongoose.createConnection(
  process.env.MONGODB_URL,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  },
  (error, client) => {
    if (error) throw error;

    GridFS = gridFsStream(client.db, mongoose.mongo);
    GridFS.collection("fs");
  }
);

/*=========================================================================================
ROUTES
=========================================================================================*/

router.post(
  "/make/create",
  upload.single("model"),
  restrictedPages,
  async (req, res) => {
    const accountId = mongoose.Types.ObjectId(req.user._id);
    const fileId = mongoose.Types.ObjectId(req.file.id);
    const build = req.body.build;
    const process = req.body.process;
    const material = req.body.material;
    const quality = req.body.quality;
    const strength = req.body.strength;
    const colour = req.body.colour;
    const quantity = req.body.quantity;
    const message = req.body.note;

    // Create a make object
    let make = new Make({
      accountId,
      fileId,
      build,
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
