/*=========================================================================================
REQUIRED MODULES
=========================================================================================*/

const express = require("express");

/*=========================================================================================
VARIABLES
=========================================================================================*/

const router = new express.Router();

/*=========================================================================================
MODELS
=========================================================================================*/

const Make = require("./../model/Make.js");

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

// @route     GET /customer/orders/print/awaiting-quote
// @desc      Get customer's 3D print orders that are awaiting quotation
// @access    Private
router.get(
  "/customer/orders/print/awaiting-quote",
  restrictedPages,
  async (req, res) => {}
);

// @route     GET /customer/orders/print/checkout
// @desc      Get customer's 3D print orders that are ready for checkout
// @access    Private
router.get(
  "/customer/orders/print/checkout",
  restrictedPages,
  async (req, res) => {}
);

// @route     GET /customer/orders/marketplace/checkout
// @desc      Get customer's Marketplace orders that are ready for checkout
// @access    Private
router.get(
  "/customer/orders/marketplace/checkout",
  restrictedPages,
  async (req, res) => {}
);

/*=========================================================================================
FUNCTIONS
=========================================================================================*/

// THE FUNCTION TO FETCH THE ARRAY OF 3D PRINT ORDERS DEPENDING ON THE STATUS
const getMakeOrders = async (accountId, status) => {
  return new Promise(async (resolve, reject) => {
    // If status is provided, return the array of orders containing the given status
    if (status) {
      try {
        orders = await Make.find({ accountId, status });
        resolve(orders);
      } catch (error) {
        reject(error);
      }
    } else {
      try {
        orders = await Make.find({ accountId });
        resolve(orders);
      } catch (error) {
        reject(error);
      }
    }
  });
};

/*=========================================================================================
EXPORT ROUTE
=========================================================================================*/

module.exports = router;

/*=========================================================================================
END
=========================================================================================*/
