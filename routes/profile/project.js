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

router.post("/profile/customer/new/proj", upload.single("picture"), verifiedContent, async (req, res) => {
  console.log(req.file);
  // INITIALISE AND DECLARE VARIABLES
  const account = req.user._id;
  const name = req.body.name;
  let thumbnail;
  if (req.file) thumbnail = req.file.id;
  const bookmark = req.body.bookmark;
  let makes = [];
  if (req.body.makes) makes = req.body.makes;
  const notes = req.body.notes;
  const options = { name, bookmark, makes, thumbnail, notes };
  // VALIDATE REQUIRED VARIABLES
  if (!account) {
    res.send({ status: "failed", content: "invalid user ID" });
    return;
  }
  // CREATE THE PROJECT
  let message;
  try {
    message = await Project.create(account, options);
  } catch (error) {
    res.send({ status: "failed", content: error });
    return;
  }
  // RETURN SUCCESS MESSAGE TO CLIENT
  res.send({ status: "succeeded", content: message });
  return;
})

router.get("/profile/customer/fetch/all_proj", verifiedContent, async (req, res) => {
  console.log("fetch-projects");
  // INITIALISE AND DECLARE VARIABLES
  const account = req.user._id;
  // VALIDATE REQUIRED VARIABLES
  if (!account) {
    res.send({ status: "failed", content: "invalid user ID" });
    return;
  }
  // RETRIEVE ALL PROJECTS
  let projects;
  try {
    projects = await Project.retrieve(account);
  } catch (error) {
    res.send({ status: "failed", content: error });
    return;
  }
  // RETURN ALL PROJECTS TO CLIENT
  res.send({ status: "succeeded", content: projects });
  return;
})

router.post("/profile/customer/update/proj", upload.single("picture"), verifiedContent, async (req, res) => {
  console.log("update-project");
  // INITIALISE AND DECLARE VARIABLES
  const account = req.user._id;
  const projectId = mongoose.Types.ObjectId(req.body.id);
  const updates = JSON.parse(req.body.updates);
  // VALIDATE REQUIRED VARIABLES
  if (!account) return res.send({ status: "failed", content: "invalid user ID" });
  if (!projectId) return res.send({ status: "failed", content: "invalid project ID" });
  // UPDATE THE PROJECT
  // FETCH THE PROJECT TO BE UPDATED
  let project;
  try {
    project = await Project.findOne({ _id: projectId, account });
  } catch (error) {
    return res.send(error);
  }
  // VALIDATE THE PROJECT
  if (!project) return res.send({ status: "failed", content: "no project found" });
  // UPDATE THE PROJECT
  try {
    await project.update(updates);
  } catch (error) {
    return res.send(error);
  }
  // Update the Thumbnail (if provided)
  if (req.file) {
    try {
      await project.updateThumbnail(req.file.id);
    } catch (error) {
      return res.send(error);
    }
  }
  // SAVE UPDATES
  let savedProject;
  try {
    savedProject = await project.save();
  } catch (error) {
    return res.send({ status: "error", content: error });
  }
  // FORMAT
  const mappedProject = {
    id: savedProject._id,
    name: savedProject.name,
    thumbnail: savedProject.thumbnail,
    bookmark: savedProject.bookmark,
    date: savedProject.date,
    notes: savedProject.notes,
    makes: savedProject.makes
  };
  // SEND SUCCESS MESSAGE TO CLIENT
  return res.send({ status: "succeeded", content: mappedProject });
})

router.post("/profile/customer/delete/proj", verifiedContent, async (req, res) => {
  console.log("delete-project");
  // INITIALISE AND DECLARE VARIABLES
  const account = req.user._id;
  const project = mongoose.Types.ObjectId(req.body.id);
  // VALIDATE REQUIRED VARIABLES
  if (!account) {
    res.send({ status: "failed", content: "invalid user ID" });
    return;
  }
  if (!project) {
    res.send({ status: "failed", content: "invalid project ID" });
    return;
  }
  // DELETE THE PROJECT
  try {
    await Project.deleteOne({ _id: project });
  } catch (error) {
    res.send({ status: "failed", content: "invalid project ID" });
    return;
  }
  // SEND SUCCESS MESSAGE TO CLIENT
  res.send({ status: "succeeded", content: "project deleted" });
  return;
});

// @route     GET /profile/projects/retrieve-thumbnail/:id
// @desc
// @access    VERIFIED - CONTENT
router.get("/profile/projects/retrieve-thumbnail/:id", verifiedContent, async (req, res) => {
  console.log("retrieve-thumbnail");
  // DECLARE VARIABLES
  const projectId = mongoose.Types.ObjectId(req.params.id);
  // FETCH PROJECT
  let project;
  try {
    project = await Project.findOne({ _id: projectId });
  } catch (error) {
    return res.send({ status: "error", content: error });
  }
  if (!project) return res.send({ status: "failed", content: "no project found" });
  // SET QUERY
  let query = { filename: "project-thumbnail.jpeg" };
  if (project.thumbnail) query = { _id: project.thumbnail };
  // FETCH THE THUMBNAIL
  try {
    file = await GridFS.files.findOne(query);
  } catch (error) {
    return res.send({ status: "error", content: error });
  }
  // SUCCESS HANDLER
  let readstream = GridFS.createReadStream(file.filename);
  return readstream.pipe(res);
});

/*=========================================================================================
EXPORT ROUTE
=========================================================================================*/

module.exports = router;

/*=========================================================================================
END
=========================================================================================*/
