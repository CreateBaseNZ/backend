/*=========================================================================================
REQUIRED MODULES
=========================================================================================*/

const express = require("express");
const mongoose = require("mongoose");

/*=========================================================================================
VARIABLES
=========================================================================================*/

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const router = new express.Router();

/*=========================================================================================
MODELS
=========================================================================================*/

const Discount = require("../../model/Discount.js");

/*=========================================================================================
MIDDLEWARE
=========================================================================================*/

const adminAccess = (req, res, next) => {
  if (req.isAuthenticated() && req.user.type === "admin") {
    return next();
  } else {
    res.redirect("/");
  }
};

/*=========================================================================================
ROUTES
=========================================================================================*/

router.get("/admin/discount/fetch", adminAccess, async (req, res) => {
  // RETRIEVE DISCOUNTS FROM THE DATABASE
  let discounts;
  try {
    discounts = await Discount.find();
  } catch (error) {
    return res.send({ status: "failed", content: error });
  }
  // SUCCESS HANDLER
  return res.send({ status: "success", content: discounts });
});

router.post("/admin/discount/create", adminAccess, async (req, res) => {
  // CREATE THE DISCOUNT OBJECT
  const properties = {
    name: req.body.name, code: req.body.code, rate: req.body.rate,
    duration: { type: req.body.durationType, start: req.body.durationStart, end: req.body.durationEnd },
    audience: { type: req.body.audienceType }
  };
  // CREATE THE DISCOUNT INSTANCE
  let discount;
  try {
    discount = await Discount.create(properties);
  } catch (error) {
    return res.send({ status: "failed", content: error });
  }
  // SUCCESS HANDLER
  return res.send({ status: "success", content: discount });
});

/*=========================================================================================
EXPORT ROUTE
=========================================================================================*/

module.exports = router;

/*=========================================================================================
END
=========================================================================================*/
