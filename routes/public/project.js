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

const Project = require("../../model/Project.js");

/*=========================================================================================
MIDDLEWARE
=========================================================================================*/

const restrictedAccess = (req, res, next) => {
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
/*=========================================================================================
ROUTES
=========================================================================================*/

router.post("/profile/customer/new/proj", restrictedAccess, async (req, res) => {
  // INITIALISE AND DECLARE VARIABLES
  const account = req.user._id;
  const name = req.body.name;
  const bookmark = req.body.bookmark;
  const makes = req.body.makes;
  const notes = req.body.notes;
  const options = {
    name,
    bookmark,
    makes,
    notes
  };
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
  res.send({ status: "success", content: message });
  return;
})

router.get("/profile/customer/fetch/all_proj", restrictedAccess, async (req, res) => {
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
  res.send({ status: "success", content: projects });
  return;
})

router.post("/profile/customer/update/proj", restrictedAccess, async (req, res) => {
  // INITIALISE AND DECLARE VARIABLES
  const account = req.user._id;
  const projectId = mongoose.Types.ObjectId(req.body.id);
  const updates = req.body.updates;
  // VALIDATE REQUIRED VARIABLES
  if (!account) {
    res.send({ status: "failed", content: "invalid user ID" });
    return;
  }
  if (!projectId) {
    res.send({ status: "failed", content: "invalid project ID" });
    return;
  }
  // UPDATE THE PROJECT
  let message;
  try {
    message = await Project.update(account, projectId, updates);
  } catch (error) {
    res.send({ status: "failed", content: error });
    return;
  }
  // SEND SUCCESS MESSAGE TO CLIENT
  res.send({ status: "success", content: message });
  return;
})

router.post("/profile/customer/delete/proj", restrictedAccess, async (req, res) => {
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
  res.send({ status: "success", content: "project deleted" });
  return;
})

/*=========================================================================================
EXPORT ROUTE
=========================================================================================*/

module.exports = router;

/*=========================================================================================
END
=========================================================================================*/
