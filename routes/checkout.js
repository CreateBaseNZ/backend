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

  order.shipping.address.saved = {
    unit: "",
    street: {
      number: "45A",
      name: "Aranui Road"
    },
    suburb: "Mount Wellington",
    city: "Auckland",
    postcode: "1060",
    country: "New Zealand"
  };

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
    shipping: savedOrder.validateShipping()
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
    return res.send({ status: "success", data: savedOrder });
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
      shipping: savedOrder.validateShipping()
    };

    return res.send({
      status: "success",
      data: {
        order: savedOrder,
        price: {},
        validity: {}
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
      cart: savedOrder.validateCart()
    };
    // Send back a success status
    return res.send({
      status: "success",
      data: { order: savedOrder, validity }
    });
  }
);

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

/*=========================================================================================
EXPORT ROUTE
=========================================================================================*/

module.exports = router;

/*=========================================================================================
END
=========================================================================================*/
