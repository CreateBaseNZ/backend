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

/*=========================================================================================
EXPORT ROUTE
=========================================================================================*/

module.exports = router;

/*=========================================================================================
END
=========================================================================================*/
