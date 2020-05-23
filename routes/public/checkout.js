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

// @route     POST /checkout/order
// @desc
// @access    Private
router.post("/checkout/order", restrictedPages, async (req, res) => {
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
    order = await Order.find(object);
  } catch (error) {
    return res.send({ status: "failed", content: error });
  }
  // Create a new order if there is no order found
  if (!order) order = Order.create();
  // Update makes
  let makes;
  try {
    makes = await order.updateMakes();
  } catch (error) {
    return res.send({ status: "failed", content: error });
  }
  // Update the Recreate the Discount Array
  // Set saved shipping address
  try {
    await order.updateSavedAddress();
  } catch (error) {
    return res.send({ status: "failed", content: error });
  }
  // Save and Send Response
  try {
    await order.save();
  } catch (error) {
    return res.send({ status: "failed", content: error });
  }
  // VALIDATE THE ORDER'S SECTIONS
  validity = {
    cart: savedOrder.validateCart(),
    shipping: savedOrder.validateShipping(),
    payment: savedOrder.validatePayment()
  };
  // RETURN SUCCESS RESPONSE TO THE CLIENT
  return res.send({ status: "success", content: { order, makes, validity } });
});

// @route     POST /checkout/order/update/manufacturing-speed
// @desc
// @access    Private
router.post(
  "/checkout/order/update/manufacturing-speed",
  restrictedPages,
  async (req, res) => {
    const accountId = mongoose.Types.ObjectId(req.user._id);
    const option = req.body.option;
    let order;
    // Find an Active Order
    try {
      order = await Order.findOneByAccoundIdAndStatus(accountId, "created");
    } catch (error) {
      return res.send({ status: "failed", data: error });
    }
    // Update order
    order.manufacturingSpeed = option;
    // Save order
    let savedOrder;
    try {
      savedOrder = await order.save();
    } catch (error) {
      return res.send({ status: "failed", data: error });
    }
    // Validation
    validity = {
      cart: savedOrder.validateCart(),
      shipping: savedOrder.validateShipping(),
      payment: savedOrder.validatePayment()
    };

    return res.send({
      status: "success",
      data: {
        order: savedOrder,
        price: {},
        validity
      }
    });
  }
);

// @route     POST /checkout/order/update/shipping-address-option
// @desc
// @access    Private
router.post(
  "/checkout/order/update/shipping-address-option",
  restrictedPages,
  async (req, res) => {
    const accountId = mongoose.Types.ObjectId(req.user._id);
    const option = req.body.option;
    let order;
    // Find an Active Order
    try {
      order = await Order.findOneByAccoundIdAndStatus(accountId, "created");
    } catch (error) {
      return res.send({ status: "failed", data: error });
    }
    // Update order
    order.shipping.address.option = option;
    // Save order
    let savedOrder;
    try {
      savedOrder = await order.save();
    } catch (error) {
      return res.send({ status: "failed", data: error });
    }
    // Validation
    validity = {
      cart: savedOrder.validateCart(),
      shipping: savedOrder.validateShipping(),
      payment: savedOrder.validatePayment()
    };

    return res.send({
      status: "success",
      data: {
        order: savedOrder,
        price: {},
        validity
      }
    });
  }
);

// @route     POST /checkout/order/update/new-shipping-address
// @desc
// @access    Private
router.post(
  "/checkout/order/update/new-shipping-address",
  restrictedPages,
  async (req, res) => {
    const accountId = mongoose.Types.ObjectId(req.user._id);
    const address = req.body.address;
    let order;
    // Find an Active Order
    try {
      order = await Order.findOneByAccoundIdAndStatus(accountId, "created");
    } catch (error) {
      return res.send({ status: "failed", data: error });
    }
    // Update order
    order.shipping.address.new = address;
    // Save order
    let savedOrder;
    try {
      savedOrder = await order.save();
    } catch (error) {
      return res.send({ status: "failed", data: error });
    }
    // Validation
    validity = {
      cart: savedOrder.validateCart(),
      shipping: savedOrder.validateShipping(),
      payment: savedOrder.validatePayment()
    };

    return res.send({
      status: "success",
      data: {
        order: savedOrder,
        price: {},
        validity
      }
    });
  }
);

// @route     POST /checkout/order/update/new-shipping-address-save
// @desc
// @access    Private
router.post("/checkout/order/update/new-shipping-address-save", restrictedPages, async (req, res) => {
  const accountId = mongoose.Types.ObjectId(req.user._id);
  const save = req.body.save;
  let order;
  // Find an Active Order
  try {
    order = await Order.findOneByAccoundIdAndStatus(accountId, "created");
  } catch (error) {
    return res.send({ status: "failed", data: error });
  }
  // Update order
  order.shipping.address.save = save;
  // Save order
  let savedOrder;
  try {
    savedOrder = await order.save();
  } catch (error) {
    return res.send({ status: "failed", data: error });
  }
  // Validation
  validity = {
    cart: savedOrder.validateCart(),
    shipping: savedOrder.validateShipping(),
    payment: savedOrder.validatePayment()
  };

  return res.send({
    status: "success",
    data: {
      order: savedOrder,
      price: {},
      validity
    }
  });
});

// @route     POST /checkout/order/update/shipping-method
// @desc
// @access    Private
router.post("/checkout/order/update/shipping-method", restrictedPages, async (req, res) => {
  const accountId = mongoose.Types.ObjectId(req.user._id);
  const option = req.body.option;
  let order;
  // Find an Active Order
  try {
    order = await Order.findOneByAccoundIdAndStatus(accountId, "created");
  } catch (error) {
    return res.send({ status: "failed", data: error });
  }
  // Update order
  order.shipping.method = option;
  // Save order
  let savedOrder;
  try {
    savedOrder = await order.save();
  } catch (error) {
    return res.send({ status: "failed", data: error });
  }
  // Validation
  validity = {
    cart: savedOrder.validateCart(),
    shipping: savedOrder.validateShipping(),
    payment: savedOrder.validatePayment()
  };

  return res.send({
    status: "success",
    data: {
      order: savedOrder,
      price: {},
      validity
    }
  });
});

// @route     POST /checkout/order/update/payment-method
// @desc
// @access    Private
router.post("/checkout/order/update/payment-method", restrictedPages, async (req, res) => {
  const accountId = mongoose.Types.ObjectId(req.user._id);
  const option = req.body.option;
  let order;
  // Find an Active Order
  try {
    order = await Order.findOneByAccoundIdAndStatus(accountId, "created");
  } catch (error) {
    return res.send({ status: "failed", data: error });
  }
  // Update order
  order.payment.method = option;
  // Save order
  let savedOrder;
  try {
    savedOrder = await order.save();
  } catch (error) {
    return res.send({ status: "failed", data: error });
  }
  // Validation
  validity = {
    cart: savedOrder.validateCart(),
    shipping: savedOrder.validateShipping(),
    payment: savedOrder.validatePayment()
  };

  return res.send({
    status: "success",
    data: {
      order: savedOrder,
      price: {},
      validity
    }
  });
});

// @route     POST /checkout/order/validate/cart
// @desc
// @access    Private
router.post("/checkout/order/validate/cart", restrictedPages, async (req, res) => {
  const accountId = mongoose.Types.ObjectId(req.user._id);
  let order;
  // Find an Active Order
  try {
    order = await Order.findOneByAccoundIdAndStatus(accountId, "created");
  } catch (error) {
    return res.send({ status: "failed", data: error });
  }
  valid = order.validateCart();
  return res.send({ status: "success", data: valid });
});

// @route     POST /checkout/order/validate/shipping
// @desc
// @access    Private
router.post("/checkout/order/validate/shipping", restrictedPages, async (req, res) => {
  const accountId = mongoose.Types.ObjectId(req.user._id);
  let order;
  // Find an Active Order
  try {
    order = await Order.findOneByAccoundIdAndStatus(accountId, "created");
  } catch (error) {
    return res.send({ status: "failed", data: error });
  }
  valid = order.validateCart() && order.validateShipping();
  return res.send({ status: "success", data: valid });
});

// @route     POST /checkout/order/validate/payment
// @desc
// @access    Private
router.post("/checkout/order/validate/payment", restrictedPages, async (req, res) => {
  const accountId = mongoose.Types.ObjectId(req.user._id);
  let order;
  // Find an Active Order
  try {
    order = await Order.findOneByAccoundIdAndStatus(accountId, "created");
  } catch (error) {
    return res.send({ status: "failed", data: error });
  }
  valid = (order.validateCart() && order.validateShipping() && order.validatePayment());
  return res.send({ status: "success", data: valid });
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
  validity = {
    cart: order.validateCart(), shipping: order.validateShipping(), payment: order.validatePayment()
  };
  // Send back a success status
  return res.send({ status: "success", content: validity });
});

// @route     GET /checkout/order-amount
// @desc      Fetch the object containing the amounts of the order
// @access    Private
router.get("/checkout/order-amount", restrictedPages, async (req, res) => {
  // Initialise and Declare Variables
  const account = req.user._id;
  const orderStatus = "created";
  // Get the active order
  let order;
  try {
    order = await Order.findOneByAccoundIdAndStatus(account, orderStatus);
  } catch (error) {
    res.send({ status: "failed", content: error });
    return;
  }
  // Calculate Order Amounts 
  let amount;
  try {
    amount = await order.amount();
  } catch (error) {
    res.send({ status: "failed", content: error });
    return;
  }
  // Send the amount object to the client
  res.send({ status: "success", content: amount });
  return;
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
router.post("/orders/print/update", restrictedPages, async (req, res) => {
  let printId = mongoose.Types.ObjectId(req.body.printId);
  let printQuantity = req.body.quantity;
  let order;
  try {
    order = (await updateMakeOrder(printId, "quantity", printQuantity)).toJSON();
  } catch (error) {
    return res.send(error);
  }
  return res.send(order);
});

/*-----------------------------------------------------------------------------------------
PAYMENT
-----------------------------------------------------------------------------------------*/

router.get("/checkout/payment-intent", async (req, res) => {
  // Initialise and Declare Variables
  const account = req.user._id;
  const orderStatus = "created";
  // Get the active order
  let order;
  try {
    order = await Order.findOneByAccoundIdAndStatus(account, orderStatus);
  } catch (error) {
    res.send({ status: "failed", content: error });
    return;
  }
  // CREATE THE PAYMENT INTENT OBJECT
  let object;
  try {
    object = await createPaymentIntentObject(account, order);
  } catch (error) {
    res.send({ status: "failed", content: error });
    return;
  }
  // CREATE PAYMENT INTENT
  let paymentIntent;
  try {
    paymentIntent = await stripe.paymentIntents.create(object);
  } catch (error) {
    res.send({ status: "failed", content: error });
    return;
  }
  // RETURN THE CLIENT SECRET TO THE FRONT END
  const clientSecret = paymentIntent["client_secret"];
  res.send({ status: "success", content: clientSecret });
  return;
});

/*=========================================================================================
FUNCTIONS
=========================================================================================*/

// THE FUNCTION TO UPDATE A PROPERTY OF A 3D PRINT ORDER

const updateMakeOrder = (_id, property, value) => {
  return new Promise(async (resolve, reject) => {
    let order;
    try {
      order = await Make.findById(_id);
    } catch (error) {
      reject(error);
    }
    order[property] = value;
    let savedOrder;
    try {
      savedOrder = await order.save();
    } catch (error) {
      reject(error);
    }
    resolve(savedOrder);
  });
};

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
      reject(error);
      return;
    }
    // CALCULATE ORDER PRICE
    let price;
    try {
      price = await order.amount();
    } catch (error) {
      reject(error);
      return;
    }
    const amount = Math.floor(price.total * 100);
    // CREATE THE PAYMENT INTENT OBJECT
    const object = {
      amount,
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
