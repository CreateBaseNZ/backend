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

  // LOAD ORDERS
  checkoutCartLoadOrders();
};

/*-----------------------------------------------------------------------------------------
CART FUNCTIONS
-----------------------------------------------------------------------------------------*/

// FUNCTION TO GET THE 3D PRINT ORDERS FROM THE DATABASE

const checkoutCartGet3dPrintOrders = () => {
  return new Promise(async (resolve, reject) => {
    let prints = [];
    let printsAwaitingQuote = [];
    let printsCheckout = [];

    try {
      printsAwaitingQuote = (
        await axios.post("/customer/orders/print/awaiting-quote")
      )["data"];
    } catch (error) {
      reject(error);
    }

    try {
      printsCheckout = (await axios.post("/customer/orders/print/checkout"))[
        "data"
      ];
    } catch (error) {
      reject(error);
    }

    prints = printsAwaitingQuote.concat(printsCheckout);

    resolve(prints);
  });
};

// FUNCTION TO GET THE MARKETPLACE ORDERS FROM THE DATABASE

const checkoutCartGetMarketplaceOrders = () => {
  return new Promise(async (resolve, reject) => {
    let items;

    try {
      items = (await axios.post("/customer/orders/marketplace/checkout"))[
        "data"
      ];
    } catch (error) {
      reject(error);
    }

    resolve(items);
  });
};

// FUNCTION TO CREATE THE HTML FOR 3D PRINT ORDERS

const checkoutCartCreate3dPrintOrderHTML = print => {
  // Container One
  const icon = `<div class="checkout-prnt-cnt-img bgd-clr-wht-2"></div>`;
  const containerOne = `<div class="checkout-prnt-cnt-cntn-1">${icon}</div>`;

  // Container Two
  const fileName = `<div class="checkout-prnt-cnt-file-name sbtl-1 txt-clr-blk-2">${print.fileName}</div>`;
  const buildType = `<div class="checkout-prnt-cnt-bld-type sbtl-1 txt-clr-blk-2">${print.build}</div>`;
  const colour = `<div class="checkout-prnt-cnt-clr sbtl-1 txt-clr-blk-2">${print.colour}</div>`;
  const quantity = `<div class="checkout-prnt-cnt-qnty-cntn">
                      <label
                        class="checkout-prnt-cnt-qnty-lbl sbtl-1 txt-clr-blk-2"
                        >Quantity:</label
                      >
                      <input
                        type="number"
                        name="quantity"
                        class="checkout-prnt-cnt-qnty inp-txt-2 sbtl-1 txt-clr-blk-2"
                        value="${print.quantity}"
                        onchange="checkoutCartUpdate3dPrintOrderQuantity(this.value, ${print});"
                      />
                    </div>`;
  const containerTwo = `<div class="checkout-prnt-cnt-cntn-2">${fileName +
    buildType +
    colour +
    quantity}</div>`;

  // Container Three
  const cancel = `<div class="checkout-prnt-cnt-cncl"></div>`;
  let price;
  if (print.status === "awaiting quote") {
    price = `<div class="checkout-prnt-cnt-prc sbtl-1 txt-clr-blk-2">awaiting quote</div>`;
  } else {
    price = `<div class="checkout-prnt-cnt-prc sbtl-1 txt-clr-blk-2">${print.price}</div>`;
  }
  const containerThree = `<div class="checkout-prnt-cnt-cntn-3">${cancel +
    price}</div>`;

  const containers = containerOne + containerTwo + containerThree;
  return containers;
};

// FUNCTION TO UPDATE THE HTML FOR 3D PRINT ORDERS

const checkoutCartUpdate3dPrintOrderHTML = print => {
  const containers = checkoutCartCreate3dPrintOrderHTML(print);
  document.querySelector(`#checkout-prnt-${print._id}`).innerHTML = containers;
};

// FUNCTION TO LOAD ORDERS

const checkoutCartLoadOrders = async () => {
  let prints;
  let items;

  try {
    prints = await checkoutCartGet3dPrintOrders();
  } catch (error) {
    return error;
  }

  try {
    items = await checkoutCartGetMarketplaceOrders();
  } catch (error) {
    return error;
  }

  if (prints.length) {
    document.querySelector("#checkout-prnt-cnts").innerHTML = "";
    for (let i = 0; i < prints.length; i++) {
      const print = prints[i];
      const containers = checkoutCartCreate3dPrintOrderHTML(print);
      const html = `<div class="checkout-prnt-cnt" id="checkout-prnt-${print._id}">${containers}</div>`;
      document
        .querySelector("#checkout-prnt-cnts")
        .insertAdjacentHTML("beforeend", html);
    }
  } else {
    document.querySelector("#checkout-prnt-cnts").innerHTML = "No 3D Prints";
  }
};

// FUNCTION TO UPDATE THE NUMBER UNITS

const checkoutCartUpdate3dPrintOrderQuantity = (units, print) => {
  console.log(units, print);
};

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
