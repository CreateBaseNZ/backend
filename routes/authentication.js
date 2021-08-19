// MODULES ==================================================

const express = require("express");

// VARIABLES ================================================

const router = new express.Router();

// MODELS ===================================================

const Organisation = require("../model/Organisation.js");
const Profile = require("../model/Profile.js");
const License = require("../model/License.js");

// ROUTES ===================================================

router.post("/signup", async (req, res) => {
  // Declare variables
  const object = req.body;
  // Create an organisation
  let organisationObject = {
    name: object.name,
    date: object.date,
  };
  // Create a profile
  let profileObject = {};
  // Create an admin license
  let licenseObject = {
    username: object.username,
    password: object.password,
    statuses: [{ type: "free", date: object.date }],
    access: { admin: true },
  };
  // Build instances asynchronously
  const promises1 = [
    Organisation.build(organisationObject, false),
    Profile.build(profileObject, false),
    License.build(licenseObject, false),
  ];
  let newOrganisation;
  let newProfile;
  let newLicense;
  try {
    [newOrganisation, newProfile, newLicense] = await Promise.all(promises1);
  } catch (data) {
    return res.send(data);
  }
  // Update the links between the instances
  newOrganisation.licenses = [newLicense._id];
  newLicense.organisation = newOrganisation._id;
  newLicense.profile = newProfile._id;
  newProfile.license = newLicense._id;
  // Save the new instances
  const promises2 = [
    newOrganisation.save(),
    newLicense.save(),
    newProfile.save(),
  ];
  try {
    await Promise.all(promises2);
  } catch (error) {
    return res.send({ status: "error", content: error });
  }
  // Success handler
  return res.send({
    status: "succeeded",
    content: "The signup was successful.",
  });
});

router.post("/login", async (req, res) => {
  const object = req.body;
  // Fetch the license associated with the organisation
  let organisation;
  try {
    organisation = await Organisation.findOne({ name: object.name });
  } catch (error) {
    return res.send({ status: "error", content: error });
  }
  if (!organisation) {
    return res.send({ status: "failed", content: "Unknown organisation." });
  }
  let license;
  try {
    license = await License.findOne({
      _id: organisation.licenses,
      username: object.username,
    });
  } catch (error) {
    return res.send({ status: "error", content: error });
  }
  if (!license) {
    return res.send({ status: "failed", content: "Unknown username." });
  }
  // Validate the password input
  let match;
  try {
    match = await license.validatePassword(object.password);
  } catch (error) {
    return res.send({ status: "error", content: error });
  }
  if (!match) {
    return res.send({ status: "failed", content: "Incorrect password." });
  }
  // TEMPORARY: User data
  const user = {
    name: organisation.name,
    username: license.username,
  };
  // Success handler
  return res.send({ status: "succeeded", content: user });
});

// EXPORT ===================================================

module.exports = router;

// END ======================================================
