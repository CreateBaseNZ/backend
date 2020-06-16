/*=========================================================================================
NEW VERSION
=========================================================================================*/

/*=========================================================================================
VARIABLES
=========================================================================================*/

// Track the current page the user is on
let numberOfPrints = 0;
let numberOfDiscounts = 0;

/*-----------------------------------------------------------------------------------------
ELEMENTS
-----------------------------------------------------------------------------------------*/

let checkout = {
  // VARIABLES
  element: {
    heading: {
      cart: undefined, // checkout.element.heading.cart
      shipping: undefined, // checkout.element.heading.shipping
      payment: undefined // checkout.element.heading.payment
    },
    button: {
      cart: {
        next: undefined // checkout.element.button.cart.next
      },
      shipping: {
        back: undefined, // checkout.element.button.shipping.back
        next: undefined // checkout.element.button.shipping.next
      },
      payment: {
        bank: {
          back: undefined, // checkout.element.button.payment.bank.back
          paid: undefined // checkout.element.button.payment.bank.paid
        },
        card: {
          back: undefined, // checkout.element.button.payment.card.back
          pay: undefined // checkout.element.button.payment.card.pay
        }
      }
    },
    navigation: {
      cart: undefined, // checkout.element.navigation.cart
      shipping: undefined, // checkout.element.navigation.shipping
      payment: undefined // checkout.element.navigation.payment
    },
    windowSize: undefined // checkout.element.windowSize
  },
  // FUNCTIONS
  initialise: undefined, // checkout.initialise
  fetch: undefined, // checkout.fetch
  insert: undefined, // checkout.insert
  load: undefined, // checkout.load
  listener: undefined, // checkout.listener
  validate: undefined, // checkout.validate
  priceFormatter: undefined,
  elements: {
    assign: undefined // checkout.elements.assign
  },
  cart: {
    prints: {
      insert: undefined, // checkout.cart.prints.insert
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
    discounts: {
      load: undefined // checkout.cart.discounts.load
    },
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
      selected: undefined,
      saved: {
        create: undefined, // checkout.shipping.address.saved.create
        insert: undefined, // checkout.shipping.address.saved.insert
        show: undefined // checkout.shipping.address.saved.show
      },
      new: {
        update: undefined, // checkout.shipping.address.new.update
        populate: undefined, // checkout.shipping.address.new.populate
        toggleSave: undefined, // checkout.shipping.address.new.toggleSave
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
        show: undefined // checkout.shipping.address.new.show
      }
    },
    method: {
      select: undefined // checkout.shipping.method.select
    },
    validation: {
      validate: undefined, // checkout.shipping.validation.validate
      valid: undefined, // checkout.shipping.validation.valid
      invalid: undefined // checkout.shipping.validation.invalid
    },
    show: undefined, // checkout.shipping.show
    resize: undefined // checkout.shipping.resize
  },
  payment: {
    stripe: {
      initialise: undefined, // checkout.payment.stripe.initialise
      element: {
        stripe: undefined, // checkout.payment.stripe.element.stripe
        elements: undefined, // checkout.payment.stripe.element.elements
        card: {
          number: undefined, // checkout.payment.stripe.element.card.number
          expiry: undefined, // checkout.payment.stripe.element.card.expiry
          cvc: undefined // checkout.payment.stripe.element.card.cvc
        }
      },
      errorHandler: undefined // checkout.payment.stripe.errorHandler
    },
    method: {
      select: undefined, // checkout.payment.method.select
      selected: undefined, // checkout.payment.method.selected
      bank: {
        detail: undefined, // checkout.payment.method.bank.detail
        show: undefined, // checkout.payment.method.bank.show
        paid: undefined // checkout.payment.method.bank.paid
      },
      card: {
        paymentIntent: undefined, // checkout.payment.method.card.paymentIntent
        process: undefined, // checkout.payment.method.card.process
        show: undefined, // checkout.payment.method.card.show
        pay: undefined // checkout.payment.method.card.pay
      }
    },
    validation: {
      validate: undefined, // checkout.payment.validation.validate
      valid: undefined, // checkout.payment.validation.valid
      invalid: undefined // checkout.payment.validation.invalid
    },
    show: undefined // checkout.payment.show
  },
  navigation: {
    navigate: undefined, // checkout.navigation.navigate
    changeCSS: {
      page: undefined, // checkout.navigation.changeCSS.page
      navigation: undefined // checkout.navigation.changeCSS.navigation
    }
  },
  load: {
    success: undefined, // checkout.load.success
    load: undefined, // checkout.load.load
    time: undefined // checkout.load.time
  },
  amount: {
    fetch: undefined,
    load: undefined
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
  // LOAD NAVIGATION
  try {
    await navigation.initialise();
  } catch (error) {
    return console.log(error);
  }
  // REMOVE STARTUP LOADER
  removeLoader();
  // Stripe
  checkout.payment.stripe.initialise();
  checkout.elements.assign();
  // LOAD ORDER DETAILS
  try {
    await checkout.load();
  } catch (error) {
    console.log(error);
    return;
  }
  // Event Listener
  checkout.listener();
  // Update Loader
  checkout.load.success("loaded");
  // ENSURE CORRECT SIZING
  checkout.cart.resize();
};

// @FUNC  checkout.fetch
// @TYPE
// @DESC
// @ARGU
checkout.fetch = () => {
  return new Promise(async (resolve, reject) => {
    let data;
    try {
      data = (await axios.get("/checkout/order"))["data"];
    } catch (error) {
      return reject(error);
    }
    console.log(data);
    if (data.status === "failed") {
      return reject(data.content);
    }
    return resolve(data.content);
  });
};

// @FUNC  checkout.insert
// @TYPE
// @DESC
// @ARGU
checkout.insert = content => {
  // DECLARE VARIABLES
  const makes = content.makes;
  const order = content.order;
  // MAKES
  checkout.cart.prints.insert(makes);
  // MANUFACTURING SPEED
  const manufacturingSpeed = order.manufacturingSpeed;
  if (manufacturingSpeed == "normal") {
    document.querySelector("#checkout-normal-speed").checked = true;
  } else if (manufacturingSpeed == "urgent") {
    document.querySelector("#checkout-urgent-speed").checked = true;
  }
  // SHIPPING ADDRESS
  let html;
  // Check if there is a saved address
  if (order.shipping.address.saved.suburb) {
    // Saved - Populate Element
    html = checkout.shipping.address.saved.create(order.shipping.address.saved);
  } else {
    // Disable click
    document.querySelector("#checkout-address-saved").disabled = true;
    document.querySelector("#checkout-address-saved-label").classList.add("disabled");
    // Add error to inform user that there is no saved address
    document.querySelector("#checkout-address-saved-error").innerHTML = "No Saved Address";
    document.querySelector("#checkout-address-saved-error").classList.remove("checkout-element-hide");
    html = "<p>No Saved Address</p>";
  }
  checkout.shipping.address.saved.insert(html);
  // New
  checkout.shipping.address.new.populate(order.shipping.address.new);
  document.querySelector("#checkout-shipping-save-address-input").checked = order.shipping.address.save;
  // Selection
  checkout.shipping.address.selected = order.shipping.address.option;
  if (checkout.shipping.address.selected === "saved") {
    if (order.shipping.address.saved.suburb) {
      document.querySelector("#checkout-address-saved").checked = true;
    }
  } else if (checkout.shipping.address.selected === "new") {
    document.querySelector("#checkout-address-new").checked = true;
  }
  checkout.shipping.address.select(checkout.shipping.address.selected);
  // SHIPPING METHOD
  const shippingMethod = order.shipping.method;
  if (shippingMethod == "pickup") {
    document.querySelector("#checkout-shipping-method-pickup").checked = true;
  } else if (shippingMethod == "tracked") {
    document.querySelector("#checkout-shipping-method-tracked").checked = true;
  } else if (shippingMethod == "courier") {
    document.querySelector("#checkout-shipping-method-courier").checked = true;
  }
  // PAYMENT METHOD
  // Assign the stored payment method to the global variable
  checkout.payment.method.selected = order.payment.method;
  // Perform an operation based on the selected method
  checkout.payment.method.select(checkout.payment.method.selected);
};

// @FUNC  checkout.load
// @TYPE
// @DESC
// @ARGU
checkout.load = async () => {
  let content;
  try {
    content = await checkout.fetch();
  } catch (error) {
    return console.log(error);
  }
  checkout.insert(content);
  // Update Order Amounts
  checkout.amount.load(content.amount);
  // Update Bank Transfer Details
  checkout.payment.method.bank.detail(content.amount, content.wallet);
  // Update Discounts
  checkout.cart.discounts.load(content.discounts);
  // Perform Validation
  checkout.validate(content.validity);
  return;
};

// @FUNC  checkout.listener
// @TYPE
// @DESC
// @ARGU
checkout.listener = () => {
  checkout.element.heading.cart.addEventListener("click", checkout.cart.show);
  checkout.element.navigation.cart.addEventListener("click", checkout.cart.show);
  checkout.element.button.shipping.back.addEventListener("click", checkout.cart.show);
  checkout.element.button.payment.bank.back.addEventListener("click", checkout.shipping.show);
  checkout.element.button.payment.card.back.addEventListener("click", checkout.shipping.show);
  checkout.element.windowSize.addListener(checkout.cart.prints.resize);
  checkout.element.windowSize.addListener(checkout.cart.resize);
  checkout.element.windowSize.addListener(checkout.shipping.resize);
  checkout.element.windowSize.addListener(checkout.payment.resize);
};

// @FUNC  checkout.validate
// @TYPE
// @DESC
// @ARGU
checkout.validate = async validity => {
  checkout.cart.validation.validate(validity);
  checkout.shipping.validation.validate(validity);
  checkout.payment.validation.validate(validity);
};

// @FUNC  checkout.priceFormatter
// @TYPE  DEFAULT
// @DESC  Receives a number and converts it into a dollar format (2 DP)
// @ARGU  value - integer - original value to be formatted to dollar format
checkout.priceFormatter = value => {
  const roundedValue = (Math.round(Number(value) * 100)) / 100;
  const stringValue = String(roundedValue);
  // Evaluate the number of decimal places
  const pointIndex = stringValue.indexOf(".");
  const stringLength = stringValue.length;
  let formattedValue;
  if (pointIndex === -1) {
    formattedValue = stringValue + ".00";
  } else if ((stringLength - pointIndex) === 2) {
    formattedValue = stringValue + "0";
  } else if ((stringLength - pointIndex) === 3) {
    formattedValue = stringValue;
  }
  return formattedValue;
};

// @FUNC  checkout.elements.assign
// @TYPE
// @DESC
// @ARGU
checkout.elements.assign = () => {
  checkout.element.heading.cart = document.querySelector("#checkout-cart-heading");
  checkout.element.heading.shipping = document.querySelector("#checkout-shipping-heading");
  checkout.element.heading.payment = document.querySelector("#checkout-payment-heading");
  checkout.element.navigation.cart = document.querySelector("#checkout-navigation-cart");
  checkout.element.navigation.shipping = document.querySelector("#checkout-navigation-shipping");
  checkout.element.navigation.payment = document.querySelector("#checkout-navigation-payment");
  checkout.element.button.cart.next = document.querySelector("#checkout-cart-next");
  checkout.element.button.shipping.back = document.querySelector("#checkout-shipping-back");
  checkout.element.button.shipping.next = document.querySelector("#checkout-shipping-next");
  checkout.element.button.payment.bank.back = document.querySelector("#checkout-payment-bank-back");
  checkout.element.button.payment.bank.paid = document.querySelector("#checkout-payment-bank-paid");
  checkout.element.button.payment.card.back = document.querySelector("#checkout-payment-card-back");
  checkout.element.button.payment.card.pay = document.querySelector("#checkout-payment-card-pay");
  checkout.element.windowSize = window.matchMedia("(min-width: 850px)");
};

/*-----------------------------------------------------------------------------------------
AMOUNT
-----------------------------------------------------------------------------------------*/

// @FUNC  checkout.amount.fetch
// @TYPE  PROMISE ASYNCHRONOUS
// @DESC
// @ARGU
checkout.amount.fetch = () => {
  return new Promise(async (resolve, reject) => {
    // Fetch the amount object from the database
    let data;
    try {
      data = (await axios.get("/checkout/order-amount"))["data"];
    } catch (error) {
      reject(error);
      return;
    }
    // Check if an error was encountered
    if (data.status === "failed") {
      reject(data.content);
      return;
    }
    // Resolve, return the amount object
    resolve(data.content);
    return;
  })
}

// @FUNC  checkout.amount.load
// @TYPE  ASYNCHRONOUS
// @DESC
// @ARGU
checkout.amount.load = async (amount) => {
  // Fetch the amount object
  if (!amount) {
    try {
      amount = await checkout.amount.fetch();
    } catch (error) {
      console.log(error);
      return;
    }
  }
  // Populate the HTML
  // Declare and Initialise amount variables
  let makes;
  if (amount.makes.status === "invalid") {
    makes = "-";
  } else {
    makes = "$ " + checkout.priceFormatter(amount.makes.total);
  }
  let manufacturing;
  if (amount.manufacturing.status === "invalid") {
    manufacturing = "-";
  } else {
    manufacturing = "$ " + checkout.priceFormatter(amount.manufacturing.total);
  }
  let discount;
  if (amount.discount.status === "invalid") {
    discount = "-";
  } else {
    discount = "-$ " + checkout.priceFormatter(amount.discount.total);
  }
  let gst;
  if (amount.gst.status === "invalid") {
    gst = "-";
  } else {
    gst = "$ " + checkout.priceFormatter(amount.gst.total);
  }
  let shipping;
  if (amount.shipping.status === "invalid") {
    shipping = "-";
  } else {
    shipping = "$ " + checkout.priceFormatter(amount.shipping.total);
  }
  let total;
  if (amount.total.status === "invalid") {
    total = "-";
  } else {
    total = "$ " + checkout.priceFormatter(amount.total.total);
  }
  let preShippingTotal;
  if (amount.manufacturing.status === "invalid") {
    preShippingTotal = "-";
  } else {
    preShippingTotal = "$ " + checkout.priceFormatter(((amount.makes.total + amount.manufacturing.total)
      - amount.discount.total) + amount.gst.total);
  }
  // Insert the amount variables onto HTML
  // Order Summary HTML
  document.querySelector("#checkout-summary-value-subtotal").innerHTML = makes;
  document.querySelector("#checkout-summary-value-manufacturing").innerHTML = manufacturing;
  document.querySelector("#checkout-summary-value-discount").innerHTML = discount;
  document.querySelector("#checkout-summary-value-gst").innerHTML = gst;
  document.querySelector("#checkout-summary-value-shipping").innerHTML = shipping;
  document.querySelector("#checkout-summary-total").innerHTML = total;
  // Pre-Shipping Total
  document.querySelector("#checkout-cart-subtotal").innerHTML = makes;
  document.querySelector("#checkout-cart-manufacturing").innerHTML = manufacturing;
  document.querySelector("#checkout-cart-discount").innerHTML = discount;
  document.querySelector("#checkout-cart-gst").innerHTML = gst;
  document.querySelector("#checkout-cart-total").innerHTML = preShippingTotal;
  // Order Total
  document.querySelector("#checkout-shipping-subtotal").innerHTML = preShippingTotal;
  document.querySelector("#checkout-shipping-shipping-fee").innerHTML = shipping;
  document.querySelector("#checkout-shipping-total").innerHTML = total;
}

/*-----------------------------------------------------------------------------------------
CART
-----------------------------------------------------------------------------------------*/

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
      document.querySelector("#checkout-prints").innerHTML = "";
      for (let i = 0; i < numberOfPrints; i++) {
        checkout.cart.print.insert(makes[i]);
      }
    } else {
      // If there are no prints ordered
      document.querySelector("#checkout-prints").innerHTML =
        "<p>No 3D Prints</p>";
    }
  } else {
    if (!numberOfPrints) {
      document.querySelector("#checkout-prints").innerHTML =
        "<p>No 3D Prints</p>";
    } else {
    }
  }
  checkout.cart.prints.resize();
  checkout.cart.resize();
};

// @FUNC  checkout.cart.prints.resize
// @TYPE
// @DESC
// @ARGU
checkout.cart.prints.resize = () => {
  if (checkout.element.windowSize.matches) {
    if (numberOfPrints) {
      document.querySelector("#checkout-prints").style = `height: ${10 * numberOfPrints}vmax`;
    } else {
      document.querySelector("#checkout-prints").style = `height: 10vmax`;
    }
  } else {
    if (numberOfPrints) {
      document.querySelector("#checkout-prints").style = `height: ${16 * numberOfPrints}vmax`;
    } else {
      document.querySelector("#checkout-prints").style = `height: 16vmax`;
    }
  }
};

// @FUNC  checkout.cart.print.create
// @TYPE  SIMPLE
// @DESC
// @ARGU
checkout.cart.print.create = print => {
  // DECLARE VARIABLES
  const printId = String(print._id);
  // Container One
  const icon = `<div class="image"></div>`;
  const containerOne = `<div class="checkout-print-container-1">${icon}</div>`;

  // Container Two
  const fileName = `<a href="/files/download/${print.file.id}">${print.file.name}</a>`;
  const buildType = `<div class="build-type">${print.build}</div>`;
  const colour = `<div class="colour">${print.colour}</div>`;
  const quantity = `<div class="checkout-print-quantity-container">
                      <label>Quantity:</label>
                      <input type="number" name="quantity" id="checkout-print-quantity-${printId}" min="1" value="${print.quantity}"
                        onchange="checkout.cart.print.update(this.value,'${print.quantity}','quantity','${printId}');"/>
                    </div>`;
  const containerTwo = `<div class="checkout-print-container-2">${fileName + buildType + colour + quantity}</div>`;

  // Container Three
  const cancel = `<div class="checkout-print-delete" onclick="checkout.cart.print.delete('${printId}');"></div>`;
  let price;
  if (print.status === "awaitingQuote") {
    price = `<div class="price">awaiting quote</div>`;
  } else {
    const totalPrice = checkout.priceFormatter(print.price * print.quantity);
    price = `<div class="price">$ ${totalPrice}</div>`;
  }
  const containerThree = `<div class="checkout-print-container-3">${cancel + price}</div>`;

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
    const html = `<div class="print" id="checkout-print-${print._id}">${containers}</div>`;
    document.querySelector("#checkout-prints").insertAdjacentHTML("beforeend", html);
  }
};

// @FUNC  checkout.cart.print.update
// @TYPE  SIMPLE
// @DESC
// @ARGU
checkout.cart.print.update = async (newValue, oldValue, property, makeId) => {
  // VALIDATE REQUEST
  if (!checkout.cart.print.validate[property](newValue, oldValue, makeId)) {
    return;
  }
  // CREATE UPDATES OBJECT 
  const update = { property: [property], value: newValue }
  // LOADER
  checkout.load.load("updating quantity");
  // SEND UPDATE REQUEST
  let data;
  try {
    data = (await axios.post("/checkout/make/update", { makeId, updates: [update] }))["data"];
  } catch (error) {
    // TO DO.....
    // Error handling
    // TO DO.....
    return console.log(error);
  }
  // ERROR HANDLER
  if (data.status === "failed") {
    // TO DO.....
    // Error handling
    // TO DO.....
    return console.log(data.content);
  }
  // SUCCESS HANDLER
  checkout.load.success("success");
  // Update Order Amounts
  checkout.amount.load(data.content);
  // Update Bank Transfer Details
  checkout.payment.method.bank.detail(data.content);
  return;
};

// @FUNC  checkout.cart.print.validate.quantity
// @TYPE  SIMPLE
// @DESC
// @ARGU
checkout.cart.print.validate.quantity = (newValue, oldValue, printId) => {
  if (newValue <= 0) {
    document.querySelector(`#checkout-print-quantity-${printId}`).value = oldValue;
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
  document.querySelector(`#checkout-print-${printId}`).remove();
  // Reduce the number of 3D prints listed
  numberOfPrints = numberOfPrints - 1;
  checkout.cart.prints.insert();
  // Delete the 3D print from the database
  checkout.load.load("deleting 3D print");
  let data;
  try {
    data = (await axios.post("/checkout/order/delete/print", { printId }))["data"];
  } catch (error) {
    return console.log(error);
  }
  checkout.load.success("deleted");
  // Perform Validation
  return checkout.validate(data.content);
};

// @FUNC  checkout.cart.discounts.load
// @TYPE
// @DESC
// @ARGU
checkout.cart.discounts.load = async (discounts = []) => {
  for (let i = 0; i < discounts.length; i++) {
    checkout.cart.discount.insert(discounts[i]);
  }
  // Update number of discounts
  return numberOfDiscounts = discounts.length;
}

// @FUNC  checkout.cart.discount.add
// @TYPE
// @DESC
// @ARGU
checkout.cart.discount.add = async () => {
  // Fetch the discount code input
  const code = document.querySelector("#checkout-discount-input").value;
  // VALIDATION
  let validation = { status: "", content: "" };
  if (!code) {
    // Check if input code exist
    validation.status = "failed";
    validation.content = "Input Discount Code";
  }
  if (!(checkout.cart.discount.validation(validation))) return;
  // SEND REQUEST TO THE BACKEND
  let data;
  try {
    data = (await axios.post("/checkout/discount/add", code))["data"];
  } catch (error) {
    // TO DO.....
    // Error handling
    // TO DO.....
    return console.log(error);
  }
  // ERROR HANDLING
  if (!(checkout.cart.discount.validation(data))) return;
  // SUCCESS HANDLER
  return checkout.cart.discount.insert(data.content);
};

// @FUNC  checkout.cart.discount.insert
// @TYPE
// @DESC
// @ARGU
checkout.cart.discount.insert = discount => {
  const html = `<div class="checkout-discount">${discount.name} (${discount.rate * 100}% OFF)</div>`;
  document.querySelector("#checkout-discounts").insertAdjacentHTML("beforeend", html);
  document.querySelector("#checkout-discount-input").value = ""; // Clear input
  document.querySelector("#checkout-discount-input-error").innerHTML = ""; // Clear error
};

// @FUNC  checkout.cart.discount.validation
// @TYPE
// @DESC
// @ARGU
checkout.cart.discount.validation = validation => {
  if (validation.status === "failed") {
    document.querySelector("#checkout-discount-input-error").innerHTML = validation.content;
    return false;
  }
  return true;
};

// @FUNC  checkout.cart.manufacturingSpeed.select
// @TYPE
// @DESC
// @ARGU
checkout.cart.manufacturingSpeed.select = async option => {
  // CREATE UPDATES OBJECT
  const update = { property: ["manufacturingSpeed"], value: option };
  // Place Loaders
  checkout.load.load("updating order");
  // Update the Database
  let data;
  try {
    data = (await axios.post("/checkout/update", { updates: [update] }))["data"];
  } catch (error) {
    // TO DO.....
    // Error handling
    // TO DO.....
    return;
  }
  // ERROR HANDLER
  if (data.status === "failed") {
    // TO DO.....
    // Error handling
    // TO DO.....
    return;
  }
  // SUCCESS HANDLER
  checkout.load.success("saved");
  // Update Order Amounts
  checkout.amount.load(data.content.amount);
  // Update Bank Transfer Details
  checkout.payment.method.bank.detail(data.content.amount);
  // Perform Validation
  checkout.validate(data.content.validity);
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
    let data;
    try {
      data = (await axios.get("/checkout/validate"))["data"];
    } catch (error) {
      // TO DO.....
      // Error handling
      // TO DO.....
      return;
    }
    // ERROR HANDLER
    if (data.status === "failed") {
      // TO DO.....
      // Error handling
      // TO DO.....
      return;
    }
    // SUCCESS HANDLER
    valid = data.content.cart;
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
  checkout.element.heading.shipping.addEventListener("click", checkout.shipping.show);
  checkout.element.navigation.shipping.addEventListener("click", checkout.shipping.show);
  checkout.element.button.cart.next.addEventListener("click", checkout.shipping.show);
  // Update CSS
  checkout.element.heading.shipping.classList.add("valid");
  checkout.element.button.cart.next.classList.add("valid");
  checkout.element.navigation.cart.classList.add("valid");
  checkout.element.navigation.shipping.classList.remove("unavailable");
};

// @FUNC  checkout.cart.validation.invalid
// @TYPE  SIMPLE
// @DESC
// @ARGU
checkout.cart.validation.invalid = () => {
  checkout.element.heading.shipping.removeEventListener("click", checkout.shipping.show);
  checkout.element.navigation.shipping.removeEventListener("click", checkout.shipping.show);
  checkout.element.button.cart.next.removeEventListener("click", checkout.shipping.show);
  // Update CSS
  checkout.element.heading.shipping.classList.remove("valid");
  checkout.element.button.cart.next.classList.remove("valid");
  checkout.element.navigation.cart.classList.remove("valid");
  checkout.element.navigation.shipping.classList.add("unavailable");
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
  const heading = 6;
  const subHeading = 6 * 3;
  const prints = (numberOfPrints ? 10 * numberOfPrints : 10);
  const discountInput = 8;
  const discounts = numberOfDiscounts * 2;
  const manufacturingSpeed = 3 * 2;
  const buttons = 12;
  const extra = (2 * 3) + 1; // Padding for Makes
  const total = heading + subHeading + prints + discountInput + discounts +
    manufacturingSpeed + buttons + extra;
  // SET THE CART PAGE SIZE
  if (checkout.element.windowSize.matches) {
    if (checkoutSelectedPage == 0) {
      document.querySelector("#checkout-cart").style = `height: ${total}vmax;`;
    } else {
      document.querySelector("#checkout-cart").style = "height: 6vmax;";
    }
  } else {
    document.querySelector("#checkout-cart").style = "height: 100%;";
  }
};

/*-----------------------------------------------------------------------------------------
SHIPPING
-----------------------------------------------------------------------------------------*/

// @FUNC  checkout.shipping.address.select
// @TYPE
// @DESC
// @ARGU
checkout.shipping.address.select = async (option, update) => {
  checkout.shipping.address.selected = option;
  if (option == "saved") {
    checkout.shipping.address.saved.show(true);
    checkout.shipping.address.new.show(false);
  } else if (option == "new") {
    checkout.shipping.address.saved.show(false);
    checkout.shipping.address.new.show(true);
  }
  checkout.shipping.resize();
  // UPDATE THE DATABASE (if required)
  if (update) {
    // CREATE UPDATES OBJECT
    const update = { property: ["shipping", "address", "option"], value: option };
    // PLACE LOADER
    checkout.load.load("updating order");
    // Update the Database
    let data;
    try {
      data = (await axios.post("/checkout/update", { updates: [update] }))["data"];
    } catch (error) {
      // TO DO.....
      // Error handling
      // TO DO.....
      return;
    }
    // ERROR HANDLER
    if (data.status === "failed") {
      // TO DO.....
      // Error handling
      // TO DO.....
      return;
    }
    // SUCCESS HANDLER
    checkout.load.success("saved");
    // Update Price
    checkout.amount.load(data.content.amount);
    // Update Bank Transfer Details
    checkout.payment.method.bank.detail(data.content.amount);
    // Perform Validation
    checkout.validate(data.content.validity);
  }
};

// @FUNC  checkout.shipping.address.saved.create
// @TYPE
// @DESC
// @ARGU
checkout.shipping.address.saved.create = address => {
  let unit = "";
  if (address.unit) {
    unit = `<div>${address.unit}</div>`;
  }
  const street = `<div>${address.street.number} ${address.street.name}</div>`;
  const suburb = `<div>${address.suburb}</div>`;
  const cityPostal = `<div>${address.city}, ${address.postcode}</div>`;
  const country = `<div>${address.country}</div>`;
  const html = unit + street + suburb + cityPostal + country;
  return html;
};

// @FUNC  checkout.shipping.address.saved.insert
// @TYPE
// @DESC
// @ARGU
checkout.shipping.address.saved.insert = html => {
  document.querySelector("#checkout-saved-address").innerHTML = html;
};

// @FUNC  checkout.shipping.address.saved.show
// @TYPE
// @DESC
// @ARGU
checkout.shipping.address.saved.show = show => {
  if (show) {
    document
      .querySelector("#checkout-saved-address")
      .classList.remove("checkout-element-hide");
  } else {
    document
      .querySelector("#checkout-saved-address")
      .classList.add("checkout-element-hide");
  }
};

// @FUNC  checkout.shipping.address.new.validate.unit
// @TYPE
// @DESC
// @ARGU
checkout.shipping.address.new.validate.unit = () => {
  const unit = document.querySelector("#checkout-new-address-unit").value;
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
  const streetNumber = document.querySelector("#checkout-new-address-street-number")
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
  const streetName = document.querySelector("#checkout-new-address-street-name")
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
  const suburb = document.querySelector("#checkout-new-address-suburb").value;
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
  const city = document.querySelector("#checkout-new-address-city").value;
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
  const postcode = document.querySelector("#checkout-new-address-postcode").value;
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
  const country = document.querySelector("#checkout-new-address-country").value;
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
  const valid = unit.valid && streetNumber.valid && streetName.valid && suburb.valid && city.valid && postcode.valid && country.valid;
  // Error Handling
  if (type == "unit") {
    document.querySelector("#checkout-shipping-unit-error").innerHTML = unit.message;
  } else if (type == "streetNumber") {
    document.querySelector("#checkout-shipping-street-number-error").innerHTML = streetNumber.message;
  } else if (type == "streetName") {
    document.querySelector("#checkout-shipping-street-name-error").innerHTML = streetName.message;
  } else if (type == "suburb") {
    document.querySelector("#checkout-shipping-suburb-error").innerHTML = suburb.message;
  } else if (type == "city") {
    document.querySelector("#checkout-shipping-city-error").innerHTML = city.message;
  } else if (type == "postcode") {
    document.querySelector("#checkout-shipping-postcode-error").innerHTML = postcode.message;
  } else if (type == "country") {
    document.querySelector("#checkout-shipping-country-error").innerHTML = country.message;
  } else {
    document.querySelector("#checkout-shipping-unit-error").innerHTML = unit.message;
    document.querySelector("#checkout-shipping-street-number-error").innerHTML = streetNumber.message;
    document.querySelector("#checkout-shipping-street-name-error").innerHTML = streetName.message;
    document.querySelector("#checkout-shipping-suburb-error").innerHTML = suburb.message;
    document.querySelector("#checkout-shipping-city-error").innerHTML = city.message;
    document.querySelector("#checkout-shipping-postcode-error").innerHTML = postcode.message;
    document.querySelector("#checkout-shipping-country-error").innerHTML = country.message;
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

// @FUNC  checkout.shipping.address.new.populate
// @TYPE
// @DESC
// @ARGU
checkout.shipping.address.new.populate = address => {
  document.querySelector("#checkout-new-address-unit").value = address.unit;
  document.querySelector("#checkout-new-address-street-number").value = address.street.number;
  document.querySelector("#checkout-new-address-street-name").value = address.street.name;
  document.querySelector("#checkout-new-address-suburb").value = address.suburb;
  document.querySelector("#checkout-new-address-city").value = address.city;
  document.querySelector("#checkout-new-address-postcode").value = address.postcode;
  document.querySelector("#checkout-new-address-country").value = address.country;
};

// @FUNC  checkout.shipping.address.new.update
// @TYPE
// @DESC
// @ARGU
checkout.shipping.address.new.update = async type => {
  const address = checkout.shipping.address.new.validate.all(type);
  // CREATE UPDATES OBJECT
  const update = { property: ["shipping", "address", "new"], value: address };
  // LOADER
  checkout.load.load("updating order");
  // Update the Database
  let data;
  try {
    data = (await axios.post("/checkout/update", { updates: [update] }))["data"];
  } catch (error) {
    // TO DO.....
    // Error handling
    // TO DO.....
    return;
  }
  // ERROR HANDLER
  if (data.status === "failed") {
    // TO DO.....
    // Error handling
    // TO DO.....
    return;
  }
  // SUCCESS HANDLER
  checkout.load.success("saved");
  // Update Price
  checkout.amount.load(data.content.amount);
  // Update Bank Transfer Details
  checkout.payment.method.bank.detail(data.content.amount);
  // Perform Validation
  checkout.validate(data.content.validity);
};

// @FUNC  checkout.shipping.address.new.toggleSave
// @TYPE
// @DESC
// @ARGU
checkout.shipping.address.new.toggleSave = async option => {
  // CREATE UPDATES OBJECT
  const update = { property: ["shipping", "address", "save"], value: option };
  // LOADER
  checkout.load.load("updating order");
  // Update the Database
  let data;
  try {
    data = (await axios.post("/checkout/update", { updates: [update] }))["data"];
  } catch (error) {
    // TO DO.....
    // Error handling
    // TO DO.....
    return;
  }
  // ERROR HANDLER
  if (data.status === "failed") {
    // TO DO.....
    // Error handling
    // TO DO.....
    return;
  }
  // SUCCESS HANDLER
  checkout.load.success("saved");
  // Update Price
  checkout.amount.load(data.content.amount);
  // Update Bank Transfer Details
  checkout.payment.method.bank.detail(data.content.amount);
  // Perform Validation
  checkout.validate(data.content.validity);
};

// @FUNC  checkout.shipping.address.new.show
// @TYPE
// @DESC
// @ARGU
checkout.shipping.address.new.show = show => {
  if (show) {
    document.querySelector("#checkout-new-address").classList.remove("checkout-element-hide");
  } else {
    document.querySelector("#checkout-new-address").classList.add("checkout-element-hide");
  }
};

// @FUNC  checkout.shipping.method.select
// @TYPE
// @DESC
// @ARGU
checkout.shipping.method.select = async option => {
  // CREATE UPDATES OBJECT
  const update = { property: ["shipping", "method"], value: option };
  // LOADER
  checkout.load.load("updating order");
  // Update the Database
  let data;
  try {
    data = (await axios.post("/checkout/update", { updates: [update] }))["data"];
  } catch (error) {
    // TO DO.....
    // Error handling
    // TO DO.....
    return;
  }
  // ERROR HANDLER
  if (data.status === "failed") {
    // TO DO.....
    // Error handling
    // TO DO.....
    return;
  }
  // SUCCESS HANDLER
  checkout.load.success("saved");
  // Update Price
  checkout.amount.load(data.content.amount);
  // Update Bank Transfer Details
  checkout.payment.method.bank.detail(data.content.amount);
  // Perform Validation
  checkout.validate(data.content.validity);
};

// @FUNC  checkout.shipping.validation.validate
// @TYPE  SIMPLE
// @DESC
// @ARGU
checkout.shipping.validation.validate = async validity => {
  let valid;
  if (validity) {
    valid = validity.cart && validity.shipping;
  } else {
    let data;
    try {
      data = (await axios.get("/checkout/validate"))["data"];
    } catch (error) {
      // TO DO.....
      // Error handling
      // TO DO.....
      return;
    }
    // ERROR HANDLER
    if (data.status === "failed") {
      // TO DO.....
      // Error handling
      // TO DO.....
      return;
    }
    // SUCCESS HANDLER
    valid = data.content.cart && data.content.shipping;
  }
  if (valid) {
    checkout.shipping.validation.valid();
  } else {
    checkout.shipping.validation.invalid();
  }
};

// @FUNC  checkout.shipping.validation.valid
// @TYPE  SIMPLE
// @DESC
// @ARGU
checkout.shipping.validation.valid = () => {
  checkout.element.heading.payment.addEventListener("click", checkout.payment.show);
  checkout.element.navigation.payment.addEventListener("click", checkout.payment.show);
  checkout.element.button.shipping.next.addEventListener("click", checkout.payment.show);
  // Update CSS
  checkout.element.button.shipping.next.classList.add("valid");
  checkout.element.heading.payment.classList.add("valid");
  checkout.element.navigation.shipping.classList.add("valid");
  checkout.element.navigation.payment.classList.remove("unavailable");
};

// @FUNC  checkout.shipping.validation.invalid
// @TYPE  SIMPLE
// @DESC
// @ARGU
checkout.shipping.validation.invalid = () => {
  checkout.element.heading.payment.removeEventListener("click", checkout.payment.show);
  checkout.element.navigation.payment.removeEventListener("click", checkout.payment.show);
  checkout.element.button.shipping.next.removeEventListener("click", checkout.payment.show);
  // Update CSS
  checkout.element.button.shipping.next.classList.remove("valid");
  checkout.element.navigation.shipping.classList.remove("valid");
  checkout.element.navigation.payment.classList.add("unavailable");
};

// @FUNC  checkout.shipping.show
// @TYPE  SIMPLE
// @DESC
// @ARGU
checkout.shipping.show = () => { checkout.navigation.navigate(1); };

checkout.shipping.resize = () => {
  // DESKTOP HEIGHT CALCULATION
  const heading = 8;
  const subHeading = 8 * 2;
  let address;
  if (checkout.shipping.address.selected === "saved") {
    address = {
      saved: 10,
      new: 3
    };
  } else if (checkout.shipping.address.selected === "new") {
    address = {
      saved: 3,
      new: 40.5
    };
  } else {
    address = {
      saved: 3,
      new: 3
    };
  }
  const error = 2;
  const padding = 2;
  const method = 3 * 3;
  const buttons = 12;
  const total = heading + subHeading + address.saved + address.new + error + padding + method + buttons;

  // SET THE CART PAGE SIZE
  if (checkout.element.windowSize.matches) {
    if (checkoutSelectedPage == 1) {
      document.querySelector("#checkout-shipping").style = "height: " + total + "vmax;";
    } else {
      document.querySelector("#checkout-shipping").style = "height: 6vmax;";
    }
  } else {
    document.querySelector("#checkout-shipping").style = "height: 100%;";
  }
};

/*-----------------------------------------------------------------------------------------
PAYMENT
-----------------------------------------------------------------------------------------*/

// @FUNC  checkout.payment.stripe.initialise
// @TYPE
// @DESC
// @ARGU
checkout.payment.stripe.initialise = () => {
  checkout.payment.stripe.element.stripe = Stripe("pk_test_cyWnxjuNQGbF42g88sLseXpJ003JGn4TCC");
  checkout.payment.stripe.element.elements = checkout.payment.stripe.element.stripe.elements();
  checkout.payment.stripe.element.card.number = checkout.payment.stripe.element.elements.create("cardNumber");
  checkout.payment.stripe.element.card.number.mount("#checkout-card-num");
  checkout.payment.stripe.element.card.expiry = checkout.payment.stripe.element.elements.create("cardExpiry");
  checkout.payment.stripe.element.card.expiry.mount("#checkout-card-exp");
  checkout.payment.stripe.element.card.cvc = checkout.payment.stripe.element.elements.create("cardCvc");
  checkout.payment.stripe.element.card.cvc.mount("#checkout-card-cvc");
  // ERROR HANDLER
  checkout.payment.stripe.errorHandler();
};

// @FUNC  checkout.payment.stripe.errorHandler
// @TYPE
// @DESC
// @ARGU
checkout.payment.stripe.errorHandler = () => {
  // CARD NUMBER
  checkout.payment.stripe.element.card.number.addEventListener(
    "change",
    ({ error }) => {
      const element = document.querySelector("#checkout-card-number-error");
      if (error) {
        element.textContent = "invalid";
      } else {
        element.textContent = "";
      }
    }
  );
  // CARD NAME
  checkout.payment.stripe.element.card.expiry.addEventListener(
    "change",
    ({ error }) => {
      const element = document.querySelector("#checkout-card-expiry-error");
      if (error) {
        element.textContent = "invalid";
      } else {
        element.textContent = "";
      }
    }
  );
  // CARD CVC
  checkout.payment.stripe.element.card.cvc.addEventListener(
    "change",
    ({ error }) => {
      const element = document.querySelector("#checkout-card-cvc-error");
      if (error) {
        element.textContent = "invalid";
      } else {
        element.textContent = "";
      }
    }
  );
};


// @FUNC  checkout.payment.method.select
// @TYPE
// @DESC
// @ARGU
checkout.payment.method.select = async (option, update) => {
  checkout.payment.method.selected = option;
  if (option === "bankTransfer") {
    document.querySelector("#checkout-payment-method-bank").checked = true;
    checkout.payment.method.bank.show(true);
    checkout.payment.method.card.show(false);
  } else if (option === "card") {
    document.querySelector("#checkout-payment-method-card").checked = true;
    checkout.payment.method.bank.show(false);
    checkout.payment.method.card.show(true);
  }
  checkout.payment.resize();

  if (update) {
    // CREATE UPDATES OBJECT
    const update = { property: ["payment", "method"], value: option };
    // LOADER
    checkout.load.load("updating order");
    // Update the Database
    let data;
    try {
      data = (await axios.post("/checkout/update", { updates: [update] }))["data"];
    } catch (error) {
      // TO DO.....
      // Error handling
      // TO DO.....
      return;
    }
    // ERROR HANDLER
    if (data.status === "failed") {
      // TO DO.....
      // Error handling
      // TO DO.....
      return;
    }
    // SUCCESS HANDLER
    checkout.load.success("saved");
    // Update Price
    checkout.amount.load(data.content.amount);
    // Update Bank Transfer Details
    checkout.payment.method.bank.detail(data.content.amount);
    // Perform Validation
    checkout.validate(data.content.validity);
  }
};

// @FUNC  checkout.payment.method.bank.detail
// @TYPE
// @DESC
// @ARGU
checkout.payment.method.bank.detail = (amount, wallet) => {
  if (amount) {
    // CALCULATE MINIMUM AMOUNT TO BANK TRANSFER
    const bonusRate = 0.05;
    const minimumAmount = checkout.priceFormatter(amount.total.total / (1 + bonusRate));
    document.querySelector("#checkout-bank-transfer-amount").innerHTML = `$${minimumAmount}`;
  }
  if (wallet) {
    // SET THE BANK TRANSFER REFERENCE
    document.querySelector("#checkout-bank-transfer-reference").innerHTML = wallet.code;
  }
  return;
}

// @FUNC  checkout.payment.method.bank.show
// @TYPE
// @DESC
// @ARGU
checkout.payment.method.bank.show = show => {
  if (show) {
    document
      .querySelector("#checkout-payment-bank-container")
      .classList.remove("checkout-element-hide");
  } else {
    document
      .querySelector("#checkout-payment-bank-container")
      .classList.add("checkout-element-hide");
  }
};

// @FUNC  checkout.payment.method.bank.paid
// @TYPE  ASYNC
// @DESC  Processes the payment of the order via bank transfer
// @ARGU
checkout.payment.method.bank.paid = async () => {
  // PREPARE PAGE USING LOADING ICON
  document.querySelector("#checkout-complete-container").classList.remove("checkout-element-hide");
  document.querySelector("#checkout-complete-text").textContent = "Processing Your Order...";
  // PROCESS THE ORDER
  try {
    await axios.get("/checkout/bank-transfer");
  } catch (error) {
    console.log(error);
    return;
  }
  // UPDATE DISPLAY TO SUCCESS CSS
  document.querySelector("#checkout-complete-loading-icon").innerHTML = `
    <svg class="checkmark-2" viewBox="0 0 52 52">
      <circle class="checkmark__circle-2" cx="26" cy="26" r="25" fill="none"></circle>
      <path class="checkmark__check-2" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"></path>
    </svg>
  `;
  document.querySelector("#checkout-complete-text").textContent = "Successfully Processed Your Order!";
  // REDIRECT TO HOME PAGE UPON COMPLETION
  setTimeout(() => { window.location.href = "/"; }, 2000);
};

// @FUNC  checkout.payment.method.card.pay
// @TYPE
// @DESC
// @ARGU
checkout.payment.method.card.pay = async () => {
  // PREPARE PAGE USING LOADING ICON
  document.querySelector("#checkout-complete-container").classList.remove("checkout-element-hide");
  document.querySelector("#checkout-complete-text").textContent = "Processing Your Order...";
  // FETCH A CLIENT SECRET
  let dataOne;
  try {
    dataOne = (await axios.get("/checkout/payment-intent"))["data"];
  } catch (error) {
    console.log(error);
    return;
  }
  // Validate the payment intent creation
  if (dataOne.status === "failed") {
    console.log(dataOne.content);
    return;
  }
  const clientSecret = dataOne.content;
  // PROCESS PAYMENT
  let paymentIntent;
  try {
    paymentIntent = await checkout.payment.method.card.process(clientSecret);
  } catch (error) {
    console.log(error);
    return;
  }
  // UPDATE ORDER
  const paymentIntentId = paymentIntent.id;
  let dataTwo;
  try {
    dataTwo = (await axios.post("/checkout/card-payment", { paymentIntentId }))["data"];
  } catch (error) {
    console.log(error);
    return;
  }
  if (dataTwo.status === "failed") {
    console.log(dataTwo.content);
    return;
  }
  // COMPLETE PROCESSING
  document.querySelector("#checkout-complete-loading-icon").innerHTML = `
    <svg class="checkmark-2" viewBox="0 0 52 52">
      <circle class="checkmark__circle-2" cx="26" cy="26" r="25" fill="none"></circle>
      <path class="checkmark__check-2" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"></path>
    </svg>
  `;
  document.querySelector("#checkout-complete-text").textContent = "Successfully Processed Your Order!";
  // REDIRECT TO HOME PAGE UPON COMPLETION
  setTimeout(() => { window.location.href = "/"; }, 2000);
};

// @FUNC  checkout.payment.method.card.process
// @TYPE
// @DESC
// @ARGU
checkout.payment.method.card.process = (clientSecret, options) => {
  return new Promise(async (resolve, reject) => {
    // CREATE THE OBJECT FOR PAYMENT CONFIRMATION
    const object = {
      payment_method: {
        card: checkout.payment.stripe.element.card.number
      }
    }
    // PROCESS THE PAYMENT
    let result;
    try {
      result = await checkout.payment.stripe.element.stripe.confirmCardPayment(clientSecret, object);
    } catch (error) {
      reject(error);
      return;
    }
    // VALIDATE RESULTS
    if (result.error) {
      reject(result.error.message);
      return;
    }
    // RETURN SUCCESSFUL RESULT
    resolve(result.paymentIntent);
    return;
  });
};

// @FUNC  checkout.payment.method.card.show
// @TYPE
// @DESC
// @ARGU
checkout.payment.method.card.show = show => {
  if (show) {
    document
      .querySelector("#checkout-payment-card-container")
      .classList.remove("checkout-element-hide");
  } else {
    document
      .querySelector("#checkout-payment-card-container")
      .classList.add("checkout-element-hide");
  }
};

// @FUNC  checkout.payment.validation.validate
// @TYPE  SIMPLE
// @DESC
// @ARGU
checkout.payment.validation.validate = async validity => {
  let valid;
  if (validity) {
    // Check if the validity object is provided
    valid = validity.cart && validity.shipping && validity.payment;
  } else {
    let data;
    try {
      data = (await axios.get("/checkout/validate"))["data"];
    } catch (error) {
      // TO DO.....
      // Error handling
      // TO DO.....
      return;
    }
    // ERROR HANDLER
    if (data.status === "failed") {
      // TO DO.....
      // Error handling
      // TO DO.....
      return;
    }
    // SUCCESS HANDLER
    valid = data.content.cart && data.content.shipping && data.content.payment;
  }
  if (valid) {
    checkout.payment.validation.valid();
  } else {
    checkout.payment.validation.invalid();
  }
};

// @FUNC  checkout.payment.validation.valid
// @TYPE  SIMPLE
// @DESC
// @ARGU
checkout.payment.validation.valid = () => {
  // Event Listeners
  checkout.element.button.payment.bank.paid.addEventListener("click", checkout.payment.method.bank.paid);
  checkout.element.button.payment.card.pay.addEventListener("click", checkout.payment.method.card.pay);
  // CSS
  checkout.element.button.payment.bank.paid.classList.add("valid");
  checkout.element.button.payment.card.pay.classList.add("valid");
  checkout.element.navigation.payment.classList.add("valid");
};

// @FUNC  checkout.payment.validation.invalid
// @TYPE  SIMPLE
// @DESC
// @ARGU
checkout.payment.validation.invalid = () => {
  // Event Listeners
  checkout.element.button.payment.bank.paid.removeEventListener("click", checkout.payment.method.bank.paid);
  checkout.element.button.payment.card.pay.removeEventListener("click", checkout.payment.method.card.pay);
  // CSS
  checkout.element.button.payment.bank.paid.classList.remove("valid");
  checkout.element.button.payment.card.pay.classList.remove("valid");
  checkout.element.navigation.payment.classList.remove("valid");
};

// @FUNC  checkout.payment.show
// @TYPE  SIMPLE
// @DESC
// @ARGU
checkout.payment.show = () => {
  checkout.navigation.navigate(2);
};

// @FUNC  checkout.payment.resize
// @TYPE  SIMPLE
// @DESC
// @ARGU
checkout.payment.resize = () => {
  // DESKTOP HEIGHT CALCULATION
  const heading = 8;
  let buttons = 0;
  let method = 0;
  if (checkout.payment.method.selected == "bankTransfer") {
    buttons = 12;
    method = 26.5;
  } else if (checkout.payment.method.selected == "card") {
    buttons = 12;
    method = 7.5;
  }

  const bonus = 2;
  const option = 3 * 2;
  const total = heading + buttons + method + bonus + option;

  // SET THE CART PAGE SIZE
  if (checkout.element.windowSize.matches) {
    if (checkoutSelectedPage === 2) {
      document.querySelector("#checkout-payment").style = `height: ${total}vmax;`;
    } else {
      document.querySelector("#checkout-payment").style = "height: 6vmax;";
    }
  } else {
    document.querySelector("#checkout-payment").style = "height: 100%;";
  }
};

/*-----------------------------------------------------------------------------------------
NAVIGATION
-----------------------------------------------------------------------------------------*/

let checkoutPages = ["cart", "shipping", "payment", "complete"];
let checkoutSelectedPage = 0;

// @FUNC  checkout.navigation.navigate
// @TYPE
// @DESC
// @ARGU
checkout.navigation.navigate = nextPage => {
  // Check if we are currently on the same page
  if (nextPage == checkoutSelectedPage) return;
  // Update the navigation CSS
  checkout.navigation.changeCSS.navigation(nextPage, "select");
  checkout.navigation.changeCSS.page(nextPage);
  // Update the current selected page
  checkoutSelectedPage = nextPage;
  checkout.cart.resize();
  checkout.shipping.resize();
  checkout.payment.resize();
};

// @FUNC  checkout.navigation.changeCSS.navigation
// @TYPE
// @DESC
// @ARGU
checkout.navigation.changeCSS.navigation = (nextPage, type) => {
  const nextPageName = checkoutPages[nextPage];
  const currentPageName = checkoutPages[checkoutSelectedPage];
  document
    .querySelector(`#checkout-navigation-${nextPageName}`)
    .classList.add("checkout-navigation-icon-container-selected");
  document
    .querySelector(`#checkout-navigation-${nextPageName}`)
    .classList.remove("checkout-navigation-icon-container-deselected");
  document
    .querySelector(`#checkout-navigation-${currentPageName}`)
    .classList.remove("checkout-navigation-icon-container-selected");
  document
    .querySelector(`#checkout-navigation-${currentPageName}`)
    .classList.add("checkout-navigation-icon-container-deselected");
};

// @FUNC  checkout.navigation.changeCSS.page
// @TYPE
// @DESC
// @ARGU
checkout.navigation.changeCSS.page = nextPage => {
  const nextPageName = checkoutPages[nextPage];
  if (nextPage > checkoutSelectedPage) {
    document.querySelector(`#checkout-${nextPageName}`).classList.remove("right");
    for (let i = checkoutSelectedPage; i < nextPage; i++) {
      const currentPageName = checkoutPages[i];
      document.querySelector(`#checkout-${currentPageName}`).classList.remove("right");
      document.querySelector(`#checkout-${currentPageName}`).classList.add("left");
    }
  } else {
    document.querySelector(`#checkout-${nextPageName}`).classList.remove("left");
    for (let i = checkoutSelectedPage; i > nextPage; i--) {
      const currentPageName = checkoutPages[i];
      document.querySelector(`#checkout-${currentPageName}`).classList.remove("left");
      document.querySelector(`#checkout-${currentPageName}`).classList.add("right");
    }
  }
};

checkout.load.success = message => {
  clearTimeout(checkout.load.time);
  document.querySelector(
    "#checkout-loading-display-load"
  ).innerHTML = `<svg class="checkmark" viewBox="0 0 52 52">
  <circle
    class="checkmark__circle"
    cx="26"
    cy="26"
    r="25"
    fill="none"
  ></circle>
  <path
    class="checkmark__check"
    fill="none"
    d="M14.1 27.2l7.1 7.2 16.7-16.8"
  ></path>
</svg>`;
  document.querySelector("#checkout-loading-display-text").innerHTML = message;
  checkout.load.time = setTimeout(() => {
    document.querySelector("#checkout-loading-display").classList.add("hide");
  }, 1300);
};

checkout.load.load = message => {
  document.querySelector(
    "#checkout-loading-display-load"
  ).innerHTML = `<div class="load-2">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>`;
  document.querySelector("#checkout-loading-display-text").innerHTML = message;
  document.querySelector("#checkout-loading-display").classList.remove("hide");
};

/*=========================================================================================
END
=========================================================================================*/
