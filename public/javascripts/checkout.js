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

/*-----------------------------------------------------------------------------------------
ELEMENTS
-----------------------------------------------------------------------------------------*/

// Headings
let checkoutHeadingCart;
let checkoutHeadingShipping;
let checkoutHeadingPayment;
let checkoutHeadingCompletion;

/*=========================================================================================
FUNCTIONS
=========================================================================================*/

/*-----------------------------------------------------------------------------------------
INITIALISATION
-----------------------------------------------------------------------------------------*/

const checkoutInit = () => {
  // ELEMENTS - Headings
  checkoutHeadingCart = document.querySelector("#checkout-cart-hdng");
  checkoutHeadingShipping = document.querySelector("#checkout-shpg-hdng");
  checkoutHeadingPayment = document.querySelector("#checkout-pymt-hdng");
  checkoutHeadingCompletion = document.querySelector("#checkout-cmpt-hdng");
};

/*=========================================================================================
END
=========================================================================================*/
