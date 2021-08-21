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
  let profileObject = {
    date: {
      lastModified: object.date,
      lastVisited: object.date,
      firstCreated: object.date,
    },
  };
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
  // User data
  const user = {
    organisation: organisation.name,
    username: license.username,
    access: license.access,
  };
  // Success handler
  return res.send({ status: "succeeded", content: user });
});

router.post("/user-data/create", async (req, res) => {
  const user = req.body.user;
  const input = req.body.input;
  const date = req.body.date;
  // Fetch the organisation of the user
  let organisation;
  try {
    organisation = await Organisation.findOne({ name: user.organisation });
  } catch (error) {
    return res.send({ status: "error", content: error });
  }
  // Check if an organisation exist
  if (!organisation) {
    return res.send({
      status: "failed",
      content: "Failed to retrieve the user's organisation.",
    });
  }
  // Fetch the license of the user
  let license;
  try {
    license = await License.findOne({
      _id: organisation.licenses,
      username: user.username,
    });
  } catch (error) {
    return res.send({ status: "error", content: error });
  }
  // Check if a license exist
  if (!license) {
    return res.send({
      status: "failed",
      content: "Failed to retrieve the user's license.",
    });
  }
  // Fetch the profile of the user
  let profile;
  try {
    profile = await Profile.findOne({ license: license._id });
  } catch (error) {
    return res.send({ status: "error", content: error });
  }
  // Check if a profile exist
  if (!profile) {
    return res.send({
      status: "failed",
      content: "Failed to retrieve the user's profile.",
    });
  }
  // Add the data
  let saves = profile.saves || {};
  for (const property in input) {
    if (!saves.hasOwnProperty(property)) {
      saves[property] = input[property];
    } else {
      return res.send({
        status: "failed",
        content: `The ${property} property already exist. Please use 'update' instead for this property.`,
      });
    }
  }
  // Save the data
  profile.saves = saves;
  profile.markModified("saves");
  profile.date.lastModified = date;
  try {
    await profile.save();
  } catch (error) {
    return res.send({ status: "error", content: error });
  }
  // Return the newly saved data
  return res.send({ status: "succeeded", content: input });
});

router.post("/user-data/read", async (req, res) => {
  const user = req.body.user;
  const input = req.body.input;
  // Fetch the organisation of the user
  let organisation;
  try {
    organisation = await Organisation.findOne({ name: user.organisation });
  } catch (error) {
    return res.send({ status: "error", content: error });
  }
  // Check if an organisation exist
  if (!organisation) {
    return res.send({
      status: "failed",
      content: "Failed to retrieve the user's organisation.",
    });
  }
  // Fetch the license of the user
  let license;
  try {
    license = await License.findOne({
      _id: organisation.licenses,
      username: user.username,
    });
  } catch (error) {
    return res.send({ status: "error", content: error });
  }
  // Check if a license exist
  if (!license) {
    return res.send({
      status: "failed",
      content: "Failed to retrieve the user's license.",
    });
  }
  // Fetch the profile of the user
  let profile;
  try {
    profile = await Profile.findOne({ license: license._id });
  } catch (error) {
    return res.send({ status: "error", content: error });
  }
  // Check if a profile exist
  if (!profile) {
    return res.send({
      status: "failed",
      content: "Failed to retrieve the user's profile.",
    });
  }
  // Fetch the data;
  let data = new Object();
  for (let i = 0; i < input.length; i++) {
    const property = input[i];
    if (Object.hasOwnProperty.call(profile.saves, property)) {
      data[property] = profile.saves[property];
    } else {
      return res.send({
        status: "failed",
        content: `The ${property} property does not exist.`,
      });
    }
  }
  // Return the requested property values
  return res.send({ status: "succeeded", content: data });
});

router.post("/user-data/update", async (req, res) => {
  const user = req.body.user;
  const input = req.body.input;
  const date = req.body.date;
  // Fetch the organisation of the user
  let organisation;
  try {
    organisation = await Organisation.findOne({ name: user.organisation });
  } catch (error) {
    return res.send({ status: "error", content: error });
  }
  // Check if an organisation exist
  if (!organisation) {
    return res.send({
      status: "failed",
      content: "Failed to retrieve the user's organisation.",
    });
  }
  // Fetch the license of the user
  let license;
  try {
    license = await License.findOne({
      _id: organisation.licenses,
      username: user.username,
    });
  } catch (error) {
    return res.send({ status: "error", content: error });
  }
  // Check if a license exist
  if (!license) {
    return res.send({
      status: "failed",
      content: "Failed to retrieve the user's license.",
    });
  }
  // Fetch the profile of the user
  let profile;
  try {
    profile = await Profile.findOne({ license: license._id });
  } catch (error) {
    return res.send({ status: "error", content: error });
  }
  // Check if a profile exist
  if (!profile) {
    return res.send({
      status: "failed",
      content: "Failed to retrieve the user's profile.",
    });
  }
  // Update the data
  let saves = profile.saves;
  for (const property in input) {
    if (saves.hasOwnProperty(property)) {
      saves[property] = input[property];
    } else {
      return res.send({
        status: "failed",
        content: `The ${property} property does not exist. Please use 'create' instead for this property.`,
      });
    }
  }
  // Save the data
  profile.saves = saves;
  profile.markModified("saves");
  profile.date.lastModified = date;
  try {
    await profile.save();
  } catch (error) {
    return res.send({ status: "error", content: error });
  }
  // Return the newly saved data
  return res.send({ status: "succeeded", content: input });
});

router.post("/user-data/delete", async (req, res) => {
  const user = req.body.user;
  const input = req.body.input;
  const date = req.body.date;
  // Fetch the organisation of the user
  let organisation;
  try {
    organisation = await Organisation.findOne({ name: user.organisation });
  } catch (error) {
    return res.send({ status: "error", content: error });
  }
  // Check if an organisation exist
  if (!organisation) {
    return res.send({
      status: "failed",
      content: "Failed to retrieve the user's organisation.",
    });
  }
  // Fetch the license of the user
  let license;
  try {
    license = await License.findOne({
      _id: organisation.licenses,
      username: user.username,
    });
  } catch (error) {
    return res.send({ status: "error", content: error });
  }
  // Check if a license exist
  if (!license) {
    return res.send({
      status: "failed",
      content: "Failed to retrieve the user's license.",
    });
  }
  // Fetch the profile of the user
  let profile;
  try {
    profile = await Profile.findOne({ license: license._id });
  } catch (error) {
    return res.send({ status: "error", content: error });
  }
  // Check if a profile exist
  if (!profile) {
    return res.send({
      status: "failed",
      content: "Failed to retrieve the user's profile.",
    });
  }
  // delete the data;
  let saves = profile.saves;
  for (let i = 0; i < input.length; i++) {
    const property = input[i];
    if (Object.hasOwnProperty.call(profile.saves, property)) {
      delete saves[property];
    } else {
      return res.send({
        status: "failed",
        content: `The ${property} property does not exist.`,
      });
    }
  }
  // Save the data
  profile.saves = saves;
  profile.markModified("saves");
  profile.date.lastModified = date;
  try {
    await profile.save();
  } catch (error) {
    return res.send({ status: "error", content: error });
  }
  // Return the requested property values
  return res.send({
    status: "succeeded",
    content: "The data has been deleted successfully.",
  });
});

router.post("/organisation-license/add", async (req, res) => {
  const object = req.body;
  // Fetch the organisation
  let organisation;
  try {
    organisation = await Organisation.findOne({ name: object.organisation });
  } catch (error) {
    return res.send({ status: "error", content: error });
  }
  if (!organisation) {
    return res.send({
      status: "failed",
      content: "There's no organisation found.",
    });
  }
  // Create a new license
  const licenseInput = {
    organisation: organisation._id,
    username: object.username,
    password: object.password,
    statuses: [{ type: object.status, date: object.date }],
    access: object.access,
  };
  let license;
  try {
    license = await License.build(licenseInput, false);
  } catch (data) {
    return res.send(data);
  }
  // Create a new profile
  const profileInput = {
    date: {
      lastModified: object.date,
      lastVisited: object.date,
      firstCreated: object.date,
    },
  };
  let profile;
  try {
    profile = await Profile.build(profileInput, false);
  } catch (data) {
    return res.send(data);
  }
  // Create links
  organisation.licenses.push(license._id);
  license.organisation = organisation._id;
  license.profile = profile._id;
  profile.license = license._id;
  // Save documents
  const promises = [organisation.save(), license.save(), profile.save()];
  try {
    await Promise.all(promises);
  } catch (error) {
    return res.send({ status: "error", content: error });
  }
  // Return the result
  return res.send({
    status: "succeeded",
    content: "A license has been created successfully.",
  });
});

// EXPORT ===================================================

module.exports = router;

// END ======================================================
