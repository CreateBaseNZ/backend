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
  // IF USER IS NOT LOGGED IN
  if (!req.isAuthenticated()) {
    return res.sendFile("login.html", customerRouteOptions);
  }
  // IF USER IS NOT VERIFIED
  if (!req.user.verification.status) {
    return res.redirect("/verification");
  }
  // SUCCESS HANDLER
  return next();
};

const verifiedContent = (req, res, next) => {
  const account = req.user;
  // CHECK IF USER IS LOGGED IN
  if (!req.isAuthenticated()) {
    return res.send({ status: "failed", content: "user is not logged in" });
  }
  // CHECK IF USER IS NOT VERIFIED
  if (!account.verification.status) {
    return res.send({ status: "failed", content: "user is not verified" });
  }
  // SUCCESS HANDLER
  return next();
};

const restrictedAccess = (req, res, next) => {
  // IF USER IS NOT LOGGED IN
  if (!req.isAuthenticated()) {
    return res.sendFile("login.html", customerRouteOptions);
  }
  // SUCCESS HANDLER
  return next();
};

const restrictedContent = (req, res, next) => {
  const account = req.user;
  // CHECK IF USER IS LOGGED IN
  if (!req.isAuthenticated()) {
    return res.send({ status: "failed", content: "user is not logged in" });
  }
  // SUCCESS HANDLER
  return next();
};

const unrestrictedAccess = (req, res, next) => {
  if (req.isAuthenticated()) {
    // TO DO .....
    // REDIRECT TO ALREADY LOGGED IN PAGE
    // TO DO .....
    return res.redirect("/"); // TEMPORARILY SEND THEM BACK HOME
  } else {
    return next();
  }
};

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
  const query = {
    accountId: account._id, status: ["checkedout", "validated", "built",
      "shipped", "arrived", "reviewed", "completed", "cancelled"]
  };
  let orders;
  try {
    orders = await Order.fetch(query, true, true);
  } catch (error) {
    return res.send(error);
  }
  // SUCCESS HANDLER
  return res.send({ status: "succeeded", content: orders });
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
    return res.send({ status: "error", content: error });
  }
  // CREATE NEW COMMENT
  let comment = { accountId: account._id, message };
  try {
    comment = await Comment.build(comment, false);
  } catch (error) {
    return res.send(error);
  }
  // UPDATE ORDER COMMENTS
  order.comments.push(comment._id);
  // SAVE ORDER UPDATE AND GET USER DETAILS
  const promises = [Customer.findOne({ accountId: account._id }), order.save(), comment.save()];
  let customer;
  try {
    [customer] = await Promise.all(promises);
  } catch (error) {
    return res.send({ status: "failed", content: error });
  }
  comment = comment.toObject();
  // ADD INFORMATION TO COMMENT OBJECT
  comment.author = { id: account._id, name: customer.displayName, picture: customer.picture };
  // SUCCESS HANDLER
  return res.send({ status: "succeeded", content: comment });
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
