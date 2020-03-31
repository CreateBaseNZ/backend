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

const Order = require("./../model/Order.js");
const Make = require("./../model/Make.js");
const Item = require("./../model/Item.js");

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
  const accountId = mongoose.Types.ObjectId(req.user._id);
  let order;
  // Find an Active Order
  try {
    order = await Order.findOneByAccoundIdAndStatus(accountId, "created");
  } catch (error) {
    return res.send({ status: "failed", data: error });
  }
  // Check if no order was found
  if (!order) {
    // Create a New Order if no Active Order
    order = new Order({
      accountId
    });
    // Update status of the order
    try {
      await order.updateStatus("created");
    } catch (error) {
      return res.send({ status: "failed", data: error });
    }
    // Preset the New and Saved Shipping Address
    order.shipping.address.saved = {
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
  let itemsCheckout;

  try {
    [makesAwaitingQuote, makesCheckout, itemsCheckout] = await Promise.all([
      orderMakesAwaitingQuoteGet(accountId),
      orderMakesCheckoutGet(accountId),
      orderItemsCheckoutGet(accountId)
    ]);
  } catch (error) {
    return res.send({ status: "failed", data: error });
  }

  order.makes.awaitingQuote = makesAwaitingQuote;
  order.makes.checkout = makesCheckout;

  order.items = [];

  // Discounts

  order.discounts = [];

  // Saved Shipping Address

  // Save and Send Response

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

  return res.send({
    status: "success",
    data: {
      order: savedOrder,
      makes: { awaitingQuote: makesAwaitingQuote, checkout: makesCheckout },
      items: itemsCheckout,
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
router.post(
  "/checkout/order/update/new-shipping-address-save",
  restrictedPages,
  async (req, res) => {
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
  }
);

// @route     POST /checkout/order/update/shipping-method
// @desc
// @access    Private
router.post(
  "/checkout/order/update/shipping-method",
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
  }
);

// @route     POST /checkout/order/update/payment-method
// @desc
// @access    Private
router.post(
  "/checkout/order/update/payment-method",
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
  }
);

// @route     POST /checkout/order/validate/cart
// @desc
// @access    Private
router.post(
  "/checkout/order/validate/cart",
  restrictedPages,
  async (req, res) => {
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
  }
);

// @route     POST /checkout/order/validate/shipping
// @desc
// @access    Private
router.post(
  "/checkout/order/validate/shipping",
  restrictedPages,
  async (req, res) => {
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
  }
);

// @route     POST /checkout/order/validate/payment
// @desc
// @access    Private
router.post(
  "/checkout/order/validate/payment",
  restrictedPages,
  async (req, res) => {
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
  }
);

// @route     POST /checkout/order/delete/print
// @desc
// @access    Private
router.post(
  "/checkout/order/delete/print",
  restrictedPages,
  async (req, res) => {
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
  }
);

// @route     POST /checkout/order/paid
// @desc
// @access    Private
router.post("/checkout/order/paid", restrictedPages, async (req, res) => {
  const accountId = mongoose.Types.ObjectId(req.user._id);
  let order;
  // Find the Active Order
  try {
    order = await Order.findOneByAccoundIdAndStatus(accountId, "created");
  } catch (error) {
    return res.send({ status: "failed", data: error });
  }
  // Check if no order was found
  if (!order) {
    // Create a New Order if no Active Order
    return res.send({ status: "failed", data: "no order found" });
  }
  // Update each makes
  for (let i = 0; i < order.makes.awaitingQuote.length; i++) {
    // Get make id
    let _id = order.makes.awaitingQuote[i];
    // Get the make
    let make;
    try {
      make = await Make.findById(_id);
    } catch (error) {
      return res.send({ status: "failed", data: error });
    }
    // Update make
    try {
      await make.updateStatus("purchased");
    } catch (error) {
      return res.send({ status: "failed", data: error });
    }
  }
  // Update the order
  let updatedOrder;
  try {
    updatedOrder = await order.updateStatus("checkedout");
  } catch (error) {
    return res.send({ status: "failed", data: error });
  }
  // Success!
  return res.send({ status: "success", data: "" });
});

// @route     GET /customer/orders/print/awaiting-quote
// @desc      Get customer's 3D print orders that are awaiting quotation
// @access    Private
router.post(
  "/customer/orders/print/awaiting-quote",
  restrictedPages,
  async (req, res) => {
    let accountId = req.user._id;
    let orders;
    try {
      orders = await getMakeOrders(accountId, "awaiting quote");
    } catch {
      throw error;
    }
    return res.send(orders);
  }
);

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

router.post("/checkout/payment-intent", async (req, res) => {
  let paymentIntentObject;
  try {
    paymentIntentObject = await createPaymentIntent();
  } catch (error) {
    return res.send(error);
  }
  console.log(paymentIntentObject);
  res.send(paymentIntentObject["client_secret"]);
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

const orderMakesAwaitingQuoteSort = (makeOne, makeTwo) => {};

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

const orderMakesCheckoutSort = (makeOne, makeTwo) => {};

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

const orderItemsCheckoutSort = (itemOne, itemTwo) => {};

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

// PAYMENT AMOUNT CALCULATION

// Function to Calculate 3D Printing Orders Total Price
const calculatePrintingOrdersTotalPrice = () => {
  return new Promise(async (resolve, reject) => {});
};

// Function to Calculate Marketplace Orders Total Price
const calculateMarketplaceOrdersTotalPrice = () => {
  return new Promise(async (resolve, reject) => {});
};

// Function to Calculate Discount Rate
const calculateDiscountRate = () => {
  return new Promise(async (resolve, reject) => {});
};

// Function to Calculate Manufacturing Speed Rate
const calculateManufacturingSpeedRate = () => {
  return new Promise(async (resolve, reject) => {});
};

// Function to Calculate Shipping Cost
const calculateShippingCost = () => {
  return new Promise(async (resolve, reject) => {});
};

// Function to Calculate Order Amount
const calculateOrderAmount = () => {
  return new Promise(async (resolve, reject) => {
    resolve(100); // Temporarily just set to $1.00 NZD
  });
};

// STRIPE PAYMENT INTENT

// Details:     Create the Payment Intent Object
// Required:    amount (integer)
//              currency (string)
const createPaymentIntentObject = (userId, userEmail, shippingMethod) => {
  return new Promise(async (resolve, reject) => {
    // Declare Variables

    let amount;
    let orderNumber;

    // Set Variables

    const currency = "nzd";
    const confirm = false;
    const customer = userId;
    const payment_method_types = ["card"];
    const receipt_email = userEmail;
    const shipping = shippingMethod;

    try {
      amount = await calculateOrderAmount();
    } catch (error) {
      reject(error);
    }

    resolve({
      amount,
      currency,
      confirm,
      customer,
      payment_method_types,
      receipt_email,
      shipping,
      metadata: {
        orderNumber
      }
    });
  });
};

const createPaymentIntent = () => {
  return new Promise(async (resolve, reject) => {
    let paymentIntentObject;
    let paymentIntent;

    try {
      paymentIntentObject = await createPaymentIntentObject();
    } catch (error) {
      reject(error);
    }

    try {
      paymentIntent = await stripe.paymentIntents.create(paymentIntentObject);
    } catch (error) {
      reject(error);
    }

    resolve(paymentIntent);
  });
};

/*=========================================================================================
EXPORT ROUTE
=========================================================================================*/

module.exports = router;

/*=========================================================================================
END
=========================================================================================*/
