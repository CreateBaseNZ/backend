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

const GridFS = require("./../model/Files.js");

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
ROUTES
=========================================================================================*/

router.post("/make/submit", upload.single("model"), (req, res) => {
  res.send("Submitted");
});

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
