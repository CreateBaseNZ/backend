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
const Discount = require("../../model/Discount.js");
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
  let order;
  // Get customer details to update saved address
  let customer;
  try {
    customer = await Customer.findOne({ accountId });
  } catch (error) {
    return res.send({ status: "failed", content: error });
  }
  // Find an Active Order
  try {
    order = await Order.findOneByAccoundIdAndStatus(accountId, "created");
  } catch (error) {
    return res.send({ status: "failed", content: error });
  }
  // Check if no order was found
  if (!order) {
    // Create a New Order if no Active Order
    order = new Order({ accountId });
    // Update status of the order
    try {
      await order.updateStatus("created");
    } catch (error) {
      return res.send({ status: "failed", content: error });
    }
    // Preset the New Shipping Address
    order.shipping.address.new = {
      unit: "",
      street: {
        number: "",
        name: ""
      },
      suburb: "",
      city: "",
      postcode: "",
      country: ""
    };
  }
  // Makes and Items
  let makesAwaitingQuote;
  let makesCheckout;
  try {
    [makesAwaitingQuote, makesCheckout] = await Promise.all([
      orderMakesAwaitingQuoteGet(accountId),
      orderMakesCheckoutGet(accountId)
    ]);
  } catch (error) {
    return res.send({ status: "failed", content: error });
  }
  order.makes.awaitingQuote = makesAwaitingQuote;
  order.makes.checkout = makesCheckout;
  // Update the Recreate the Discount Array
  // Set saved shipping address
  order.shipping.address.saved = customer.address;
  // Save and Send Response
  let savedOrder;
  try {
    savedOrder = await order.save();
  } catch (error) {
    return res.send({ status: "failed", content: error });
  }
  // Validate the checkout
  validity = {
    cart: savedOrder.validateCart(),
    shipping: savedOrder.validateShipping(),
    payment: savedOrder.validatePayment()
  };

  return res.send({
    status: "success",
    content: {
      order: savedOrder,
      makes: { awaitingQuote: makesAwaitingQuote, checkout: makesCheckout },
      validity
    }
  });
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
  valid =
    order.validateCart() &&
    order.validateShipping() &&
    order.validatePayment();
  return res.send({ status: "success", data: valid });
});

// @route     POST /checkout/order/delete/print
// @desc
// @access    Private
router.post("/checkout/order/delete/print", restrictedPages, async (req, res) => {
  // Delete the make document and the corresponding file from the database
  const accountId = mongoose.Types.ObjectId(req.user._id);
  const makeId = mongoose.Types.ObjectId(req.body.printId);
  let deletedMake;
  try {
    deletedMake = await Make.deleteByIdAndAccountId(makeId, accountId);
  } catch (error) {
    // If error was encountered, send a failed status
    return res.send({ status: "failed", data: error });
  }
  // Update the order
  let order;
  // Find an Active Order
  try {
    order = await Order.findOneByAccoundIdAndStatus(accountId, "created");
  } catch (error) {
    return res.send({ status: "failed", data: error });
  }
  // Update the Make
  let makesAwaitingQuote;
  let makesCheckout;
  try {
    [makesAwaitingQuote, makesCheckout] = await Promise.all([
      orderMakesAwaitingQuoteGet(accountId),
      orderMakesCheckoutGet(accountId)
    ]);
  } catch (error) {
    return res.send({ status: "failed", data: error });
  }
  order.makes.awaitingQuote = makesAwaitingQuote;
  order.makes.checkout = makesCheckout;
  // Save the make
  let savedOrder;
  try {
    savedOrder = await order.save();
  } catch (error) {
    return res.send({ status: "failed", data: error });
  }
  // Validate the checkout
  validity = {
    cart: savedOrder.validateCart(),
    shipping: savedOrder.validateShipping(),
    payment: savedOrder.validatePayment()
  };
  // Send back a success status
  return res.send({
    status: "success",
    data: { order: savedOrder, validity }
  });
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
  // Get the customer details
  let customer;
  try {
    customer = await Customer.findByAccountId(account);
  } catch (error) {
    res.send({ status: "failed", content: error });
    return;
  }
  // Update the customer's address
  // Check if the order's shipping address type is new
  // and if the address save option is set to true
  if (order.shipping.address.option === "new" && order.shipping.address.save) {
    customer.address = order.shipping.address.new;
  }
  // Update the user's wallet
  // Calculate Order Amounts 
  let amount;
  try {
    amount = await order.amount();
  } catch (error) {
    res.send({ status: "failed", content: error });
    return;
  }
  const creditRate = 0.05;
  const rawPayment = amount.total.total / (1 + creditRate);
  const payment = (Math.ceil(rawPayment * 100)) / 100;
  // TO DO.....
  // Create transaction instances
  // TO DO.....
  // Save customer updates
  try {
    await customer.save();
  } catch (error) {
    res.send({ status: "failed", content: error });
    return;
  }
  // Update the makes' statuses
  // Fetch the makes
  let makes = [];
  try {
    makes = await Make.find({ accountId: account, _id: order.makes.checkout });
  } catch (error) {
    res.send({ status: "failed", content: error });
    return;
  }
  // Update each make and prepare promises
  let promises = [];
  for (let i = 0; i < makes.length; i++) {
    let make = makes[i];
    make.updateStatus("purchased");
    promises.push(make.save());
  }
  // Save all makes
  try {
    await Promise.all(promises);
  } catch (error) {
    res.send({ status: "failed", content: error });
    return;
  }
  // Update Orders Payment Amount Object
  order.payment.amount.makes = amount.makes;
  order.payment.amount.manufacturing = amount.manufacturing.total;
  order.payment.amount.discount = amount.discount.total;
  order.payment.amount.gst = amount.gst.total;
  order.payment.amount.shipping = amount.shipping.total;
  order.payment.amount.total = amount.total.total;
  // Update the order's status
  try {
    await order.updateStatus("checkedout");
  } catch (error) {
    res.send({ status: "failed", content: error });
    return;
  }
  // Save the updated order
  try {
    await order.save();
  } catch (error) {
    res.send({ status: "failed", content: error });
    return;
  }
  // Return a success message
  res.send({ status: "success", content: "bank transfer processed" });
  return;
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
    res.send({ status: "failed", content: "no payment intent ID provided" });
    return;
  }
  // Retrieve payment intent
  let paymentIntent;
  try {
    paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
  } catch (error) {
    res.send({ status: "failed", content: error });
    return;
  }
  // Validate the success of the payment
  if (paymentIntent.status !== "succeeded") {
    res.send({ status: "failed", content: "payment unsuccessful" });
    return;
  }
  // UPDATE ORDER DETAILS
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
  // Update the customer's address
  // Check if the order's shipping address type is new
  // and if the address save option is set to true
  if (order.shipping.address.option === "new" && order.shipping.address.save) {
    // Get the customer details
    let customer;
    try {
      customer = await Customer.findByAccountId(account);
    } catch (error) {
      res.send({ status: "failed", content: error });
      return;
    }
    customer.address = order.shipping.address.new;
    // Save customer updates
    try {
      await customer.save();
    } catch (error) {
      res.send({ status: "failed", content: error });
      return;
    }
  }
  // Update the makes' statuses
  // Fetch the makes
  let makes = [];
  try {
    makes = await Make.find({ accountId: account, _id: order.makes.checkout });
  } catch (error) {
    res.send({ status: "failed", content: error });
    return;
  }
  // Update each make and prepare promises
  let promises = [];
  for (let i = 0; i < makes.length; i++) {
    let make = makes[i];
    make.updateStatus("purchased");
    promises.push(make.save());
  }
  // Save all makes
  try {
    await Promise.all(promises);
  } catch (error) {
    res.send({ status: "failed", content: error });
    return;
  }
  // Calculate Order Amounts and Update Orders Payment Amount Object
  let amount;
  try {
    amount = await order.amount();
  } catch (error) {
    res.send({ status: "failed", content: error });
    return;
  }
  order.payment.amount.makes = amount.makes;
  order.payment.amount.manufacturing = amount.manufacturing.total;
  order.payment.amount.discount = amount.discount.total;
  order.payment.amount.gst = amount.gst.total;
  order.payment.amount.shipping = amount.shipping.total;
  order.payment.amount.total = amount.total.total;
  // TO DO.....
  // Create transaction instances
  // TO DO.....
  // Update the order's status
  try {
    await order.updateStatus("checkedout");
  } catch (error) {
    res.send({ status: "failed", content: error });
    return;
  }
  // Save the updated order
  try {
    await order.save();
  } catch (error) {
    res.send({ status: "failed", content: error });
    return;
  }
  // Return a success message
  res.send({ status: "success", content: "card payment processed" });
  return;
})

// @route     GET /customer/orders/print/awaiting-quote
// @desc      Get customer's 3D print orders that are awaiting quotation
// @access    Private
router.post("/customer/orders/print/awaiting-quote", restrictedPages, async (req, res) => {
  let accountId = req.user._id;
  let orders;
  try {
    orders = await getMakeOrders(accountId, "awaiting quote");
  } catch {
    throw error;
  }
  return res.send(orders);
});

// @route     GET /customer/orders/print/checkout
// @desc      Get customer's 3D print orders that are ready for checkout
// @access    Private
router.post(
  "/customer/orders/print/checkout",
  restrictedPages,
  async (req, res) => {
    let accountId = req.user._id;
    let orders;
    try {
      orders = await getMakeOrders(accountId, "checkout");
    } catch {
      throw error;
    }
    return res.send(orders);
  }
);

// @route     GET /customer/orders/marketplace/checkout
// @desc      Get customer's Marketplace orders that are ready for checkout
// @access    Private
router.post(
  "/customer/orders/marketplace/checkout",
  restrictedPages,
  async (req, res) => {
    let accountId = req.user._id;
    let orders;
    try {
      orders = await getPurchaseOrders(accountId, "checkout");
    } catch {
      throw error;
    }
    return res.send(orders);
  }
);

// @route     GET /orders/print/update
// @desc      Update the quantity of the 3D print order
// @access    Private
router.post("/orders/print/update", restrictedPages, async (req, res) => {
  let printId = mongoose.Types.ObjectId(req.body.printId);
  let printQuantity = req.body.quantity;
  let order;
  try {
    order = (
      await updateMakeOrder(printId, "quantity", printQuantity)
    ).toJSON();
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

const orderMakesAwaitingQuoteGet = accountId => {
  return new Promise(async (resolve, reject) => {
    let makes;

    try {
      makes = await Make.findByAccountIdAndStatus(accountId, "awaitingQuote");
    } catch (error) {
      reject(error);
    }

    // makes.sort(orderMakesAwaitingQuoteSort);

    resolve(makes);
  });
};

const orderMakesAwaitingQuoteSort = (makeOne, makeTwo) => { };

const orderMakesCheckoutGet = accountId => {
  return new Promise(async (resolve, reject) => {
    let makes;

    try {
      makes = await Make.findByAccountIdAndStatus(accountId, "checkout");
    } catch (error) {
      reject(error);
    }

    // makes.sort(orderMakesCheckoutSort);

    resolve(makes);
  });
};

const orderMakesCheckoutSort = (makeOne, makeTwo) => { };

const orderItemsCheckoutGet = accountId => {
  return new Promise(async (resolve, reject) => {
    let items;

    try {
      items = await Item.findByAccountIdAndStatus(accountId, "checkout");
    } catch (error) {
      reject(error);
    }

    // items.sort(orderItemsCheckoutSort);

    resolve(items);
  });
};

const orderItemsCheckoutSort = (itemOne, itemTwo) => { };

// THE FUNCTION TO FETCH THE ARRAY OF 3D PRINT ORDERS DEPENDING ON THE STATUS

const getMakeOrders = (accountId, status) => {
  return new Promise(async (resolve, reject) => {
    let orders;
    // If status is provided, return the array of orders containing the given status
    if (status) {
      try {
        orders = await Make.find({ accountId, status });
      } catch (error) {
        reject(error);
      }
    } else {
      try {
        orders = await Make.find({ accountId });
      } catch (error) {
        reject(error);
      }
    }
    let revisedOrders = [];
    for (let i = 0; i < orders.length; i++) {
      const order = orders[i].toJSON();
      let fileName;
      try {
        fileName = await getFileName(order.fileId);
      } catch (error) {
        reject(error);
      }
      revisedOrders[i] = { ...order, ...{ fileName } };
    }
    resolve(revisedOrders);
  });
};

// THE FUNCTION TO FETCH THE ARRAY OF MARKETPLACE ORDERS DEPENDING ON THE STATUS

const getPurchaseOrders = (accountId, status) => {
  return new Promise(async (resolve, reject) => {
    let orders;
    // If status is provided, return the array of orders containing the given status
    if (status) {
      try {
        orders = await Purchase.find({ accountId, status });
      } catch (error) {
        reject(error);
      }
    } else {
      try {
        orders = await Purchase.find({ accountId });
      } catch (error) {
        reject(error);
      }
    }
    resolve(orders);
  });
};

// THE FUNCTION TO FETCH THE NAME OF THE FILE

const getFileName = _id => {
  return new Promise(async (resolve, reject) => {
    let fileName;
    try {
      fileName = (await GridFS.files.findOne({ _id }))["filename"];
    } catch (error) {
      reject(error);
    }
    resolve(fileName);
  });
};

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
