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
  // INITIALISE AND DECLARE VARIABLES
  const account = req.user._id;
  const project = JSON.parse(req.body.project);
  const name = project.name;
  let thumbnail;
  if (req.file) thumbnail = req.file.id;
  const bookmark = project.bookmark;
  const makes = project.makes;
  const notes = project.notes;
  const newProject = { account, name, thumbnail, bookmark, makes, notes };
  // CREATE THE PROJECT
  let savedProject;
  try {
    savedProject = await Project.build(newProject);
  } catch (error) {
    return res.send(error);
  }
  // RETURN SUCCESS MESSAGE TO CLIENT
  return res.send({ status: "succeeded", content: savedProject });
})

router.get("/profile/customer/fetch/all_proj", verifiedContent, async (req, res) => {
  // INITIALISE AND DECLARE VARIABLES
  const account = req.user._id;
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
  // INITIALISE AND DECLARE VARIABLES
  const account = req.user;
  const projectId = mongoose.Types.ObjectId(req.body.id);
  const updates = JSON.parse(req.body.updates);
  const file = req.file;
  // VALIDATE REQUIRED VARIABLES
  if (!projectId) return res.send({ status: "failed", content: "Project ID is required" });
  // UPDATE THE PROJECT
  // FETCH THE PROJECT TO BE UPDATED
  let project;
  try {
    project = await Project.findOne({ _id: projectId, account: account._id });
  } catch (error) {
    return res.send({ status: "error", content: error });
  }
  // VALIDATE THE PROJECT
  if (!project) return res.send({ status: "failed", content: "No project found" });
  // UPDATE THE PROJECT
  try {
    await project.update(updates);
  } catch (error) {
    return res.send(error);
  }
  // Update the Thumbnail (if provided)
  if (file) {
    try {
      await project.updateThumbnail(file.id);
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
  // INITIALISE AND DECLARE VARIABLES
  const projectId = mongoose.Types.ObjectId(req.body.id);
  const account = req.user;
  // VALIDATE REQUIRED VARIABLES
  if (!projectId) return res.send({ status: "failed", content: "invalid project ID" });
  // DELETE THE PROJECT
  try {
    await Project.deleteOne({ _id: projectId, account: account._id });
  } catch (error) {
    return res.send({ status: "error", content: error });
  }
  // SEND SUCCESS MESSAGE TO CLIENT
  return res.send({ status: "succeeded", content: "project deleted" });
});

// @route     GET /profile/projects/retrieve-thumbnail/:id
// @desc
// @access    VERIFIED - CONTENT
router.get("/profile/projects/retrieve-thumbnail/:id", verifiedContent, async (req, res) => {
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
