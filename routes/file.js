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

/*-----------------------------------------------------------------------------------------
GENERAL
-----------------------------------------------------------------------------------------*/

router.get("/files/download/:fileId", (req, res) => {
  const id = mongoose.Types.ObjectId(req.params.fileId);
  GridFS.files.findOne({ _id: id }, (err, file) => {
    if (!file || file.length == 0) {
      return res.status(404).json({ error: "No file exists" });
    }
    const readstream = GridFS.createReadStream(file.filename);
    res.setHeader(
      "Content-disposition",
      "attachment; filename=" + file.filename
    );
    res.setHeader("Content-type", "application/octet-stream");
    readstream.pipe(res);
  });
});

router.get("/files/delete/:fileId", (req, res) => {
  GridFS.remove({ _id: req.params.fileId, root: "fs" }, (err, gridStore) => {
    if (err) {
      return res.status(404).json({ err: err });
    }

    res.send("Deleted");
  });
});

/*-----------------------------------------------------------------------------------------
MAKE
-----------------------------------------------------------------------------------------*/

// @route     Get /make/submit
// @desc      Customers create a new 3D Printing order
// @access    Private
router.post(
  "/make/submit",
  upload.single("model"),
  restrictedPages,
  async (req, res) => {
    // VALIDATION
    const accountId = mongoose.Types.ObjectId(req.user._id);
    const fileId = mongoose.Types.ObjectId(req.file.id);
    const status = "awaiting quote";
    const process = req.body.process;
    const material = req.body.material;
    const quality = req.body.quality;
    const strength = req.body.strength;
    const colour = req.body.colour;
    const quantity = req.body.quantity;
    const checkoutDate = req.body.date;
    const comment = {
      message: req.body.note,
      date: req.body.date
    };
    let newComment;
    let savedComment;
    let commentId;
    let comments = [];
    let newMake;
    let savedMake;
    let user;
    // OPERATIONS
    // CREATE IF NOTE OR ATTACHMENT(S) EXIST
    if (comment.message) {
      // Create the new comment object to be stored
      newComment = new Comment({
        accountId: accountId,
        message: comment.message,
        date: comment.date
      });
      // Save the comment to the database
      try {
        savedComment = await newComment.save();
      } catch (error) {
        throw error;
      }
      // Get the comment's id
      commentId = mongoose.Types.ObjectId(savedComment._id);
      // Add the comment id to the list of comment ids
      comments.push(commentId);
    }
    // CREATE THE MAKE
    // Create the new make object to be stored
    newMake = new Make({
      accountId: accountId,
      fileId: fileId,
      status: status,
      process: process,
      material: material,
      quality: quality,
      strength: strength,
      colour: colour,
      quantity: quantity,
      comments: comments,
      dates: {
        checkout: checkoutDate
      }
    });
    // Save the make to the database
    try {
      savedMake = await newMake.save();
    } catch (error) {
      throw error;
    }

    // Update the front-end
    res.send("Submitted");
  }
);

/*=========================================================================================
EXPORT ROUTE
=========================================================================================*/

module.exports = router;

/*=========================================================================================
END
=========================================================================================*/
