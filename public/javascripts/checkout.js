/*=========================================================================================
NEW VERSION
=========================================================================================*/

/*=========================================================================================
VARIABLES
=========================================================================================*/

// Track the current page the user is on
let numberOfPrints;
let numberOfItems;

/*-----------------------------------------------------------------------------------------
ELEMENTS
-----------------------------------------------------------------------------------------*/

let checkout = {
  // VARIABLES
  element: {
    heading: {
      cart: undefined,
      shipping: undefined,
      payment: undefined
    },
    button: {
      cart: {
        next: undefined
      },
      shipping: {
        back: undefined,
        next: undefined
      },
      payment: {
        bank: {
          back: undefined,
          paid: undefined
        },
        card: {
          back: undefined,
          pay: undefined
        }
      }
    },
    navigation: {
      cart: undefined,
      shipping: undefined,
      payment: undefined
    },
    windowSize: undefined
  },
  // FUNCTIONS
  initialise: undefined, // checkout.initialise
  fetch: undefined, // checkout.fetch
  insert: undefined, // checkout.insert
  load: undefined, // checkout.load
  listener: undefined, // checkout.listener
  elements: {
    assign: undefined // checkout.elements.assign
  },
  cart: {
    prints: {
      fetch: undefined, // checkout.cart.prints.fetch
      insert: undefined, // checkout.cart.prints.insert
      load: undefined, // checkout.cart.prints.load
      resize: undefined // checkout.cart.prints.resize
    },
    print: {
      create: undefined, // checkout.cart.print.create
      insert: undefined, // checkout.cart.print.insert
      update: undefined, // checkout.cart.print.update
      validate: {
        quantity: undefined // checkout.cart.print.validate.quantity
      },
      delete: undefined // checkout.cart.print.delete
    },
    items: {
      fetch: undefined, // checkout.cart.items.fetch
      insert: undefined, // checkout.cart.items.insert
      load: undefined, // checkout.cart.items.load
      resize: undefined
    },
    item: {
      create: undefined, // checkout.cart.item.create
      insert: undefined, // checkout.cart.item.insert
      delete: undefined // checkout.cart.item.delete
    },
    discounts: {},
    discount: {
      add: undefined, // checkout.cart.discount.add
      insert: undefined, // checkout.cart.discount.insert
      validate: undefined // checkout.cart.discount.validate
    },
    manufacturingSpeed: {
      select: undefined // checkout.cart.manufacturingSpeed.select
    },
    validation: {
      validate: undefined, // checkout.cart.validation.validate
      valid: undefined, // checkout.cart.validation.valid
      invalid: undefined // checkout.cart.validate.invalid
    },
    show: undefined, // checkout.cart.show
    resize: undefined // checkout.cart.resize
  },
  shipping: {
    address: {
      select: undefined, // checkout.shipping.address.select
      saved: {
        show: undefined
      },
      new: {
        validate: {
          unit: undefined, // checkout.shipping.address.new.validate.unit
          street: {
            number: undefined, // checkout.shipping.address.new.validate.street.number
            name: undefined // checkout.shipping.address.new.validate.street.name
          },
          suburb: undefined, // checkout.shipping.address.new.validate.suburb
          city: undefined, // checkout.shipping.address.new.validate.city
          postcode: undefined, // checkout.shipping.address.new.validate.postcode
          country: undefined, // checkout.shipping.address.new.validate.country
          all: undefined // checkout.shipping.address.new.validate.all
        },
        show: undefined
      }
    },
    method: {
      select: undefined
    },
    validation: {
      validate: undefined,
      valid: undefined,
      invalid: undefined
    },
    show: undefined,
    resize: undefined // checkout.shipping.resize
  },
  payment: {
    stripe: {
      initialise: undefined,
      element: {
        stripe: undefined,
        elements: undefined,
        card: {
          number: undefined,
          expiry: undefined,
          cvc: undefined
        }
      }
    },
    method: {
      select: undefined,
      bank: {
        show: undefined
      },
      card: {
        pay: undefined,
        paymentIntent: undefined,
        process: undefined,
        show: undefined
      }
    },
    validation: {
      validate: undefined,
      valid: undefined,
      invalid: undefined
    },
    show: undefined
  },
  navigation: {
    navigate: undefined, // checkout.navigation.navigate
    changeCSS: {
      page: undefined, // checkout.navigation.changeCSS.page
      navigation: undefined // checkout.navigation.changeCSS.navigation
    }
  }
};

/*=========================================================================================
FUNCTIONS
=========================================================================================*/

// @FUNC  checkout.initialise
// @TYPE
// @DESC
// @ARGU
checkout.initialise = async () => {
  // Stripe
  checkout.payment.stripe.initialise();
  checkout.elements.assign();
  // LOAD ORDER DETAILS
  checkout.load();
  // Event Listener
  checkout.listener();
};

// @FUNC  checkout.fetch
// @TYPE
// @DESC
// @ARGU
checkout.fetch = () => {
  return new Promise(async (resolve, reject) => {
    let order;

    try {
      order = (await axios.post("/checkout/order"))["data"];
    } catch (error) {
      reject(error);
    }

    if (order.status == "failed") {
      reject(order.data);
    }

    resolve(order.data);
  });
};

// @FUNC  checkout.insert
// @TYPE
// @DESC
// @ARGU
checkout.insert = object => {
  // MAKES
  const makes = object.makes;
  checkout.cart.prints.insert(makes);
  // ITEMS
  const items = object.items;
  checkout.cart.items.insert(items);
  // MANUFACTURING SPEED
  const manufacturingSpeed = object.order.manufacturingSpeed;
  if (manufacturingSpeed == "normal") {
    document.querySelector("#checkout-mnft-spd-opt-nrml").checked = true;
  } else if (manufacturingSpeed == "urgent") {
    document.querySelector("#checkout-mnft-spd-opt-urgt").checked = true;
  }
};

// @FUNC  checkout.load
// @TYPE
// @DESC
// @ARGU
checkout.load = async () => {
  let object;

  try {
    object = await checkout.fetch();
  } catch (error) {
    console.log(error);
    return;
  }

  checkout.insert(object);
  // Perform Validation
  checkout.cart.validation.validate(object.validity);
  return;
};

// @FUNC  checkout.listener
// @TYPE
// @DESC
// @ARGU
checkout.listener = () => {
  checkout.element.heading.cart.addEventListener("click", checkout.cart.show);
  checkout.element.navigation.cart.addEventListener(
    "click",
    checkout.cart.show
  );
  checkout.element.button.shipping.back.addEventListener(
    "click",
    checkout.cart.show
  );
  checkout.element.button.payment.bank.back.addEventListener(
    "click",
    checkout.shipping.show
  );
  checkout.element.button.payment.card.back.addEventListener(
    "click",
    checkout.shipping.show
  );
  checkout.element.windowSize.addListener(checkout.cart.prints.resize);
  checkout.element.windowSize.addListener(checkout.cart.items.resize);
  checkout.element.windowSize.addListener(checkout.cart.resize);
};

// @FUNC  checkout.elements.assign
// @TYPE
// @DESC
// @ARGU
checkout.elements.assign = () => {
  checkout.element.heading.cart = document.querySelector("#checkout-cart-hdng");
  checkout.element.heading.shipping = document.querySelector(
    "#checkout-shpg-hdng"
  );
  checkout.element.heading.payment = document.querySelector(
    "#checkout-pymt-hdng"
  );
  checkout.element.navigation.cart = document.querySelector(
    "#checkout-navigation-cart"
  );
  checkout.element.navigation.shipping = document.querySelector(
    "#checkout-navigation-shipping"
  );
  checkout.element.navigation.payment = document.querySelector(
    "#checkout-navigation-payment"
  );
  checkout.element.button.cart.next = document.querySelector(
    "#checkout-element-button-cart-next"
  );
  checkout.element.button.shipping.back = document.querySelector(
    "#checkout-element-button-shipping-back"
  );
  checkout.element.button.shipping.next = document.querySelector(
    "#checkout-element-button-shipping-next"
  );
  checkout.element.button.payment.bank.back = document.querySelector(
    "#checkout-element-button-payment-bank-back"
  );
  checkout.element.button.payment.bank.paid = document.querySelector(
    "#checkout-element-button-payment-bank-paid"
  );
  checkout.element.button.payment.card.back = document.querySelector(
    "#checkout-element-button-payment-card-back"
  );
  checkout.element.button.payment.card.pay = document.querySelector(
    "#checkout-element-button-payment-card-pay"
  );
  checkout.element.windowSize = window.matchMedia("(min-width: 850px)");
};

/*-----------------------------------------------------------------------------------------
CART
-----------------------------------------------------------------------------------------*/

// @FUNC  checkout.cart.prints.fetch
// @TYPE  PROMISE ASYNCHRONOUS
// @DESC
// @ARGU
checkout.cart.prints.fetch = () => {
  return new Promise(async (resolve, reject) => {
    let awaitingQuote = [];
    let checkout = [];

    try {
      awaitingQuote = (
        await axios.post("/customer/orders/print/awaiting-quote")
      )["data"];
    } catch (error) {
      reject(error);
    }

    try {
      checkout = (await axios.post("/customer/orders/print/checkout"))["data"];
    } catch (error) {
      reject(error);
    }

    resolve({ awaitingQuote, checkout });
  });
};

// @FUNC  checkout.cart.prints.insert
// @TYPE  SIMPLE
// @DESC
// @ARGU
checkout.cart.prints.insert = object => {
  if (object) {
    const makes = object.awaitingQuote.concat(object.checkout);
    numberOfPrints = makes.length;
    if (numberOfPrints) {
      // If there are prints ordered
      document.querySelector("#checkout-prnt-cnts").innerHTML = "";
      for (let i = 0; i < numberOfPrints; i++) {
        checkout.cart.print.insert(makes[i]);
      }
    } else {
      // If there are no prints ordered
      document.querySelector("#checkout-prnt-cnts").innerHTML =
        "<p>No 3D Prints</p>";
    }
  } else {
    if (!numberOfPrints) {
      document.querySelector("#checkout-prnt-cnts").innerHTML =
        "<p>No 3D Prints</p>";
    } else {
    }
  }
  checkout.cart.prints.resize();
  checkout.cart.resize();
};

// @FUNC  checkout.cart.prints.load
// @TYPE  SIMPLE
// @DESC
// @ARGU
checkout.cart.prints.load = async () => {
  let object;

  try {
    object = await checkout.cart.prints.fetch();
  } catch (error) {
    return error;
  }

  checkout.cart.prints.insert(object);
};

// @FUNC  checkout.cart.prints.resize
// @TYPE
// @DESC
// @ARGU
checkout.cart.prints.resize = () => {
  if (checkout.element.windowSize.matches) {
    if (numberOfPrints) {
      document.querySelector("#checkout-prnt-cnts").style = `height: ${10 *
        numberOfPrints}vmax`;
    } else {
      document.querySelector("#checkout-prnt-cnts").style = `height: 10vmax`;
    }
  } else {
    if (numberOfPrints) {
      document.querySelector("#checkout-prnt-cnts").style = `height: ${16 *
        numberOfPrints}vmax`;
    } else {
      document.querySelector("#checkout-prnt-cnts").style = `height: 16vmax`;
    }
  }
};

// @FUNC  checkout.cart.print.create
// @TYPE  SIMPLE
// @DESC
// @ARGU
checkout.cart.print.create = print => {
  const printId = String(print._id);
  // Container One
  const icon = `<div class="checkout-prnt-cnt-img bgd-clr-wht-2"></div>`;
  const containerOne = `<div class="checkout-prnt-cnt-cntn-1">${icon}</div>`;

  // Container Two
  const fileName = `<a href="/files/download/${print.file.id}" class="rmv-a-css checkout-prnt-cnt-file-name sbtl-1 txt-clr-blk-2">${print.file.name}</a>`;
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
                        id="checkout-prnt-qnty-${printId}"
                        class="checkout-prnt-cnt-qnty inp-txt-2 sbtl-1 txt-clr-blk-2"
                        min="1"
                        value="${print.quantity}"
                        onchange="checkout.cart.print.update(this.value, '${print.quantity}', 'quantity', '${printId}');"
                      />
                    </div>`;
  const containerTwo = `<div class="checkout-prnt-cnt-cntn-2">${fileName +
    buildType +
    colour +
    quantity}</div>`;

  // Container Three
  const cancel = `<div class="checkout-delete" onclick="checkout.cart.print.delete('${printId}');"></div>`;
  let price;
  price = `<div class="checkout-mkpl-cnt-prc sbtl-1 txt-clr-blk-2">
              $X,XXX.XX
          </div>`;
  if (print.status === "awaitingQuote") {
    price = `<div class="checkout-prnt-cnt-prc sbtl-1 txt-clr-blk-2">awaiting quote</div>`;
  } else {
    price = `<div class="checkout-prnt-cnt-prc sbtl-1 txt-clr-blk-2">${print.price}</div>`;
  }
  const containerThree = `<div class="checkout-prnt-cnt-cntn-3">${cancel +
    price}</div>`;

  const containers = containerOne + containerTwo + containerThree;
  return containers;
};

// @FUNC  checkout.cart.print.insert
// @TYPE  SIMPLE
// @DESC
// @ARGU
checkout.cart.print.insert = (print, element) => {
  const containers = checkout.cart.print.create(print);
  if (element) {
    element.innerHTML = containers;
  } else {
    const html = `<div class="checkout-prnt-cnt" id="checkout-prnt-${print._id}">${containers}</div>`;
    document
      .querySelector("#checkout-prnt-cnts")
      .insertAdjacentHTML("beforeend", html);
  }
};

// @FUNC  checkout.cart.print.update
// @TYPE  SIMPLE
// @DESC
// @ARGU
checkout.cart.print.update = async (newValue, oldValue, property, printId) => {
  if (!checkout.cart.print.validate[property](newValue, oldValue, printId)) {
    return;
  }

  document.querySelector(
    `#checkout-prnt-${printId}`
  ).innerHTML = `<div class="checkout-cart-loading-container">
                  <div class="checkout-cart-loading">
                    <div class="loading-icon">
                      <div class="layer layer-1"></div>
                      <div class="layer layer-2"></div>
                      <div class="layer layer-3"></div>
                    </div>
                  </div>
                </div>`;

  let print;

  try {
    print = (
      await axios.post("/orders/print/update", {
        printId,
        quantity: newValue
      })
    )["data"];
  } catch (error) {
    return {
      status: "failed",
      message: error
    };
  }

  checkout.cart.print.insert(
    print,
    document.querySelector(`#checkout-prnt-${print._id}`)
  );
};

// @FUNC  checkout.cart.print.validate.quantity
// @TYPE  SIMPLE
// @DESC
// @ARGU
checkout.cart.print.validate.quantity = (newValue, oldValue, printId) => {
  if (newValue <= 0) {
    document.querySelector(`#checkout-prnt-qnty-${printId}`).value = oldValue;
    return false;
  }
  return true;
};

// @FUNC  checkout.cart.print.delete
// @TYPE  ASYNCHRONOUS
// @DESC
// @ARGU
checkout.cart.print.delete = async printId => {
  // Remove the 3D print from the cart
  document.querySelector(`#checkout-prnt-${printId}`).remove();
  // Reduce the number of 3D prints listed
  numberOfPrints = numberOfPrints - 1;
  checkout.cart.prints.insert();
  // Delete the 3D print from the database
  let data;
  try {
    data = (await axios.post("/checkout/order/delete/print", { printId }))[
      "data"
    ];
  } catch (error) {
    return { status: "failed", contents: error };
  }
  console.log(data);
  // Perform Validation
  checkout.cart.validation.validate(data.data.validity);
  return;
};

// @FUNC  checkout.cart.items.fetch
// @TYPE  PROMISE ASYNCHRONOUS
// @DESC
// @ARGU
checkout.cart.items.fetch = () => {
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

// @FUNC  checkout.cart.items.insert
// @TYPE  PROMISE ASYNCHRONOUS
// @DESC
// @ARGU
checkout.cart.items.insert = items => {
  // Process the loaded items
  if (numberOfItems) {
    if (items) {
      // If there are items ordered
      document.querySelector("#checkout-mkpl-cnts").innerHTML = "";
      for (let i = 0; i < numberOfItems; i++) {
        checkout.cart.item.insert(items[i]);
      }
    }
  } else {
    // If there are no items ordered
    document.querySelector("#checkout-mkpl-cnts").innerHTML = "<p>No Items</p>";
  }
  checkout.cart.items.resize();
  checkout.cart.resize();
};

// @FUNC  checkout.cart.items.load
// @TYPE
// @DESC
// @ARGU
checkout.cart.items.load = async () => {
  let items;

  try {
    items = await checkout.cart.items.fetch();
  } catch (error) {
    return error;
  }

  numberOfItems = items.length;
  checkout.cart.items.insert(items);
};

// @FUNC  checkout.cart.items.resize
// @TYPE
// @DESC
// @ARGU
checkout.cart.items.resize = () => {
  if (checkout.element.windowSize.matches) {
    if (numberOfItems) {
      document.querySelector("#checkout-mkpl-cnts").style = `height: ${10 *
        numberOfItems}vmax`;
    } else {
      document.querySelector("#checkout-mkpl-cnts").style = `height: 10vmax`;
    }
  } else {
    if (numberOfItems) {
      document.querySelector("#checkout-mkpl-cnts").style = `height: ${16 *
        numberOfItems}vmax`;
    } else {
      document.querySelector("#checkout-mkpl-cnts").style = `height: 16vmax`;
    }
  }
};

// @FUNC  checkout.cart.item.create
// @TYPE  SIMPLE
// @DESC
// @ARGU
checkout.cart.item.create = item => {
  // Create container one HTML
  const icon = `<div class="checkout-mkpl-cnt-img bgd-clr-wht-2"></div>`;
  const containerOne = `<div class="checkout-mkpl-cnt-cntn-1">${icon}</div>`;

  // Create container two HTML
  const itemName = `<div class="checkout-mkpl-cnt-item-name sbtl-1 txt-clr-blk-2">${item.itemName}</div>`;
  const shopName = `<div class="checkout-mkpl-cnt-shop sbtl-1 txt-clr-blk-2">${item.shopName}</div>`;
  const quantity = `<div class="checkout-mkpl-cnt-qnty-cntn">
                       <label
                         class="checkout-mkpl-cnt-qnty-lbl sbtl-1 txt-clr-blk-2"
                         >Quantity:</label
                       >
                       <input
                         type="number"
                         name="quantity"
                         class="checkout-mkpl-cnt-qnty inp-txt-2 sbtl-1 txt-clr-blk-2"
                         min="1"
                         value="${item.quantity}"
                       />
                     </div>`;
  const containerTwo = `<div class="checkout-mkpl-cnt-cntn-2">${itemName +
    shopName +
    quantity}</div>`;

  // Create container three HTML
  const cancel = `<div class="checkout-delete"></div>`;
  const price = `<div class="checkout-mkpl-cnt-prc sbtl-1 txt-clr-blk-2"></div>`;
  const containerThree = `<div class="checkout-mkpl-cnt-cntn-3">${cancel +
    price}</div>`;

  // Return containers
  const containers = containerOne + containerTwo + containerThree;
  return containers;
};

// @FUNC  checkout.cart.item.insert
// @TYPE  SIMPLE
// @DESC
// @ARGU
checkout.cart.item.insert = (item, element) => {
  const containers = checkout.cart.item.create(item);
  const html = `<div class="checkout-mkpl-cnt" id="checkout-mkpl-${item._id}">${containers}</div>`;
  if (element) {
    element.innerHTML = html;
  } else {
    document
      .querySelector("#checkout-mkpl-cnts")
      .insertAdjacentHTML("beforeend", html);
  }
};

// @FUNC  checkout.cart.item.delete
// @TYPE  SIMPLE
// @DESC
// @ARGU
checkout.cart.item.delete = async itemId => {
  // Remove the item from the cart
  document.querySelector(`#checkout-mkpl-${itemId}`).remove();
  // Reduce the number of items listed
  numberOfItems = numberOfItems - 1;
  checkout.cart.items.insert();
  // Delete the item from the database
};

// @FUNC  checkout.cart.discount.add
// @TYPE
// @DESC
// @ARGU
checkout.cart.discount.add = () => {
  // Fetch the discount code input
  const discountCode = document.querySelector("#checkout-dsct-inp").value;
  console.log(document.querySelector("#checkout-dsct-inp").value);
  // Perform pre-validation before sending to the backend
  let validation = {
    status: "Success",
    message: ""
  };
  if (!discountCode) {
    // Check if input code exist
    validation.status = "Failed";
    validation.message = "Input Discount Code";
  }
  if (!checkout.cart.discount.validate(validation)) return; // Validation

  /* Send to the backend to perform validation and if successful,
  retrieve the discount object */

  let discount;
  if (!checkout.cart.discount.validate(validation)) return; // Validation
  // Display the discount to the page
  checkout.cart.discount.insert(discount);
};

// @FUNC  checkout.cart.discount.insert
// @TYPE
// @DESC
// @ARGU
checkout.cart.discount.insert = discount => {
  const html = `<div class="checkout-dsct sbtl-2 txt-clr-blk-3"></div>`;
  document
    .querySelector("#checkout-dsct-list-cntn")
    .insertAdjacentHTML("beforeend", html);
  document.querySelector("#checkout-dsct-inp").value = ""; // Clear input
  document.querySelector("#checkout-dsct-inp-err").innerHTML = ""; // Clear error
};

// @FUNC  checkout.cart.discount.validate
// @TYPE
// @DESC
// @ARGU
checkout.cart.discount.validate = validation => {
  if (validation.status == "Failed") {
    document.querySelector("#checkout-dsct-inp-err").innerHTML =
      validation.message;
    return false;
  }
  return true;
};

// @FUNC  checkout.cart.manufacturingSpeed.select
// @TYPE
// @DESC
// @ARGU
checkout.cart.manufacturingSpeed.select = async option => {
  // Place Loaders

  // Update the Database
  let price;
  try {
    price = await axios.post("/checkout/order/update/manufacturing-speed", {
      option
    });
  } catch (error) {
    console.log(error);
    return;
  }
  // Update Price

  // Perform Validation
  checkout.cart.validation.validate();
};

// @FUNC  checkout.cart.validation.validate
// @TYPE  SIMPLE
// @DESC
// @ARGU
checkout.cart.validation.validate = async validity => {
  let valid;

  if (validity) {
    valid = validity.cart;
  } else {
    try {
      valid = (await axios.post("/checkout/order/validate/cart"))["data"][
        "data"
      ];
    } catch (error) {
      console.log(error);
      return;
    }
  }

  if (valid) {
    checkout.cart.validation.valid();
  } else {
    checkout.cart.validation.invalid();
  }
};

// @FUNC  checkout.cart.validation.valid
// @TYPE  SIMPLE
// @DESC
// @ARGU
checkout.cart.validation.valid = () => {
  // Add Event Listeners
  checkout.element.heading.shipping.addEventListener(
    "click",
    checkout.shipping.show
  );
  checkout.element.navigation.shipping.addEventListener(
    "click",
    checkout.shipping.show
  );
  checkout.element.button.cart.next.addEventListener(
    "click",
    checkout.shipping.show
  );
  // Update CSS
  checkout.element.heading.shipping.classList.add("checkout-heading-valid");
  checkout.element.button.cart.next.classList.add("checkout-button-valid");
};

// @FUNC  checkout.cart.validation.invalid
// @TYPE  SIMPLE
// @DESC
// @ARGU
checkout.cart.validation.invalid = () => {
  checkout.element.heading.shipping.removeEventListener(
    "click",
    checkout.shipping.show
  );
  checkout.element.navigation.shipping.removeEventListener(
    "click",
    checkout.shipping.show
  );
  checkout.element.button.cart.next.removeEventListener(
    "click",
    checkout.shipping.show
  );
  // Update CSS
  checkout.element.heading.shipping.classList.remove("checkout-heading-valid");
  checkout.element.button.cart.next.classList.remove("checkout-button-valid");
  // Return to Cart Page
  checkout.cart.show();
};

// @FUNC  checkout.cart.show
// @TYPE  SIMPLE
// @DESC
// @ARGU
checkout.cart.show = () => {
  checkout.navigation.navigate(0);
};

// @FUNC  checkout.cart.resize
// @TYPE  SIMPLE
// @DESC
// @ARGU
checkout.cart.resize = () => {
  // DESKTOP HEIGHT CALCULATION
  const desktopHeight = {
    heading: 8,
    subHeading: 8 * 4,
    prints: numberOfPrints ? 10 * numberOfPrints : 10,
    items: numberOfItems ? 10 * numberOfItems : 10,
    discountInput: 9,
    manufacturingSpeed: 8,
    buttons: 12
  };
  const total =
    desktopHeight.heading +
    desktopHeight.subHeading +
    desktopHeight.prints +
    desktopHeight.items +
    desktopHeight.discountInput +
    desktopHeight.manufacturingSpeed +
    desktopHeight.buttons;
  // SET THE CART PAGE SIZE
  if (checkout.element.windowSize.matches) {
    if (checkoutSelectedPage == 0) {
      document.querySelector("#checkout-sub-pg-cart").style =
        "height: " + total + "vmax;";
    } else {
      document.querySelector("#checkout-sub-pg-cart").style = "height: 8vmax;";
    }
  } else {
    document.querySelector("#checkout-sub-pg-cart").style =
      "height: calc(100% - 16vmax);";
  }
};

/*-----------------------------------------------------------------------------------------
SHIPPING
-----------------------------------------------------------------------------------------*/

// @FUNC  checkout.shipping.address.select
// @TYPE
// @DESC
// @ARGU
checkout.shipping.address.select = option => {
  if (option == "saved") {
    checkout.shipping.address.saved.show(true);
    checkout.shipping.address.new.show(false);
  } else if (option == "new") {
    checkout.shipping.address.saved.show(false);
    checkout.shipping.address.new.show(true);
  }
};

// @FUNC  checkout.shipping.address.saved.show
// @TYPE
// @DESC
// @ARGU
checkout.shipping.address.saved.show = show => {
  if (show) {
    document
      .querySelector("#checkout-shpg-adrs-cntn-svd")
      .classList.remove("checkout-element-hide");
  } else {
    document
      .querySelector("#checkout-shpg-adrs-cntn-svd")
      .classList.add("checkout-element-hide");
  }
};

// @FUNC  checkout.shipping.address.new.validate.unit
// @TYPE
// @DESC
// @ARGU
checkout.shipping.address.new.validate.unit = () => {
  const unit = document.querySelector("#checkout-shpg-adrs-new-unit").value;
  let status = {
    valid: true,
    input: unit,
    message: ""
  };

  return status;
};

// @FUNC  checkout.shipping.address.new.validate.street.number
// @TYPE
// @DESC
// @ARGU
checkout.shipping.address.new.validate.street.number = () => {
  const streetNumber = document.querySelector("#checkout-shpg-adrs-new-st-num")
    .value;
  let status = {
    valid: true,
    input: streetNumber,
    message: ""
  };

  // Validate if there is anything written
  if (!streetNumber) {
    status.valid = false;
    status.message = "requires input";
  }

  return status;
};

// @FUNC  checkout.shipping.address.new.validate.street.name
// @TYPE
// @DESC
// @ARGU
checkout.shipping.address.new.validate.street.name = () => {
  const streetName = document.querySelector("#checkout-shpg-adrs-new-st-name")
    .value;
  let status = {
    valid: true,
    input: streetName,
    message: ""
  };

  // Validate if there is anything written
  if (!streetName) {
    status.valid = false;
    status.message = "requires input";
  }

  return status;
};

// @FUNC  checkout.shipping.address.new.validate.suburb
// @TYPE
// @DESC
// @ARGU
checkout.shipping.address.new.validate.suburb = () => {
  const suburb = document.querySelector("#checkout-shpg-adrs-new-sbrb").value;
  let status = {
    valid: true,
    input: suburb,
    message: ""
  };

  // Validate if there is anything written
  if (!suburb) {
    status.valid = false;
    status.message = "requires input";
  }

  return status;
};

// @FUNC  checkout.shipping.address.new.validate.city
// @TYPE
// @DESC
// @ARGU
checkout.shipping.address.new.validate.city = () => {
  const city = document.querySelector("#checkout-shpg-adrs-new-cty").value;
  let status = {
    valid: true,
    input: city,
    message: ""
  };

  // Validate if there is anything written
  if (!city) {
    status.valid = false;
    status.message = "requires input";
  }

  return status;
};

// @FUNC  checkout.shipping.address.new.validate.postcode
// @TYPE
// @DESC
// @ARGU
checkout.shipping.address.new.validate.postcode = () => {
  const postcode = document.querySelector("#checkout-shpg-adrs-new-zp-cd")
    .value;
  let status = {
    valid: true,
    input: postcode,
    message: ""
  };

  // Validate if there is anything written
  if (!postcode) {
    status.valid = false;
    status.message = "requires input";
  }

  return status;
};

// @FUNC  checkout.shipping.address.new.validate.country
// @TYPE
// @DESC
// @ARGU
checkout.shipping.address.new.validate.country = () => {
  const country = document.querySelector("#checkout-shpg-adrs-new-cnty").value;
  let status = {
    valid: true,
    input: country,
    message: ""
  };

  // Validate if there is anything written
  if (!country) {
    status.valid = false;
    status.message = "requires input";
  }

  return status;
};

// @FUNC  checkout.shipping.address.new.validate.all
// @TYPE
// @DESC
// @ARGU
checkout.shipping.address.new.validate.all = type => {
  // Collect and Validate Inputs
  const unit = checkout.shipping.address.new.validate.unit();
  const streetNumber = checkout.shipping.address.new.validate.street.number();
  const streetName = checkout.shipping.address.new.validate.street.name();
  const suburb = checkout.shipping.address.new.validate.suburb();
  const city = checkout.shipping.address.new.validate.city();
  const postcode = checkout.shipping.address.new.validate.postcode();
  const country = checkout.shipping.address.new.validate.country();
  // Check Validity
  const valid =
    unit.valid &&
    streetNumber.valid &&
    streetName.valid &&
    suburb.valid &&
    city.valid &&
    postcode.valid &&
    country.valid;
  // Error Handling
  if (type == "unit") {
    document.querySelector("#checkout-shipping-unit-error").innerHTML =
      unit.message;
  } else if (type == "streetNumber") {
    document.querySelector("#checkout-shipping-street-number-error").innerHTML =
      streetNumber.message;
  } else if (type == "streetName") {
    document.querySelector("#checkout-shipping-street-name-error").innerHTML =
      streetName.message;
  } else if (type == "suburb") {
    document.querySelector("#checkout-shipping-suburb-error").innerHTML =
      suburb.message;
  } else if (type == "city") {
    document.querySelector("#checkout-shipping-city-error").innerHTML =
      city.message;
  } else if (type == "postcode") {
    document.querySelector("#checkout-shipping-postcode-error").innerHTML =
      postcode.message;
  } else if (type == "country") {
    document.querySelector("#checkout-shipping-country-error").innerHTML =
      country.message;
  } else {
    document.querySelector("#checkout-shipping-unit-error").innerHTML =
      unit.message;
    document.querySelector("#checkout-shipping-street-number-error").innerHTML =
      streetNumber.message;
    document.querySelector("#checkout-shipping-street-name-error").innerHTML =
      streetName.message;
    document.querySelector("#checkout-shipping-suburb-error").innerHTML =
      suburb.message;
    document.querySelector("#checkout-shipping-city-error").innerHTML =
      city.message;
    document.querySelector("#checkout-shipping-postcode-error").innerHTML =
      postcode.message;
    document.querySelector("#checkout-shipping-country-error").innerHTML =
      country.message;
  }
  if (valid) {
  } else {
  }
  // Create the Address Object
  const address = {
    unit: unit.input,
    street: {
      number: streetNumber.input,
      name: streetName.input
    },
    suburb: suburb.input,
    city: city.input,
    postcode: postcode.input,
    country: country.input
  };

  return address;
};

// @FUNC  checkout.shipping.address.new.show
// @TYPE
// @DESC
// @ARGU
checkout.shipping.address.new.show = show => {
  if (show) {
    document
      .querySelector("#checkout-shpg-adrs-cntn-new")
      .classList.remove("checkout-element-hide");
  } else {
    document
      .querySelector("#checkout-shpg-adrs-cntn-new")
      .classList.add("checkout-element-hide");
  }
};

// @FUNC  checkout.shipping.validation.valid
// @TYPE  SIMPLE
// @DESC
// @ARGU
checkout.shipping.validation.valid = () => {
  checkout.element.heading.payment.addEventListener(
    "click",
    checkout.payment.show
  );
  checkout.element.navigation.payment.addEventListener(
    "click",
    checkout.payment.show
  );
  checkout.element.button.shipping.next.addEventListener(
    "click",
    checkout.payment.show
  );
  // Update CSS
  checkout.element.button.shipping.next.classList.add("checkout-button-valid");
};

// @FUNC  checkout.shipping.validation.invalid
// @TYPE  SIMPLE
// @DESC
// @ARGU
checkout.shipping.validation.invalid = () => {
  checkout.element.heading.payment.removeEventListener(
    "click",
    checkout.payment.show
  );
  checkout.element.navigation.payment.removeEventListener(
    "click",
    checkout.payment.show
  );
  checkout.element.button.shipping.next.removeEventListener(
    "click",
    checkout.payment.show
  );
  // Update CSS
  checkout.element.button.shipping.next.classList.remove(
    "checkout-button-valid"
  );
};

// @FUNC  checkout.shipping.show
// @TYPE  SIMPLE
// @DESC
// @ARGU
checkout.shipping.show = () => {
  checkout.navigation.navigate(1);
};

// @FUNC  checkoutShippingCreateSavedAddressHTML
// @TYPE
// @DESC
// @ARGU
const checkoutShippingCreateSavedAddressHTML = address => {
  let unit = "";

  if (address.unit) {
    unit = `<div class="checkout-shpg-adrs-svd-line sbtl-2 txt-clr-blk-3">
            ${address.unit}</div>`;
  }

  const street = `<div class="checkout-shpg-adrs-svd-line sbtl-2 txt-clr-blk-3">
                  ${address.street.number} ${address.street.name}</div>`;
  const suburb = `<div class="checkout-shpg-adrs-svd-line sbtl-2 txt-clr-blk-3">
                  ${address.suburb}</div>`;
  const cityPostal = `<div class="checkout-shpg-adrs-svd-line sbtl-2 txt-clr-blk-3">
                      ${address.city}, ${address.postcode}</div>`;
  const country = `<div class="checkout-shpg-adrs-svd-line sbtl-2 txt-clr-blk-3">
                    ${address.country}</div>`;

  const html = unit + street + suburb + cityPostal + country;

  return html;
};

/*-----------------------------------------------------------------------------------------
PAYMENT
-----------------------------------------------------------------------------------------*/

// @FUNC  checkout.payment.stripe.initialise
// @TYPE
// @DESC
// @ARGU
checkout.payment.stripe.initialise = () => {
  checkout.payment.stripe.element.stripe = Stripe(
    "pk_test_cyWnxjuNQGbF42g88sLseXpJ003JGn4TCC"
  );
  checkout.payment.stripe.element.elements = checkout.payment.stripe.element.stripe.elements();
  checkout.payment.stripe.element.number = checkout.payment.stripe.element.elements.create(
    "cardNumber"
  );
  checkout.payment.stripe.element.number.mount("#checkout-card-num");
  checkout.payment.stripe.element.expiry = checkout.payment.stripe.element.elements.create(
    "cardExpiry"
  );
  checkout.payment.stripe.element.expiry.mount("#checkout-card-exp");
  checkout.payment.stripe.element.cvc = checkout.payment.stripe.element.elements.create(
    "cardCvc"
  );
  checkout.payment.stripe.element.cvc.mount("#checkout-card-cvc");
};

// @FUNC  checkout.payment.method.select
// @TYPE
// @DESC
// @ARGU
checkout.payment.method.select = option => {
  if (option === "bankTransfer") {
    checkout.payment.method.bank.show(true);
    checkout.payment.method.card.show(false);
  } else if (option === "card") {
    checkout.payment.method.bank.show(false);
    checkout.payment.method.card.show(true);
  }
};

// @FUNC  checkout.payment.method.bank.show
// @TYPE
// @DESC
// @ARGU
checkout.payment.method.bank.show = show => {
  if (show) {
    document
      .querySelector("#checkout-pymt-bank-tsfr-cntn")
      .classList.remove("checkout-element-hide");
  } else {
    document
      .querySelector("#checkout-pymt-bank-tsfr-cntn")
      .classList.add("checkout-element-hide");
  }
};

// @FUNC  checkout.payment.method.card.pay
// @TYPE
// @DESC
// @ARGU
checkout.payment.method.card.pay = async () => {
  let clientSecret;
  let payment;

  try {
    clientSecret = await checkout.payment.method.card.paymentIntent();
  } catch (error) {
    return console.log(error);
  }

  try {
    payment = await checkout.payment.method.card.process(clientSecret);
  } catch (error) {
    return console.log(error);
  }

  console.log(payment["status"]);
};

// @FUNC  checkout.payment.method.card.paymentIntent
// @TYPE
// @DESC
// @ARGU
checkout.payment.method.card.paymentIntent = () => {
  return new Promise(async (resolve, reject) => {
    let clientSecret;

    try {
      clientSecret = (await axios.post("/checkout/payment-intent", "Pay"))[
        "data"
      ];
    } catch (error) {
      reject(error);
    }

    resolve(clientSecret);
  });
};

// @FUNC  checkout.payment.method.card.process
// @TYPE
// @DESC
// @ARGU
checkout.payment.method.card.process = clientSecret => {
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

// @FUNC  checkout.payment.method.card.show
// @TYPE
// @DESC
// @ARGU
checkout.payment.method.card.show = show => {
  if (show) {
    document
      .querySelector("#checkout-pymt-card-cntn")
      .classList.remove("checkout-element-hide");
  } else {
    document
      .querySelector("#checkout-pymt-card-cntn")
      .classList.add("checkout-element-hide");
  }
};

// @FUNC  checkout.payment.show
// @TYPE  SIMPLE
// @DESC
// @ARGU
checkout.payment.show = () => {
  checkout.navigation.navigate(2);
};

/*-----------------------------------------------------------------------------------------
NAVIGATION
-----------------------------------------------------------------------------------------*/

let checkoutPages = ["cart", "shipping", "payment"];
let checkoutSelectedPage = 0;

// @FUNC  checkout.navigation.navigate
// @TYPE
// @DESC
// @ARGU
checkout.navigation.navigate = nextPage => {
  // Check if we are currently on the same page
  if (nextPage == checkoutSelectedPage) return;
  // Update the navigation CSS
  checkout.navigation.changeCSS.navigation(nextPage);
  checkout.navigation.changeCSS.page(nextPage);
  // Update the current selected page
  checkoutSelectedPage = nextPage;
  checkout.cart.resize();
};

// @FUNC  checkout.navigation.changeCSS.navigation
// @TYPE
// @DESC
// @ARGU
checkout.navigation.changeCSS.navigation = nextPage => {
  const nextPageName = checkoutPages[nextPage];
  const currentPageName = checkoutPages[checkoutSelectedPage];
  document
    .querySelector(`#checkout-navigation-${nextPageName}`)
    .classList.add("checkout-navigation-icon-container-selected");
  document
    .querySelector(`#checkout-navigation-${currentPageName}`)
    .classList.remove("checkout-navigation-icon-container-selected");
};

// @FUNC  checkout.navigation.changeCSS.page
// @TYPE
// @DESC
// @ARGU
checkout.navigation.changeCSS.page = nextPage => {
  const nextPageName = checkoutPages[nextPage];
  if (nextPage > checkoutSelectedPage) {
    document
      .querySelector(`#checkout-sub-pg-${nextPageName}`)
      .classList.remove("checkout-sub-pg-right");
    for (let i = checkoutSelectedPage; i < nextPage; i++) {
      const currentPageName = checkoutPages[i];
      document
        .querySelector(`#checkout-sub-pg-${currentPageName}`)
        .classList.remove("checkout-sub-pg-right");
      document
        .querySelector(`#checkout-sub-pg-${currentPageName}`)
        .classList.add("checkout-sub-pg-left");
    }
  } else {
    document
      .querySelector(`#checkout-sub-pg-${nextPageName}`)
      .classList.remove("checkout-sub-pg-left");
    for (let i = checkoutSelectedPage; i > nextPage; i--) {
      const currentPageName = checkoutPages[i];
      document
        .querySelector(`#checkout-sub-pg-${currentPageName}`)
        .classList.remove("checkout-sub-pg-left");
      document
        .querySelector(`#checkout-sub-pg-${currentPageName}`)
        .classList.add("checkout-sub-pg-right");
    }
  }
};

/*=========================================================================================
END
=========================================================================================*/
