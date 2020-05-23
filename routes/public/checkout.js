/*=========================================================================================
REQUIRED MODULES
=========================================================================================*/

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const mongoose = require("mongoose");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

/*=========================================================================================
VARIABLES
=========================================================================================*/

const router = new express.Router();

/*=========================================================================================
MODELS
=========================================================================================*/

const Account = require("../../model/Account.js");
const Customer = require("../../model/Customer.js");
const Order = require("../../model/Order.js");
const Make = require("../../model/Make.js");

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

// @route     GET /checkout/order
// @desc
// @access    Private
router.get("/checkout/order", restrictedPages, async (req, res) => {
  // DECLARE VARIABLES
  const accountId = req.user._id;
  const sessionId = req.sessionID;
  const wallet = req.user.wallet;
  // BUILD THE ORDER
  let order;
  let access;
  let id;
  // Create the find object
  let query;
  if (accountId) {
    query = { accountId, status: "created" };
    access = "private";
    id = accountId;
  } else {
    query = { sessionId, status: "created" };
    access = "public";
    id = sessionId;
  }
  // Fetch existing active order
  try {
    order = await Order.findOne(query);
  } catch (error) {
    return res.send({ status: "failed", content: error });
  }
  // Create a new order if there is no order found
  if (!order) order = Order.create(access, id);
  // UPDATE MAKES, DISCOUNTS AND SAVED ADDRESS
  let makes;
  try {
    [makes] = await Promise.all([order.updateMakes(), order.updateSavedAddress()]);
  } catch (error) {
    return res.send({ status: "failed", content: error });
  }
  // SAVE THE ORDER UPDATES AND CALCULATE ORDER'S AMOUNT 
  let amount;
  try {
    [amount] = await Promise.all([order.amount(), order.save()]);
  } catch (error) {
    return res.send({ status: "failed", content: error });
  }
  // VALIDATE THE ORDER'S SECTIONS
  const validity = order.validateAll();
  // RETURN SUCCESS RESPONSE TO THE CLIENT
  return res.send({ status: "success", content: { order, makes, amount, validity, wallet } });
});

// @route     POST /checkout/update
// @desc
// @access    Private
router.post("/checkout/update", restrictedPages, async (req, res) => {
  // DECLARE VARIABLES
  const accountId = req.user._id;
  const sessionId = req.sessionID;
  const updates = req.body.updates;
  // FETCH THE ORDER
  let order;
  // Create the query
  let query;
  if (accountId) {
    query = { accountId, status: "created" };
  } else {
    query = { sessionId, status: "created" };
  }
  // Fetch the active order
  try {
    order = await Order.findOne(query);
  } catch (error) {
    return res.send({ status: "failed", content: error });
  }
  // UPDATE ORDER
  order.update(updates);
  // SAVE ORDER
  try {
    await order.save();
  } catch (error) {
    return res.send({ status: "failed", content: error });
  }
  // CALCULATE ORDER'S AMOUNT 
  let amount;
  try {
    amount = await order.amount();
  } catch (error) {
    return res.send({ status: "failed", content: error });
  }
  // VALIDATION
  const validity = order.validateAll();
  return res.send({ status: "success", content: { order, amount, validity } });
});

// @route GET /checkout/validate
// @desc
// @access    Private
router.get("/checkout/validate", restrictedPages, async (req, res) => {
  // DECLARE VARIABLES
  const accountId = req.user._id;
  const sessionId = req.sessionID;
  // BUILD THE ORDER
  let order;
  // Create the query
  let query;
  if (accountId) {
    query = { accountId, status: "created" };
  } else {
    query = { sessionId, status: "created" };
  }
  // Fetch the active order
  try {
    order = await Order.find(query);
  } catch (error) {
    return res.send({ status: "failed", content: error });
  }
  // VALIDATION
  const validity = order.validateAll();
  return res.send({ status: "success", content: validity });
});

// @route     POST /checkout/order/delete/print
// @desc
// @access    Private
router.post("/checkout/order/delete/print", restrictedPages, async (req, res) => {
  // Delete the make document and the corresponding file from the database
  const accountId = mongoose.Types.ObjectId(req.user._id);
  const sessionId = req.sessionID;
  const makeId = mongoose.Types.ObjectId(req.body.printId);
  // DELETE THE MAKE
  let deletedMake;
  try {
    deletedMake = await Make.deleteByIdAndAccountId(makeId, accountId);
  } catch (error) {
    // If error was encountered, send a failed status
    return res.send({ status: "failed", content: error });
  }
  // UPDATE THE ORDER INSTANCE
  let order;
  // Create the find object
  let object;
  if (accountId) {
    object = { accountId, status: "created" };
  } else {
    object = { sessionId, status: "created" };
  }
  // Fetch existing active order
  try {
    order = await Order.find(object);
  } catch (error) {
    return res.send({ status: "failed", content: error });
  }
  // Update makes
  try {
    await order.updateMakes();
  } catch (error) {
    return res.send({ status: "failed", content: error });
  }
  // Save the make
  try {
    await order.save();
  } catch (error) {
    return res.send({ status: "failed", content: error });
  }
  // Validate the checkout
  const validity = order.validateAll();
  // Send back a success status
  return res.send({ status: "success", content: validity });
});

// @route     GET /checkout/order-amount
// @desc      Fetch the object containing the amounts of the order
// @access    Private
router.get("/checkout/order-amount", restrictedPages, async (req, res) => {
  // DECLARE VARIABLES
  const accountId = req.user._id;
  const sessionId = req.sessionID;
  // BUILD THE ORDER
  let order;
  // Create the find object
  let object;
  if (accountId) {
    object = { accountId, status: "created" };
  } else {
    object = { sessionId, status: "created" };
  }
  // Fetch the active order
  try {
    order = await Order.find(object);
  } catch (error) {
    return res.send({ status: "failed", content: error });
  }
  // Calculate Order Amounts 
  let amount;
  try {
    amount = await order.amount();
  } catch (error) {
    return res.send({ status: "failed", content: error });
  }
  // Send the amount object to the client
  return res.send({ status: "success", content: amount });
})

// @route     GET /checkout/bank-transfer
// @desc      This route processes the bank transfer payment for
//            the customer's order.
// @access    Private
router.get("/checkout/bank-transfer", restrictedPages, async (req, res) => {
  // DECLARE VARIABLES
  const accountId = req.user._id;
  const sessionId = req.sessionID;
  // BUILD THE ORDER
  let order;
  // Create the find object
  let object;
  if (accountId) {
    object = { accountId, status: "created" };
  } else {
    object = { sessionId, status: "created" };
  }
  // Fetch existing active order
  try {
    order = await Order.transaction(object);
  } catch (error) {
    return res.send({ status: "failed", content: error });
  }
  // Return a success message
  return res.send({ status: "success", content: "bank transfer processed" });
});

// @route     POST /checkout/card-payment
// @desc      
// @access    Private
router.post("/checkout/card-payment", restrictedPages, async (req, res) => {
  // VALIDATE THE PAYMENT INTENT
  // Declare Variables
  const paymentIntentId = req.body.paymentIntentId;
  // Check if client secret is provided
  if (!paymentIntentId) {
    return res.send({ status: "failed", content: "no payment intent ID provided" });
  }
  // Retrieve payment intent
  let paymentIntent;
  try {
    paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
  } catch (error) {
    return res.send({ status: "failed", content: error });
  }
  // Validate the success of the payment
  if (paymentIntent.status !== "succeeded") {
    return res.send({ status: "failed", content: "payment unsuccessful" });
  }
  // UPDATE ORDER DETAILS
  // Declare variables
  const accountId = req.user._id;
  const sessionId = req.sessionID;
  // Build the order
  let order;
  // Create the find object
  let object;
  if (accountId) {
    object = { accountId, status: "created" };
  } else {
    object = { sessionId, status: "created" };
  }
  // Fetch existing active order
  try {
    order = await Order.transaction(object);
  } catch (error) {
    return res.send({ status: "failed", content: error });
  }
  // Return a success message
  return res.send({ status: "success", content: "card payment processed" });
})

// @route     GET /orders/print/update
// @desc      Update the quantity of the 3D print order
// @access    Private
router.post("/checkout/make/update", restrictedPages, async (req, res) => {
  // DECLARE VARIABLES
  const accountId = req.user._id;
  const sessionId = req.sessionID;
  const makeId = req.body.makeId;
  const updates = req.body.updates;
  // FETCH MAKE
  let make;
  try {
    make = await Make.findOne({ _id: makeId });
  } catch (error) {
    return res.send({ status: "failed", content: error });
  }
  // UPDATE MAKE
  make.update(updates);
  // SAVE MAKE
  try {
    await make.save();
  } catch (error) {
    return res.send({ status: "failed", content: error });
  }
  // FETCH THE ORDER
  let order;
  // Create the query
  let query;
  if (accountId) {
    query = { accountId, status: "created" };
  } else {
    query = { sessionId, status: "created" };
  }
  // Fetch the active order
  try {
    order = await Order.findOne(query);
  } catch (error) {
    return res.send({ status: "failed", content: error });
  }
  // CALCULATE ORDER'S AMOUNT 
  let amount;
  try {
    amount = await order.amount();
  } catch (error) {
    return res.send({ status: "failed", content: error });
  }
  // RETURN SUCCESS
  return res.send({ status: "success", content: amount });
});

/*-----------------------------------------------------------------------------------------
PAYMENT
-----------------------------------------------------------------------------------------*/

router.get("/checkout/payment-intent", async (req, res) => {
  // DECLARE VARIABLES
  const accountId = req.user._id;
  const sessionId = req.sessionID;
  // BUILD THE ORDER
  let order;
  // Create the find object
  let query;
  if (accountId) {
    query = { accountId, status: "created" };
  } else {
    query = { sessionId, status: "created" };
  }
  // Fetch existing active order
  try {
    order = await Order.findOne(query);
  } catch (error) {
    return res.send({ status: "failed", content: error });
  }
  // CREATE THE PAYMENT INTENT OBJECT
  let object;
  try {
    object = await createPaymentIntentObject(accountId, order);
  } catch (error) {
    return res.send({ status: "failed", content: error });
  }
  // CREATE PAYMENT INTENT
  let paymentIntent;
  try {
    paymentIntent = await stripe.paymentIntents.create(object);
  } catch (error) {
    return res.send({ status: "failed", content: error });
  }
  // RETURN THE CLIENT SECRET TO THE FRONT END
  const clientSecret = paymentIntent["client_secret"];
  return res.send({ status: "success", content: clientSecret });
});

/*=========================================================================================
FUNCTIONS
=========================================================================================*/

/*-----------------------------------------------------------------------------------------
PAYMENT
-----------------------------------------------------------------------------------------*/

// Details:     Create the Payment Intent Object
// Required:    amount (integer)
//              currency (string)
const createPaymentIntentObject = (accountId, order, options) => {
  return new Promise(async (resolve, reject) => {
    // FETCH USER DETAILS
    let account;
    try {
      account = await Account.findById(accountId);
    } catch (error) {
      return reject(error);
    }
    // CALCULATE ORDER PRICE
    let amount;
    try {
      amount = await order.amount();
    } catch (error) {
      return reject(error);
    }

    // CREATE THE PAYMENT INTENT OBJECT
    const object = {
      amount: (Math.floor(amount.total.total * 100)),
      currency: "nzd",
      confirm: false,
      payment_method_types: ["card"],
      receipt_email: account.email
    }
    // RETURN SUCCESS MESSAGE
    resolve(object);
    return;
  });
};

/*=========================================================================================
EXPORT ROUTE
=========================================================================================*/

module.exports = router;

/*=========================================================================================
END
=========================================================================================*/
