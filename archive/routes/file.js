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

/*=========================================================================================
MIDDLEWARE
=========================================================================================*/

const upload = require("../configs/upload.js");

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
    useUnifiedTopology: true,
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
    res.setHeader("content-type", "application/octet-stream");
    readstream.pipe(res);
  });
});

router.get("/files/retrieve/:fileId/:filename", (req, res) => {
  const id = mongoose.Types.ObjectId(req.params.fileId);
  const filename = req.params.filename;
  GridFS.files.findOne({ _id: id, filename }, (err, file) => {
    if (!file || file.length == 0) {
      return res.status(404).json({ error: "No file exists" });
    }
    const readstream = GridFS.createReadStream(file.filename);
    res.setHeader("content-type", "application/vnd.ms-pki.stl");
    res.setHeader("content-length", file.length);
    res.setHeader("accept-ranges", "bytes");
    res.setHeader("cache-control", "public, max-age=0");
    res.removeHeader("transfer-encoding");
    res.removeHeader("connection");
    return readstream.pipe(res);
  });
});

router.get("/files/stl/fetch/:fileId", async (req, res) => {
  // DECLARE AND INITIALISE VARIABLES
  const fileId = mongoose.Types.ObjectId(req.params.fileId);
  // FETCH STL FILE
  try {
    file = await GridFS.files.findOne({ _id: fileId });
  } catch (error) {
    return res.send({ status: "error", content: error });
  }
  if (!file) {
    // TO DO .....
    // fetch a placeholder stl file
    // TO DO .....
  }
  // SETUP THE RESPONSE HEADER
  res.setHeader("content-type", "application/vnd.ms-pki.stl");
  res.setHeader("content-length", file.length);
  res.setHeader("accept-ranges", "bytes");
  res.setHeader("cache-control", "public, max-age=0");
  res.removeHeader("transfer-encoding");
  res.removeHeader("connection");
  // SUCCESS HANDLER
  const readstream = GridFS.createReadStream(file.filename);
  return readstream.pipe(res);
});

router.get("/files/delete/:fileId", (req, res) => {
  GridFS.remove({ _id: req.params.fileId, root: "fs" }, (err, gridStore) => {
    if (err) {
      return res.status(404).json({ err: err });
    }

    res.send("Deleted");
  });
});

// @route     Get /files/image/:filename
// @desc      Fetch image to be displayed
// @access    Public
router.get("/files/image/:filename", async (req, res) => {
  // Declare Variables
  const filename = req.params.filename;
  // Find the image
  let image = undefined;
  // If so, Send File to Front-End
  try {
    image = await GridFS.files.findOne({ filename });
  } catch (error) {
    return res.send({ status: "failed", content: error });
  }
  if (image) {
    let readstream = GridFS.createReadStream(image.filename);
    return readstream.pipe(res);
  }
  // Else, Return Temporary Profile Picture
  try {
    file = await GridFS.files.findOne({ filename: "default-profile.png" });
  } catch (error) {
    return res.send({ status: "failed", content: error });
  }
  let readstream = GridFS.createReadStream(file.filename);
  return readstream.pipe(res);
});

// @route     Get /public-image/:filename
// @desc      Fetch image to be displayed
// @access    Public
router.get("/public-image/:filename", async (req, res) => {
  // Declare Variables
  const filename = req.params.filename;
  // Find the image
  let image = undefined;
  // If so, Send File to Front-End
  try {
    image = await GridFS.files.findOne({ filename });
  } catch (error) {
    return res.send({ status: "failed", content: error });
  }
  if (image) {
    let readstream = GridFS.createReadStream(image.filename);
    return readstream.pipe(res);
  }
});

/*=========================================================================================
EXPORT ROUTE
=========================================================================================*/

module.exports = router;

/*=========================================================================================
END
=========================================================================================*/
