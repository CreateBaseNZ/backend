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

/*=========================================================================================
END
=========================================================================================*/
