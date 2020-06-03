/*=========================================================================================
REQUIRED MODULES
=========================================================================================*/

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

/*=========================================================================================
VARIABLES
=========================================================================================*/

const router = new express.Router();
const customerRouteOptions = {
  root: path.join(__dirname, "../views/public")
};

/*=========================================================================================
MODELS
=========================================================================================*/

const Mail = require("../../model/Mail.js");
const Account = require("../../model/Account.js");
const Customer = require("../../model/Customer.js");

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

const verifiedDataAccess = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.verification.status) {
      return next();
    } else {
      return res.send({ status: "failed", content: "need to verify" });
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
GRIDFS
=========================================================================================*/

const gridFsStream = require("gridfs-stream");

let GridFS;

mongoose.createConnection(
  process.env.MONGODB_URL,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
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

// @route     Get /profile/customer/fetch/picture
// @desc
// @access    Private
router.get("/profile/customer/fetch/picture", restrictedAccess, async (req, res) => {
  // Declare Variables
  const user = req.user;
  // Fetch Customer Details
  let customer;
  try {
    customer = await Customer.findByAccountId(user._id);
  } catch (error) {
    return res.send({ status: "failed", content: error });
  }
  // Check if Customer has Profile Picture
  let file = undefined;
  if (customer.picture) {
    // If so, Send File to Front-End
    try {
      file = await GridFS.files.findOne({ _id: customer.picture });
    } catch (error) {
      return res.send({ status: "failed", content: error });
    }
    if (file) {
      let readstream = GridFS.createReadStream(file.filename);
      return readstream.pipe(res);
    }
  }
  // Else, Return Temporary Profile Picture
  try {
    file = await GridFS.files.findOne({ filename: "default-profile.png" });
  } catch (error) {
    return res.send({ status: "failed", content: error });
  }
  let readstream = GridFS.createReadStream(file.filename);
  return readstream.pipe(res);
}
);

// @route     Get /profile/customer/update/picture
// @desc
// @access    Private
router.post("/profile/customer/update/picture", upload.single("picture"), restrictedAccess, async (req, res) => {
  // Declare Variables
  const file = req.file;
  const user = req.user;
  // Fetch Customer Details
  let customer;
  try {
    customer = await Customer.findByAccountId(user._id);
  } catch (error) {
    return res.send({ status: "failed", content: error });
  }
  // Check if Customer has Profile Picture
  if (customer.picture) {
    // If so, Delete Profile Picture
    try {
      await GridFS.remove({ _id: customer.picture, root: "fs" });
    } catch (error) {
      return res.send({ status: "failed", content: error });
    }
  }
  // Update Customer's Profile Picture
  customer.picture = file.id;
  try {
    customer.save();
  } catch (error) {
    return res.send({ status: "failed", content: error });
  }
  return res.send({ status: "success", content: "profile picture updated" });
}
);

// @route     Get /profile/customer/fetch
// @desc
// @access    Private
router.get("/profile/customer/fetch", verifiedAccess, async (req, res) => {
  // Declare Variables
  const accountId = req.user._id;
  // Fetch Customer
  let customer;
  try {
    customer = await Customer.findByAccountId(accountId);
  } catch (error) {
    res.send({ status: "failed", data: error });
    return;
  }
  // Check if Bio is Empty (TEMPORARY)
  let bio;
  if (customer.bio) {
    bio = customer.bio;
  } else {
    bio = "";
  }
  // Filter Customer Details
  const filteredCustomer = {
    displayName: customer.displayName,
    bio,
    address: customer.address
  };
  // Send Success Request
  res.send({ status: "success", data: filteredCustomer });
});

// @route     Get /profile/customer/update
// @desc
// @access    Private
router.post("/profile/customer/update", verifiedAccess, async (req, res) => {
  // Declare Variables
  const details = req.body;
  const accountId = req.user._id;
  // Fetch Customer
  let customer;
  try {
    customer = await Customer.findByAccountId(accountId);
  } catch (error) {
    return res.send({ status: "failed", data: error });
  }
  // Update Customer Details
  let updatedCustomer;
  try {
    updatedCustomer = await customer.update(details);
  } catch (error) {
    return res.send({ status: "failed", data: error });
  }
  return res.send({ status: "success", data: "customer details updated" });
});

/*=========================================================================================
EXPORT ROUTE
=========================================================================================*/

module.exports = router;

/*=========================================================================================
END
=========================================================================================*/
