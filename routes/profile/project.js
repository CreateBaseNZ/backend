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

router.post("/profile/customer/new/proj", upload.single("thumbnail"), verifiedAccess, async (req, res) => {
  // INITIALISE AND DECLARE VARIABLES
  const account = req.user._id;
  const name = req.body.name;
  let thumbnail;
  if (req.file) thumbnail = req.file.id;
  const bookmark = req.body.bookmark;
  const makes = req.body.makes;
  const notes = req.body.notes;
  const options = { name, bookmark, makes, notes };
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

router.get("/profile/customer/fetch/all_proj", verifiedAccess, async (req, res) => {
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

router.post("/profile/customer/update/proj", upload.single("thumbnail"), verifiedAccess, async (req, res) => {
  // INITIALISE AND DECLARE VARIABLES
  const account = req.user._id;
  const projectId = mongoose.Types.ObjectId(req.body.id);
  const updates = req.body.updates;
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

router.post("/profile/customer/delete/proj", verifiedAccess, async (req, res) => {
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
})

/*=========================================================================================
EXPORT ROUTE
=========================================================================================*/

module.exports = router;

/*=========================================================================================
END
=========================================================================================*/
