/*=========================================================================================
REQUIRED MODULES
=========================================================================================*/

const mongoose = require("mongoose");
const moment = require("moment-timezone");

/*=========================================================================================
VARIABLES
=========================================================================================*/

const Schema = mongoose.Schema;

/*=========================================================================================
MODELS
=========================================================================================*/

const Account = require("./Account.js");
const Transaction = require("./Transaction.js");
const Customer = require("./Customer.js");
const Comment = require("./Comment.js");
const Make = require("./Make.js");
const Discount = require("./Discount.js");

/*=========================================================================================
CREATE ORDER MODEL
=========================================================================================*/

const OrderSchema = new Schema({
  accountId: { type: Schema.Types.ObjectId },
  sessionId: { type: String },
  number: { type: Number, default: 0 },
  status: { type: String, required: true },
  makes: {
    awaitingQuote: { type: [Schema.Types.ObjectId], default: [] },
    checkout: { type: [Schema.Types.ObjectId], default: [] },
  },
  discounts: { type: [Schema.Types.ObjectId], default: [] },
  manufacturingSpeed: { type: String, default: "" },
  shipping: {
    address: {
      option: { type: String, default: "" },
      saved: {
        recipient: { type: String, default: "" },
        unit: { type: String, default: "" },
        street: {
          number: { type: String, default: "" },
          name: { type: String, default: "" }
        },
        suburb: { type: String, default: "" },
        city: { type: String, default: "" },
        postcode: { type: String, default: "" },
        country: { type: String, default: "" }
      },
      new: {
        recipient: { type: String, default: "" },
        unit: { type: String, default: "" },
        street: {
          number: { type: String, default: "" },
          name: { type: String, default: "" }
        },
        suburb: { type: String, default: "" },
        city: { type: String, default: "" },
        postcode: { type: String, default: "" },
        country: { type: String, default: "" }
      },
      save: { type: Boolean, default: true },
    },
    method: { type: String, default: "" },
    tracking: { type: String, default: "" }
  },
  payment: {
    method: { type: String, default: "" },
    amount: {
      makes: { type: Schema.Types.Mixed, default: {} },
      manufacturing: { type: Schema.Types.Mixed, default: {} },
      discount: { type: Schema.Types.Mixed, default: {} },
      gst: { type: Schema.Types.Mixed, default: {} },
      shipping: { type: Schema.Types.Mixed, default: {} },
      total: { type: Schema.Types.Mixed, default: {} }
    },
    transaction: { type: Schema.Types.ObjectId }
  },
  comments: { type: [Schema.Types.ObjectId], default: [] },
  date: {
    created: { type: String, default: "" },
    checkedout: { type: String, default: "" },
    validated: { type: String, default: "" },
    built: { type: String, default: "" },
    shipped: { type: String, default: "" },
    arrived: { type: String, default: "" },
    reviewed: { type: String, default: "" },
    completed: { type: String, default: "" },
    cancelled: { type: String, default: "" },
    modified: { type: String, default: "" },
  }
});

/*=========================================================================================
MIDDLEWARE
=========================================================================================*/

OrderSchema.pre("save", async function (next) {
  const date = moment().tz("Pacific/Auckland").format();
  // update the date modified property
  if (this.isModified()) this.date.modified = date;
  if (this.isModified("status")) this.date[this.status] = date;
  return next();
});

/*=========================================================================================
STATIC - MODEL
=========================================================================================*/

// @FUNC  build
// @TYPE  STATICS
// @DESC
OrderSchema.statics.build = function (object = {}, save = true) {
  return new Promise(async (resolve, reject) => {
    // TO DO .....
    // VALIDATE EACH PROPERTY
    // TO DO .....
    // CREATE THE DOCUMENT
    let order = new this(object);
    if (save) {
      try {
        order = await order.save();
      } catch (error) {
        return reject({ status: "error", content: error });
      }
    }
    return resolve(order);
  });
}

// @FUNC  merge
// @TYPE  STATICS
// @DESC
OrderSchema.statics.merge = function (accountId, sessionId) {
  return new Promise(async (resolve, reject) => {
    // DECLARE AND INITIALISE VARIABLES
    const status = "created";
    // FETCH THE ORDER WITH THE CORRESPONDING SESSION ID
    let sessionOrder;
    try {
      sessionOrder = await this.findOne({ sessionId, status });
    } catch (error) {
      return reject(error);
    }
    // FETCH THE ORDER WITH THE CORRESPONDING ACCOUNT ID
    let accountOrder;
    try {
      accountOrder = await this.findOne({ accountId, status });
    } catch (error) {
      return reject(error);
    }
    // MERGE ORDER PROCESS
    // TO DO.....
    // Merge properties of each order more intelligently
    // TO DO.....
    let order;
    if (accountOrder) {
      order = accountOrder;
    } else if (sessionOrder) {
      order = sessionOrder;
      order.accountId = accountId;
    }
    // SAVE ORDER
    if (order) {
      try {
        await order.save();
      } catch (error) {
        return reject(error);
      }
    }
    // RETURN PROMISE RESOLVE
    return resolve();
  })
}

// @FUNC  fetch
// @TYPE  STATICS
// @DESC
OrderSchema.statics.fetch = function (query = {}, withMakes = false, withComments = false,
  withTransaction = false) {
  return new Promise(async (resolve, reject) => {
    // FETCH ORDERS
    let orders = [];
    let formattedOrders = [];
    try {
      orders = await this.find(query);
    } catch (error) {
      return reject({ status: "error", content: error });
    }
    // CHECK IF THERE ARE ORDERS FOUND
    if (!orders.length) return resolve(orders);
    for (let i = 0; i < orders.length; i++) formattedOrders[i] = orders[i].toObject();
    // FETCH MAKES
    if (withMakes) {
      let promises = [];
      for (let i = 0; i < formattedOrders.length; i++) promises.push(Make.fetch({ _id: formattedOrders[i].makes.checkout }));
      // fetch comments of each order asynchronously
      let makesArray;
      try {
        makesArray = await Promise.all(promises);
      } catch (error) {
        return reject(error);
      }
      for (let j = 0; j < makesArray.length; j++) {
        const makes = makesArray[j];
        formattedOrders[j].makes.checkout = makes;
      }
    }
    // FETCH COMMENTS
    if (withComments) {
      // construct the promises for fetching comments of each order
      let promises = [];
      for (let i = 0; i < formattedOrders.length; i++) promises.push(Comment.fetch({ _id: formattedOrders[i].comments }));
      // fetch comments of each order asynchronously
      let commentsArray;
      try {
        commentsArray = await Promise.all(promises);
      } catch (error) {
        return reject(error);
      }
      for (let j = 0; j < commentsArray.length; j++) {
        const comments = commentsArray[j];
        formattedOrders[j].comments = comments;
      }
    }
    // FETCH TRANSACTIONS
    if (withTransaction) {

    }
    // SUCCESS HANDLER
    return resolve(formattedOrders);
  });
}

// @FUNC  transaction
// @TYPE  STATICS
// @DESC  
OrderSchema.statics.transaction = function (query, save = true) {
  return new Promise(async (resolve, reject) => {
    let order;
    // Fetch existing active order
    try {
      order = await this.findOne(query);
    } catch (error) {
      return reject({ status: "error", content: error });
    }
    // VALIDATE THE ORDER
    const validity = order.validateAll();
    if (!(validity.cart && validity.shipping && validity.payment)) {
      return reject({ status: "failed", content: "order is not valid" });
    }
    // UPDATE CUSTOMER ADDRESS (if required)
    if (order.shipping.address.option === "new" && order.shipping.address.save) {
      try {
        await order.saveAddress();
      } catch (error) {
        return reject(error);
      }
    }
    // PROCESS TRANSACTION - CREATE TRANSACTION INSTANCE AND UPDATE MAKES
    try {
      await order.transact();
    } catch (error) {
      return reject(error);
    }
    // FETCH ORDERS THAT HAS BEEN CHECKEDOUT
    let orders;
    try {
      orders = await this.find({
        status: ["checkedout", "validated", "built", "shipped",
          "arrived", "reviewed", "completed", "cancelled"]
      });
    } catch (error) {
      return reject({ status: "error", content: error });
    }
    order.number = orders.length + 1;
    // Update the order's status
    order.updateStatus("checkedout");
    // Save the updated order
    if (save) {
      try {
        await order.save();
      } catch (error) {
        return reject({ status: "error", content: error });
      }
    }
    // SUCCESS RESPONSE
    return resolve(order);
  })
}

// @FUNC  process
// @TYPE  STATICS
// @DESC
OrderSchema.statics.process = function (query = {}) {
  return new Promise(async (resolve, reject) => {
    // FETCH ORDERS FOR THE GIVEN QUERY
    let orders;
    try {
      orders = await this.find(query);
    } catch (error) {
      return reject({ status: "error", content: error });
    }
    // GROUP ORDERS BY STATUS AND PROCESS EACH GROUP
    // checkedout
    const checkedout = orders.filter(order => order.status === "checkedout");
    if (checkedout.length) {
      for (let i = 0; i < checkedout.length; i++) {
        let order = checkedout[i];
        let proceed;
        try {
          proceed = await order.processCheckedout();
        } catch (error) {
          return reject(error);
        }
        try {
          await order.save();
        } catch (error) {
          return reject({ status: "error", content: error });
        }
        if (proceed === false) break;
      }
    }
    // SUCCESS HANDLER
    return resolve();
  });
}

/*=========================================================================================
METHODS - DOCUMENT
=========================================================================================*/

// @FUNC  saveAddress
// @TYPE  METHODS
// @DESC
OrderSchema.methods.saveAddress = function () {
  return new Promise(async (resolve, reject) => {
    // FETCH THE ORDER OWNER'S DETAILS
    let customer;
    try {
      customer = await Customer.findOne({ accountId: this.accountId });
    } catch (error) {
      return reject({ status: "error", content: error });
    }
    // UPDATE ADDRESS
    customer.address = this.shipping.address.saved;
    // SAVE CUSTOMER
    try {
      await customer.save();
    } catch (error) {
      return reject({ status: "error", content: error });
    }
    // SUCCESS RESPONSE
    return resolve();
  })
};

/* ----------------------------------------------------------------------------------------
PROCESSING
---------------------------------------------------------------------------------------- */

// @FUNC  processCheckedout
// @TYPE  METHODS
// @DESC  
OrderSchema.methods.processCheckedout = function () {
  return new Promise(async (resolve, reject) => {
    const transactionId = this.payment.transaction;
    try {
      transaction = await Transaction.process(transactionId);
    } catch (data) {
      return reject(data);
    }
    let proceed = false;
    if (transaction.status === "succeeded") {
      this.updateStatus("validated");
      proceed = true;
    };
    return resolve(proceed);
  });
}

// @FUNC  processValidated
// @TYPE  METHODS
// @DESC  
OrderSchema.methods.processValidated = function () {
  return new Promise(async (resolve, reject) => {
    // FETCH MAKES
    let makes;
    try {
      makes = await Make.fetch({ _id: this.makes.checkout });
    } catch (data) {
      return reject(data);
    }
    // VALIDATE MAKES
    for (let i = 0; i < makes.length; i++) {
      const make = makes[i];
      const orderedQuantity = make.quantity.ordered;
      const builtQuantity = make.quantity.built;
      if (orderedQuantity > builtQuantity) {
        return reject({ status: "failed", content: "not finish building" });
      }
    }
    // UPDATE ORDER
    this.updateStatus("built");
    // SUCCESS HANDLER
    return resolve();
  });
}

// @FUNC  processBuilt
// @TYPE  METHODS
// @DESC  
OrderSchema.methods.processBuilt = function () {
  return new Promise(async (resolve, reject) => {
    // CHECK IF ORDER HAS TRACKING IF IT'S NOT PICKUP
    if (this.shipping.method !== "pickup" && !this.shipped.tracking) {
      return reject({ status: "failed", content: "tracking number required" });
    }
    // UPDATE ORDER
    this.updateStatus("shipped");
    // SUCCESS HANDLER
    return resolve();
  });
}

/* ----------------------------------------------------------------------------------------
TRANSACT
---------------------------------------------------------------------------------------- */

// @FUNC  transactMakes
// @TYPE  METHODS
// @DESC  Creates the transaction instance and update the order's transaction-related
//        properties
OrderSchema.methods.transactMakes = function () {
  return new Promise(async (resolve, reject) => {
    // FETCH MAKES
    let makes = [];
    try {
      makes = await Make.find({ _id: this.makes.checkout });
    } catch (error) {
      return reject({ status: "error", content: error });
    }
    // Update each make and prepare promises
    let promises = [];
    for (let i = 0; i < makes.length; i++) {
      let make = makes[i];
      make.status = "purchased";
      promises.push(make.save());
    }
    // Save all makes
    try {
      await Promise.all(promises);
    } catch (error) {
      return reject({ status: "error", content: error });
    }
    // SUCCESS RESPONSE
    return resolve();
  })
}

// @FUNC  transact
// @TYPE  METHODS
// @DESC  Creates the transaction instance and update the order's transaction-related
//        properties
OrderSchema.methods.transact = function () {
  return new Promise(async (resolve, reject) => {
    // Amount details
    let amount;
    try {
      amount = await this.amount();
    } catch (error) {
      return reject(error);
    }
    this.payment.amount = amount;
    // CREATE THE CHECKOUT TRANSACTION INSTANCE
    let transaction;
    try {
      transaction = await Transaction.checkout(this._id, this.accountId, amount.total.total);
    } catch (error) {
      return reject(error);
    }
    // UPDATE THE ORDER'S TRANSACTION DETAILS
    this.payment.transaction = transaction._id;
    // UPDATE MAKES
    try {
      await this.transactMakes();
    } catch (error) {
      return reject(error);
    }
    // SUCCESS RESPONSE
    return resolve();
  })
}

/* ----------------------------------------------------------------------------------------
AMOUNT CALCULATION
---------------------------------------------------------------------------------------- */

// @FUNC  amountMakes
// @TYPE  METHODS
// @DESC  
OrderSchema.methods.amountMakes = function () {
  return new Promise(async (resolve, reject) => {
    // FETCH THE ORDER'S MAKES
    let makes = [];
    try {
      makes = await Make.find({ _id: this.makes.checkout });
    } catch (error) {
      return reject({ status: "error", content: error });
    }
    // CONSTRUCT THE AMOUNT OBJECT
    let amount = { status: "", total: 0 };
    amount.status = (makes.length ? "valid" : "invalid");
    // Calculate total amount
    for (let i = 0; i < makes.length; i++) {
      const make = makes[i];
      amount.total += (make.quantity.ordered * make.price);
    }
    // RETURN SUCCESS RESPONSE
    return resolve(amount);
  })
}

// @FUNC  amountManufacturing
// @TYPE  METHODS
// @DESC  
OrderSchema.methods.amountManufacturing = function () {
  // CREATE THE AMOUNT OBJECT
  let amount = { status: "", rate: 0, total: 0 };
  switch (this.manufacturingSpeed) {
    case "normal":
      amount.status = "valid";
      break;
    case "urgent":
      amount.status = "valid";
      amount.rate = 0.3;
      break;
    default:
      amount.status = "invalid";
  }
  // RETURN SUCCESS RESPONSE
  return amount;
}

// @FUNC  amountDiscount
// @TYPE  METHODS
// @DESC  
OrderSchema.methods.amountDiscount = function () {
  return new Promise(async (resolve, reject) => {
    // FETCH THE ORDER'S DISCOUNTS
    let discounts = [];
    try {
      discounts = await Discount.find({ _id: this.discounts });
    } catch (error) {
      return reject({ status: "error", content: error });
    }
    // CONSTRUCT THE AMOUNT OBJECT
    let amount = { status: "valid", rate: 0, total: 0 };
    for (let i = 0; i < discounts.length; i++) {
      const discount = discounts[i];
      amount.rate += discount.rate;
    }
    if (amount.rate > 0.6) amount.rate = 0.6;
    // RETURN SUCCESS RESPONSE
    return resolve(amount);
  })
}

// @FUNC  amountGST
// @TYPE  METHODS
// @DESC  
OrderSchema.methods.amountGST = function () {
  // CONSTRUCT THE AMOUNT OBJECT
  const amount = { status: "valid", rate: 0.15, total: 0 };
  // RETURN SUCCESS RESPONSE
  return amount;
}

// @FUNC  amountShipping
// @TYPE  METHODS
// @DESC  
OrderSchema.methods.amountShipping = function () {
  // CREATE THE AMOUNT OBJECT
  let amount = { status: "", total: 0 };
  switch (this.shipping.method) {
    case "pickup":
      amount.status = "valid";
      break;
    case "tracked":
      amount.status = "valid";
      amount.total = 6.5;
      break;
    case "courier":
      amount.status = "valid";
      amount.total = 8;
      break;
    default:
      amount.status = "invalid";
  }
  // RETURN SUCCESS RESPONSE
  return amount;
}

// @FUNC  amount
// @TYPE  METHODS
// @DESC  
OrderSchema.methods.amount = function () {
  return new Promise(async (resolve, reject) => {
    // DECLARE AND INITIALISE VARIABLES
    // Make
    let makes;
    try {
      makes = await this.amountMakes();
    } catch (error) {
      return reject(error);
    }
    // Manufacturing
    let manufacturing = this.amountManufacturing();
    // Discount
    let discount;
    try {
      discount = await this.amountDiscount();
    } catch (error) {
      return reject(error);
    }
    // GST
    let gst = this.amountGST();
    // Shipping
    const shipping = this.amountShipping();
    // CREATE THE AMOUNT OBJECT
    let total = { status: "", total: 0 };
    if (manufacturing.status === "valid") {
      manufacturing.total = price(makes.total * manufacturing.rate);
      discount.total = price((makes.total + manufacturing.total) * discount.rate);
      gst.total = price(((makes.total + manufacturing.total) - discount.total) * gst.rate);
      total.total = price((((makes.total + manufacturing.total) - discount.total) + gst.total) + shipping.total);
    } else {
      discount.status = "invalid";
      gst.status = "invalid";
      total.status = "invalid";
    }
    const amount = { makes, manufacturing, discount, gst, shipping, total };
    // RETURN SUCCESS RESPONSE
    return resolve(amount);
  })
}

/* ----------------------------------------------------------------------------------------
UPDATE
---------------------------------------------------------------------------------------- */

// @FUNC  updateStatus
// @TYPE  METHODS
// @DESC
OrderSchema.methods.updateStatus = function (status) {
  // DECLARE AND INITIALISE VARIABLES
  const statuses = ["created", "checkedout", "validated", "built",
    "shipped", "arrived", "reviewed", "completed", "cancelled"];
  // VALIDATION
  if (statuses.indexOf(status) === -1) return reject("invalid status");
  // SET THE ORDER'S RELEVANT PROPERTIES
  // Date
  const date = moment().tz("Pacific/Auckland").format();
  this.date[status] = date;
  this.date.modified = date;
  // Status
  this.status = status;
  // RESOLVE PROMISE
  return;
};

// @FUNC  updateMakes
// @TYPE  METHODS
// @DESC  
OrderSchema.methods.updateMakes = function () {
  return new Promise(async (resolve, reject) => {
    // CREATE THE ORDER FIND OBJECT
    let query;
    if (this.accountId) {
      query = { accountId: this.accountId };
    } else {
      query = { sessionId: this.sessionId };
    }
    // FETCH THE MAKES OF THE OWNER OF THE ORDER
    let makes;
    try {
      makes = await Make.find(query);
    } catch (error) {
      return reject({ status: "error", content: error });
    }
    // UPDATE ORDER'S MAKES
    const filteredMakes = {
      awaitingQuote: makes.filter(make => make.status === "awaitingQuote"),
      checkout: makes.filter(make => make.status === "checkout")
    }
    this.makes.awaitingQuote = filteredMakes.awaitingQuote.map(make => make._id);
    this.makes.checkout = filteredMakes.checkout.map(make => make._id);
    // RETURN SUCCESS RESPONSE
    return resolve(filteredMakes);
  })
}

// @FUNC  updateDiscounts
// @TYPE  METHODS
// @DESC  
OrderSchema.methods.updateDiscounts = function () {
  return new Promise(async (resolve, reject) => {
    const today = moment().tz("Pacific/Auckland").format("YYYY-MM-DD");
    const todayMoment = moment(today);
    // FETCH REQUIRED INSTANCES
    let discounts, account;
    try {
      [discounts, account] = await Promise.all([Discount.find(), Account.findOne({ accountId: this.accountId })]);
    } catch (error) {
      return reject(error);
    }
    // EVALUATION
    // Duration
    discounts = discounts.filter(discount => {
      const startMoment = moment(discount.duration.start);
      switch (discount.duration.type) {
        case "unlimited":
          if (todayMoment.diff(startMoment) >= 0) return true;
          break;
        case "limited":
          const endMoment = moment(discount.duration.end);
          if ((todayMoment.diff(startMoment) >= 0) && (endMoment.diff(todayMoment) >= 0)) return true;
          break;
        default:
          break;
      }
      return false
    });
    // Audience
    discounts = discounts.filter(discount => {
      switch (discount.audience.type) {
        case "global":
          return true;
        case "account":
          if (discount.audience.accounts.indexOf(account.type) !== -1) return true;
          break;
        case "customer":
          if (discount.audience.customers.indexOf(account._id) !== -1) return true;
          break;
        default:
          break;
      }
      return false
    });
    // Usage
    discounts = discounts.filter(async (discount) => {
      switch (discount.usage.type) {
        case "unlimited":
          return true;
        case "limited":
          // COUNT NUMBER OF USES
          let uses;
          try {
            uses = await mongoose.model("orders", OrderSchema).find({
              accountId: account._id, status: ["checkedout", "validated", "built",
                "shipped", "arrived", "reviewed", "completed"]
            });
          } catch (error) {
            console.log("Failed to Filter Discount with Limited Usage")
            return false;
          }
          if (uses.length < discount.usage.limit) return true;
          break;
        default:
          break;
      }
      return false;
    })
    // UPDATE ORDER'S DISCOUNTS
    this.discounts = discounts.map(discount => discount._id);
    // SUCCESS RESPONSE
    return resolve(discounts);
  })
}

// @FUNC  updateSavedAddress
// @TYPE  METHODS
// @DESC  
OrderSchema.methods.updateSavedAddress = function () {
  return new Promise(async (resolve, reject) => {
    // CHECK IF THE ORDER HAS AN OWNER
    if (!(this.accountId)) {
      return resolve();
    }
    // FETCH THE ORDER OWNER'S DETAIL
    let customer;
    try {
      customer = await Customer.findOne({ accountId: this.accountId });
    } catch (error) {
      return reject(error);
    }
    // UPDATE ORDER'S SAVED ADDRESS
    this.shipping.address.saved = customer.address;
    // RETURN SUCCESS RESPONSE
    return resolve();
  })
}

// @FUNC  update
// @TYPE  METHODS
// @DESC  
OrderSchema.methods.update = function (updates) {
  // UPDATE ORDER
  for (let i = 0; i < updates.length; i++) {
    const update = updates[i];
    switch (update.property.length) {
      case 1:
        this[update.property[0]] = update.value;
        break;
      case 2:
        this[update.property[0]][update.property[1]] = update.value;
        break;
      case 3:
        this[update.property[0]][update.property[1]]
        [update.property[2]] = update.value;
        break;
      case 4:
        this[update.property[0]][update.property[1]]
        [update.property[2]][update.property[3]] = update.value;
        break;
      default:
        return;
    }
  }
  // SUCCESS RESPONSE
  return;
}

/* ----------------------------------------------------------------------------------------
VALIDATION
---------------------------------------------------------------------------------------- */

// @FUNC  validateCart
// @TYPE  METHODS
// @DESC
OrderSchema.methods.validateCart = function () {
  // MAKES
  if (!(this.makes.checkout.length)) return false;
  // MANUFACTURING SPEED
  if (!this.manufacturingSpeed) return false;
  // SUCCESS RESPONSE
  return true;
};

// @FUNC  validateShipping
// @TYPE  METHODS
// @DESC
OrderSchema.methods.validateShipping = function () {
  // ADDRESS OPTION
  if (!this.shipping.address.option) return false;
  // ADDRESSES
  if (this.shipping.address.option === "saved") {
    const data = checkAddressValidity(this.shipping.address.saved);
    if (data.status === "failed") return false;
  } else if (this.shipping.address.option === "new") {
    const data = checkAddressValidity(this.shipping.address.new);
    if (data.status === "failed") return false;
  }
  // METHOD
  if (!this.shipping.method) return false;
  // SUCCESS RESPONSE
  return true;
};

// @FUNC  validate
// @TYPE  METHODS
// @DESC
OrderSchema.methods.validateAll = function () {
  const cart = this.validateCart();
  const shipping = this.validateShipping();
  return { cart, shipping: (cart && shipping), payment: (cart && shipping) };
};

/*=========================================================================================
FUNCTIONS
=========================================================================================*/

const checkAddressValidity = (address) => {
  // STREET NAME
  if (!address.street.name) {
    return { status: "failed", content: "no street name" };
  }
  // STREET NUMBER
  if (!address.street.number) {
    return { status: "failed", content: "no street number" };
  }
  // SUBURB
  if (!address.suburb) {
    return { status: "failed", content: "no suburb" };
  }
  // CITY
  if (!address.city) {
    return { status: "failed", content: "no city" };
  }
  // POSTCODE
  if (!address.postcode) {
    return { status: "failed", content: "no postcode" };
  }
  // COUNTRY
  if (!address.country) {
    return { status: "failed", content: "no country" };
  }
  // SUCCESS RESPONSE
  return { status: "success", content: "valid address" };
};

const price = value => (Math.round(Number(value) * 100)) / 100;

/*=========================================================================================
EXPORT ORDER MODEL
=========================================================================================*/

module.exports = Order = mongoose.model("orders", OrderSchema);

/*=========================================================================================
END
=========================================================================================*/
