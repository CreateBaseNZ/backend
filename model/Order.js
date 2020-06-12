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
const Make = require("./Make.js");
const Discount = require("./Discount.js");

/*=========================================================================================
SUB MODELS
=========================================================================================*/

const AddressSchema = new Schema({
  recipient: {
    type: String,
    default: ""
  },
  unit: {
    type: String,
    default: ""
  },
  street: {
    number: {
      type: String,
      default: ""
    },
    name: {
      type: String,
      default: ""
    },
  },
  suburb: {
    type: String,
    default: ""
  },
  city: {
    type: String,
    default: ""
  },
  postcode: {
    type: String,
    default: ""
  },
  country: {
    type: String,
    default: ""
  }
});

/*=========================================================================================
CREATE ORDER MODEL
=========================================================================================*/

const OrderSchema = new Schema({
  accountId: {
    type: Schema.Types.ObjectId,
  },
  sessionId: {
    type: String,
  },
  status: {
    type: String,
    required: true
  },
  makes: {
    awaitingQuote: {
      type: [Schema.Types.ObjectId],
      default: []
    },
    checkout: {
      type: [Schema.Types.ObjectId],
      default: []
    },
  },
  discounts: {
    type: [Schema.Types.ObjectId],
    default: [],
  },
  manufacturingSpeed: {
    type: String,
    default: "",
  },
  shipping: {
    address: {
      option: {
        type: String,
        default: ""
      },
      saved: {
        type: AddressSchema,
        default: AddressSchema
      },
      new: {
        type: AddressSchema,
        default: AddressSchema
      },
      save: {
        type: Boolean,
        default: true
      },
    },
    method: {
      type: String,
      default: "",
    },
  },
  payment: {
    method: {
      type: String,
      default: "",
    },
    transaction: {
      type: Schema.Types.ObjectId
    }
  },
  comments: {
    type: [Schema.Types.ObjectId],
    default: [],
  },
  date: {
    created: {
      type: String,
      default: "",
    },
    checkedout: {
      type: String,
      default: "",
    },
    validated: {
      type: String,
      default: "",
    },
    built: {
      type: String,
      default: "",
    },
    shipped: {
      type: String,
      default: "",
    },
    arrived: {
      type: String,
      default: "",
    },
    reviewed: {
      type: String,
    },
    completed: {
      type: String,
      default: "",
    },
    cancelled: {
      type: String,
      default: "",
    },
    modified: {
      type: String,
      default: "",
    },
  },
});

/*=========================================================================================
STATIC - MODEL
=========================================================================================*/

// @FUNC  create
// @TYPE  STATICS
// @DESC
// @ARGU
OrderSchema.statics.create = function (access, id) {
  // VALIDATION
  // CREATE ORDER INSTANCE
  let order = new this();
  // CREATE OBJECT PROPERTIES
  // Set Owner
  if (access === "public") {
    order.sessionId = id;
  } else {
    order.accountId = id;
  }
  // Status
  order.updateStatus("created");
  return order;
}

// @FUNC  merge
// @TYPE  STATICS
// @DESC
// @ARGU
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

// @FUNC  findByStatus
// @TYPE  STATICS
// @DESC
// @ARGU
OrderSchema.statics.findByStatus = function (status) {
  return new Promise(async (resolve, reject) => {
    let order;

    try {
      order = await this.find({ status });
    } catch (error) {
      reject(error);
    }

    resolve(order);
  });
};

// @FUNC  transaction
// @TYPE  STATICS
// @DESC  
// @ARGU  
OrderSchema.statics.transaction = function (query) {
  return new Promise(async (resolve, reject) => {
    let order;
    // Fetch existing active order
    try {
      order = await this.findOne(query);
    } catch (error) {
      return reject(error);
    }
    // VALIDATE THE ORDER
    const validity = order.validateAll();
    if (!(validity.cart && validity.shipping && validity.payment)) return reject("order is not valid");
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
    // Update the order's status
    order.updateStatus("checkedout");
    // Save the updated order
    try {
      await order.save();
    } catch (error) {
      return reject(error);
    }
    // SUCCESS RESPONSE
    return resolve();
  })
}

/*=========================================================================================
METHODS - DOCUMENT
=========================================================================================*/

// @FUNC  saveAddress
// @TYPE  METHODS
// @DESC
// @ARGU
OrderSchema.methods.saveAddress = function () {
  return new Promise(async (resolve, reject) => {
    // FETCH THE ORDER OWNER'S DETAILS
    let customer;
    try {
      customer = await Customer.find({ accountId: this.accountId });
    } catch (error) {
      return reject(error);
    }
    // UPDATE ADDRESS
    customer.address = this.shipping.address.saved;
    // SAVE CUSTOMER
    try {
      await customer.save();
    } catch (error) {
      return reject(error);
    }
    // SUCCESS RESPONSE
    return resolve();
  })
};

/* ----------------------------------------------------------------------------------------
TRANSACT
---------------------------------------------------------------------------------------- */

// @FUNC  transactMakes
// @TYPE  METHODS
// @DESC  Creates the transaction instance and update the order's transaction-related
//        properties
// @ARGU  
OrderSchema.methods.transactMakes = function () {
  return new Promise(async (resolve, reject) => {
    // FETCH MAKES
    let makes = [];
    try {
      makes = await Make.find({ _id: this.makes.checkout });
    } catch (error) {
      return reject(error);
    }
    // Update each make and prepare promises
    let promises = [];
    for (let i = 0; i < makes.length; i++) {
      let make = makes[i];
      make.updateStatus("purchased");
      promises.push(make.save());
    }
    // Save all makes
    try {
      await Promise.all(promises);
    } catch (error) {
      return reject(error);
    }
    // SUCCESS RESPONSE
    return resolve();
  })
}

// @FUNC  transact
// @TYPE  METHODS
// @DESC  Creates the transaction instance and update the order's transaction-related
//        properties
// @ARGU  
OrderSchema.methods.transact = function () {
  return new Promise(async (resolve, reject) => {
    // DECLARE AND INITIALISE VARIABLES
    const type = this.payment.method;
    const sender = this.accountId;
    // Amount details
    let metadata;
    try {
      metadata = await this.amount();
    } catch (error) {
      return reject(error);
    }
    const amount = metadata.total.total;
    // CREATE THE TRANSACTION INSTANCE
    let transaction;
    try {
      transaction = await Transaction.createCheckout(type, sender, amount, metadata);
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
// @ARGU  
OrderSchema.methods.amountMakes = function () {
  return new Promise(async (resolve, reject) => {
    // FETCH THE ORDER'S MAKES
    let makes = [];
    try {
      makes = await Make.find({ _id: this.makes.checkout });
    } catch (error) {
      return reject(error);
    }
    // CONSTRUCT THE AMOUNT OBJECT
    let amount = { status: "", total: 0 };
    amount.status = (makes.length ? "valid" : "invalid");
    // Calculate total amount
    for (let i = 0; i < makes.length; i++) {
      const make = makes[i];
      amount.total += (make.quantity * make.price);
    }
    // RETURN SUCCESS RESPONSE
    return resolve(amount);
  })
}

// @FUNC  amountManufacturing
// @TYPE  METHODS
// @DESC  
// @ARGU  
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
// @ARGU  
OrderSchema.methods.amountDiscount = function () {
  return new Promise(async (resolve, reject) => {
    // FETCH THE ORDER'S DISCOUNTS
    let discounts = [];
    try {
      discounts = await Discount.find({ _id: this.discounts });
    } catch (error) {
      return reject(error);
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
// @ARGU  
OrderSchema.methods.amountGST = function () {
  // CONSTRUCT THE AMOUNT OBJECT
  const amount = { status: "valid", rate: 0.15, total: 0 };
  // RETURN SUCCESS RESPONSE
  return amount;
}

// @FUNC  amountShipping
// @TYPE  METHODS
// @DESC  
// @ARGU  
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
// @ARGU  
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
      reject(error);
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
// @ARGU
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
// @ARGU  
OrderSchema.methods.updateMakes = function () {
  return new Promise(async (resolve, reject) => {
    // CREATE THE ORDER FIND OBJECT
    let object;
    if (this.accountId) {
      object = { accountId: this.accountId };
    } else {
      object = { sessionId: this.sessionId };
    }
    // FETCH THE MAKES OF THE OWNER OF THE ORDER
    let makes;
    try {
      makes = await Make.find(object);
    } catch (error) {
      return reject(error);
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
// @ARGU  
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
    discounts = discounts.filter(discount => {
      switch (discount.usage.type) {
        case "unlimited":
          return true;
        case "limited":
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
// @ARGU  
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
// @ARGU  
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
// @ARGU
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
// @ARGU
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
// @ARGU
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
