/*=========================================================================================
REQUIRED MODULES
=========================================================================================*/

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

/*=========================================================================================
VARIABLES
=========================================================================================*/

const router = new express.Router();

/*=========================================================================================
MODELS
=========================================================================================*/

/*=========================================================================================
MIDDLEWARE
=========================================================================================*/

/*=========================================================================================
ROUTES
=========================================================================================*/

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

/*-----------------------------------------------------------------------------------------
PAYMENT AMOUNT CALCULATION
-----------------------------------------------------------------------------------------*/

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

/*-----------------------------------------------------------------------------------------
STRIPE PAYMENT INTENT
-----------------------------------------------------------------------------------------*/

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
