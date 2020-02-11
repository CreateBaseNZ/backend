/*=========================================================================================
VARIABLES
=========================================================================================*/

// Track the current page the user is on
let selectedCheckoutSubPage = 1;
// Track the validity of the checkout process
let checkoutValidity = {
  cart: false,
  shipping: false,
  payment: false
};
let stripe;
let elements;

/*-----------------------------------------------------------------------------------------
ELEMENTS
-----------------------------------------------------------------------------------------*/

// Headings
let checkoutHeadingCart;
let checkoutHeadingShipping;
let checkoutHeadingPayment;
let checkoutHeadingCompletion;
// Card Details
let cardNumber;
let cardExpiry;
let cardCvc;

/*=========================================================================================
FUNCTIONS
=========================================================================================*/

/*-----------------------------------------------------------------------------------------
INITIALISATION
-----------------------------------------------------------------------------------------*/

const checkoutInit = () => {
  // Stripe
  stripe = Stripe("pk_test_cyWnxjuNQGbF42g88sLseXpJ003JGn4TCC");
  elements = stripe.elements();
  cardNumber = elements.create("cardNumber");
  cardNumber.mount("#checkout-card-num");
  cardExpiry = elements.create("cardExpiry");
  cardExpiry.mount("#checkout-card-exp");
  cardCvc = elements.create("cardCvc");
  cardCvc.mount("#checkout-card-cvc");
  // ELEMENTS - Headings
  checkoutHeadingCart = document.querySelector("#checkout-cart-hdng");
  checkoutHeadingShipping = document.querySelector("#checkout-shpg-hdng");
  checkoutHeadingPayment = document.querySelector("#checkout-pymt-hdng");
  checkoutHeadingCompletion = document.querySelector("#checkout-cmpt-hdng");
};

/*-----------------------------------------------------------------------------------------
CART FUNCTIONS
-----------------------------------------------------------------------------------------*/

// FUNCTION TO LOAD THE 3D PRINT ORDERS FROM THE DATABASE

const checkoutCartLoad3dPrintOrders = async () => {};

// FUNCTION TO LOAD THE MARKETPLACE ORDERS FROM THE DATABASE

const checkoutCartLoadMarketplaceOrders = async () => {};

// FUNCTION TO

/*-----------------------------------------------------------------------------------------
CREATE PAYMENT INTENT AND GET CLIENT SECRET
-----------------------------------------------------------------------------------------*/

const checkoutPaymentIntent = () => {
  return new Promise(async (resolve, reject) => {
    let clientSecret;

    try {
      clientSecret = await axios.post("/checkout/payment-intent", "Pay");
      resolve(clientSecret.data);
    } catch (error) {
      reject(error);
    }
  });
};

/*-----------------------------------------------------------------------------------------
PROCESS PAYMENT
-----------------------------------------------------------------------------------------*/

const processCardPayment = clientSecret => {
  return new Promise(async (resolve, reject) => {
    let result;

    try {
      result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardNumber,
          billing_details: {
            name: "test test"
          }
        }
      });

      if (result.error) {
        reject(result.error.message);
      } else {
        resolve(result.paymentIntent);
      }
    } catch (error) {
      reject(error);
    }
  });
};

/*-----------------------------------------------------------------------------------------
PROCEED WITH PAYMENT
-----------------------------------------------------------------------------------------*/

const checkoutPay = async () => {
  let clientSecret;
  let payment;

  try {
    clientSecret = await checkoutPaymentIntent();
  } catch (error) {
    return console.log(error);
  }

  try {
    payment = await processCardPayment(clientSecret);
  } catch (error) {
    return console.log(error);
  }

  console.log(payment["status"]);
};

/*=========================================================================================
END
=========================================================================================*/
