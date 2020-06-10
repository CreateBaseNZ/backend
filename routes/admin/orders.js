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
const Customer = require("../../model/Customer.js");

/*=========================================================================================
MIDDLEWARE
=========================================================================================*/

const adminAccess = (req, res, next) => {
  const account = req.user;
  // CHECK IF USER IS LOGGED IN
  if (!req.isAuthenticated()) {
    return res.redirect("/login");
  }
  // CHECK IF USER IS NOT VERIFIED
  if (!account.verification.status) {
    return res.redirect("/verification");
  }
  // CHECK IF USER IS ADMIN
  if (account.type !== "admin") {
    return res.redirect("/");
  }
  // IF USER IS LOGGED IN, VERIFIED AND AN ADMIN
  return next();
};

const adminContent = (req, res, next) => {
  const account = req.user;
  // CHECK IF USER IS LOGGED IN
  if (!req.isAuthenticated()) {
    return res.send({ status: "failed", content: "user is not logged in" });
  }
  // CHECK IF USER IS NOT VERIFIED
  if (!account.verification.status) {
    return res.send({ status: "failed", content: "user is not verified" });
  }
  // CHECK IF USER IS ADMIN
  if (account.type !== "admin") {
    return res.send({ status: "failed", content: "user is not an admin" });
  }
  // IF USER IS LOGGED IN, VERIFIED AND AN ADMIN
  return next();
}

/*=========================================================================================
ROUTES
=========================================================================================*/

// @route     GET /admin/orders/fetch-orders
// @desc      
// @access    CONTENT - VERIFIED - ADMIN
router.get("/admin/orders/fetch-orders", adminContent, async (req, res) => {
  // FETCH ORDERS
  let orders = [];
  try {
    orders = await Order.find();
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

// @route     POST /admin/orders/update-order-status
// @desc      
// @access    CONTENT - VERIFIED - ADMIN
router.post("/admin/orders/update-order-status", adminContent, async (req, res) => {
  // DECLARE VARIABLES
  const orderId = req.body.orderId;
  const status = req.body.status;
  // FETCH ORDER
  let order;
  try {
    order = await Order.findOne({ _id: orderId });
  } catch (error) {
    return res.send({ status: "failed", content: error });
  }
  // VALIDATE ORDER
  if (!order) return res.send({ status: "failed", content: "no order found" });
  // UPDATE STATUS
  order.updateStatus(status);
  // SAVE UPDATE
  let savedOrder;
  try {
    savedOrder = await order.save();
  } catch (error) {
    return res.send({ status: "failed", content: error });
  }
  // SUCCESS HANDLER
  return res.send({ status: "success", content: savedOrder });
});

// @route     POST /admin/orders/post-comment
// @desc      
// @access    CONTENT - VERIFIED - ADMIN
router.post("/admin/orders/post-comment", adminContent, async (req, res) => {
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
  // SAVE ORDER UPDATE AND GET USER DETAILS
  const promises = [Customer.findOne({ accountId: account._id }), order.save()];
  try {
    [customer] = await Promise.all(promises);
  } catch (error) {
    return res.send({ status: "failed", content: error });
  }
  // ADD INFORMATION TO COMMENT OBJECT
  comment.author = { name: customer.displayName, picture: customer.picture };
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
