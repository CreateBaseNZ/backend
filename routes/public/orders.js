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

const Order = require("../../model/Order.js");
const Comment = require("../../model/Comment.js");

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

const restrictedAccess = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return res.redirect("/login");
  }
};

const verifiedContent = (req, res, next) => {
  const account = req.user;
  // CHECK IF USER IS LOGGED IN
  if (!req.isAuthenticated()) {
    return res.send({ status: "failed", content: "customer is not logged in" });
  }
  // CHECK IF USER IS NOT VERIFIED
  if (!account.verification.status) {
    return res.send({ status: "failed", content: "customer is not verified" });
  }
  // IF USER IS LOGGED IN AND VERIFIED
  return next();
}

/*=========================================================================================
ROUTES
=========================================================================================*/

// @route     GET /orders/fetch-orders
// @desc      
// @access    CONTENT - VERIFIED
router.get("/orders/fetch-orders", verifiedContent, async (req, res) => {
  // DECLARE VARIABLES
  const account = req.user;
  // FETCH ORDER
  let orders = [];
  try {
    orders = await Order.find({ accountId: account._id });
  } catch (error) {
    return res.send({ status: "failed", content: error });
  }
  // FETCH COMMENTS
  let comments = [];
  // TO DO .....
  // FETCH COMMENTS
  // TO DO .....
  // SUCCESS HANDLER
  return res.send({ status: "success", content: { orders, comments } });
});

// @route     POST /orders/post-comment
// @desc      
// @access    CONTENT - VERIFIED
router.post("/orders/post-comment", verifiedContent, async (req, res) => {
  // DECLARE VARIABLES
  const account = req.user;
  const orderId = req.body.orderId;
  const message = req.body.message;
  // FETCH ORDER
  let order;
  try {
    order = await Order.findOne({ _id: orderId });
  } catch (error) {
    return res.send({ status: "failed", content: error });
  }
  // CREATE NEW COMMENT
  let comment;
  try {
    comment = await Comment.create(account._id, message);
  } catch (error) {
    return res.send({ status: "failed", content: error });
  }
  // UPDATE ORDER COMMENTS
  order.comments.push(comment._id);
  // SAVE ORDER UPDATE
  try {
    await order.save();
  } catch (error) {
    return res.send({ status: "failed", content: error });
  }
  // SUCCESS HANDLER
  return res.send({ status: "success", content: { comment } });
});

/* ----------------------------------------------------------------------------------------
CHECKED OUT/VALIDATING
---------------------------------------------------------------------------------------- */

/* ----------------------------------------------------------------------------------------
VALIDATED/BUILDING
---------------------------------------------------------------------------------------- */

/* ----------------------------------------------------------------------------------------
BUILT/PREPARING FOR SHIPPING
---------------------------------------------------------------------------------------- */

/* ----------------------------------------------------------------------------------------
SHIPPED/ON COURIER
---------------------------------------------------------------------------------------- */

/* ----------------------------------------------------------------------------------------
ARRIVED/WAITING FOR REVIEW
---------------------------------------------------------------------------------------- */

/* ----------------------------------------------------------------------------------------
REVIEWED/FINALISING
---------------------------------------------------------------------------------------- */

/* ----------------------------------------------------------------------------------------
COMPLETED
---------------------------------------------------------------------------------------- */

/*=========================================================================================
EXPORT ROUTE
=========================================================================================*/

module.exports = router;

/*=========================================================================================
END
=========================================================================================*/
