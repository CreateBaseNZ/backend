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

const restrictedPages = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/login");
  }
};

/*=========================================================================================
ROUTES
=========================================================================================*/

router.post("/profile/customer/new/proj", restrictedPages, async (req, res) => {
  // INITIALISE AND DECLARE VARIABLES
  const account = req.user._id;
  const name = req.body.name;
  const bookmark = req.body.bookmark;
  const makes = req.body.makes;
  const note = req.body.note;
  const options = {
    bookmark,
    makes,
    note
  };
  // VALIDATE REQUIRED VARIABLES
  if (!account) {
    res.send({ status: "failed", content: "invalid user ID" });
    return;
  }
  if (!name) {
    res.send({ status: "failed", content: "invalid project name" });
    return;
  }
  // CREATE THE PROJECT
  let message;
  try {
    message = await Project.create(account, name, options);
  } catch (error) {
    res.send({ status: "failed", content: error });
    return;
  }
  // RETURN SUCCESS MESSAGE TO CLIENT
  res.send({ status: "success", content: message });
  return;
})

router.get("/profile/customer/fetch/all_proj", restrictedPages, async (req, res) => {
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

/*=========================================================================================
EXPORT ROUTE
=========================================================================================*/

module.exports = router;

/*=========================================================================================
END
=========================================================================================*/
