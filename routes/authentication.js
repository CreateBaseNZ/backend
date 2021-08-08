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
    date: object.date
  };
  // Create a profile
  let profileObject = {};
  // Create an admin license
  let licenseObject = {
    username: object.username,
    password: object.password,
    statuses: [{ type: "free", date: object.date }],
    access: { admin: true }
  };
  // Build instances asynchronously
  const promises1 = [
    Organisation.build(organisationObject, false),
    Profile.build(profileObject, false),
    License.build(licenseObject, false)
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
    newOrganisation.save(), newLicense.save(), newProfile.save()
  ];
  try {
    await Promise.all();
  } catch (error) {
    return res.send({ status: "error", content: error });
  }
  // Success handler
  return res.send({ status: "succeeded", content: "The signup was successful." });
});

// EXPORT ===================================================



// END ======================================================