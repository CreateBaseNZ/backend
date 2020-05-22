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

const Transaction = require("./Transaction.js");
const Customer = require("./Customer.js");
const Make = require("./Make.js");
const Discount = require("./Discount.js");

/*=========================================================================================
SUB MODELS
=========================================================================================*/

const AddressSchema = new Schema({
  unit: {
    type: String,
  },
  street: {
    number: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
  },
  suburb: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  postcode: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
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
    default: "",
  },
  makes: {
    awaitingQuote: {
      type: [Schema.Types.ObjectId],
      default: [],
    },
    checkout: {
      type: [Schema.Types.ObjectId],
      default: [],
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
        default: "",
      },
      saved: {
        type: AddressSchema,
      },
      new: {
        type: AddressSchema,
      },
      save: {
        type: Boolean,
        default: true,
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
    let accoundOrder;
    try {
      accoundOrder = await this.findOne({ accountId, status });
    } catch (error) {
      return reject(error);
    }
    // MERGE ORDER PROCESS
    // TO DO.....
    // Merge properties of each order more intelligently
    // TO DO.....
    let order;
    if (accoundOrder) {
      order = accoundOrder;
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

// @FUNC  findOneByAccoundIdAndStatus
// @TYPE  STATICS
// @DESC
// @ARGU
OrderSchema.statics.findOneByAccoundIdAndStatus = function (accountId, status) {
  return new Promise(async (resolve, reject) => {
    // Fetch the order from the database
    let order;
    try {
      order = await this.findOne({ accountId, status });
    } catch (error) {
      reject(error);
      return;
    }
    // If successful, resolve by returning the order
    resolve(order);
    return;
  });
};

// @FUNC  bankTransfer
// @TYPE  STATICS
// @DESC  
// @ARGU  

// @FUNC  cardPayment
// @TYPE  STATICS
// @DESC  
// @ARGU  

/*=========================================================================================
METHODS - DOCUMENT
=========================================================================================*/

// @FUNC  updateStatus
// @TYPE  METHODS
// @DESC
// @ARGU
OrderSchema.methods.updateStatus = function (status) {
  return new Promise(async (resolve, reject) => {
    // DECLARE AND INITIALISE VARIABLES
    const statuses = ["created", "checkedout", "validated", "built",
      "shipped", "arrived", "reviewed", "completed", "cancelled"];
    // VALIDATION
    if (statuses.indexOf(status) === -1) {
      return reject("invalid status");
    }
    // SET THE ORDER'S RELEVANT PROPERTIES
    // Date
    const date = moment().tz("Pacific/Auckland").format();
    this.date[status] = date;
    this.date.modified = date;
    // Status
    this.status = status;
    // RESOLVE PROMISE
    return resolve("order updated");
  });
};

// @FUNC  transact
// @TYPE  METHODS
// @DESC  Creates the transaction instance and update the order's transaction-related
//        properties
// @ARGU  
OrderSchema.methods.transact = function () { }

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
      makes = await Make.find({ accountId: this.accountId, _id: this.makes.checkout });
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
      manufacturing.total = makes.total * manufacturing.rate;
      discount.total = (makes.total + manufacturing.total) * discount.rate;
      gst.total = ((makes.total + manufacturing.total) - discount.total) * gst.rate;
      total.total = (((makes.total + manufacturing.total) - discount.total) + gst.total) + shipping.total;
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

// @FUNC  updateMakes
// @TYPE  METHODS
// @DESC  
// @ARGU  
OrderSchema.methods.updateMakes = function () {
  return new Promise(async (resolve, reject) => {
    // FETCH THE MAKES OF THE OWNER OF THE ORDER
    let makes;
    try {
      makes = await Make.find({ accountId: this.accountId });
    } catch (error) {
      return reject(error);
    }
    // UPDATE ORDER'S MAKES
    this.makes.awaitingQuote = makes.filter(make => make.status === "awaitingQuote");
    this.makes.checkout = makes.filter(make => make.status === "checkout");
    // RETURN SUCCESS RESPONSE
    return resolve();
  })
}

// @FUNC  updateSavedAddress
// @TYPE  METHODS
// @DESC  
// @ARGU  
OrderSchema.methods.updateSavedAddress = function () {
  return new Promise(async (resolve, reject) => {
    // FETCH THE ORDER OWNER'S DETAIL
    let customer;
    try {
      customer = await Customer.find({ accountId: this.accountId });
    } catch (error) {
      return reject(error);
    }
    // UPDATE ORDER'S SAVED ADDRESS
    this.shipping.address.saved = customer.address;
    // RETURN SUCCESS RESPONSE
    return resolve();
  })
}

/* ----------------------------------------------------------------------------------------
VALIDATION
---------------------------------------------------------------------------------------- */

// @FUNC  saveAddress
// @TYPE  METHODS
// @DESC
// @ARGU
OrderSchema.methods.saveAddress = function () { };

// @FUNC  validateCart
// @TYPE  METHODS
// @DESC
// @ARGU
OrderSchema.methods.validateCart = function () {
  // Check if there are prints or items ready for checkout
  if (!(this.makes.checkout.length || this.items.length)) {
    return false;
  }
  if (!this.manufacturingSpeed) {
    return false;
  }

  return true;
};

// @FUNC  validateShipping
// @TYPE  METHODS
// @DESC
// @ARGU
OrderSchema.methods.validateShipping = function () {
  // Check if a shipping option is provided
  if (!this.shipping.address.option) {
    return false;
  }
  // Check if a shipping address is provided
  if (this.shipping.address.option === "saved") {
    // Saved Address
    const data = checkAddressValidity(this.shipping.address.saved);
    if (data.status === "failed") {
      return false;
    }
  } else if (this.shipping.address.option === "new") {
    // New Address
    const data = checkAddressValidity(this.shipping.address.new);
    if (data.status === "failed") {
      return false;
    }
  }
  // Check if a shipping method is provided
  if (!this.shipping.method) {
    return false;
  }
  return true;
};

// @FUNC  validatePayment
// @TYPE  METHODS
// @DESC
// @ARGU
OrderSchema.methods.validatePayment = function () {
  return true;
};



/*=========================================================================================
FUNCTIONS
=========================================================================================*/

const checkAddressValidity = (address) => {
  // VALIDATION - STREET NAME
  if (!address.street.name) {
    // Check if there is no street name provided
    return {
      status: "failed",
      message: "no street name",
    };
  }
  // VALIDATION - STREET NUMBER
  if (!address.street.number) {
    // Check if there is no street number provided
    return {
      status: "failed",
      message: "no street number",
    };
  }
  // VALIDATION - SUBURB
  if (!address.suburb) {
    // Check if there is no suburb provided
    return {
      status: "failed",
      message: "no suburb",
    };
  }
  // VALIDATION - CITY
  if (!address.city) {
    // Check if there is no city provided
    return {
      status: "failed",
      message: "no city",
    };
  }
  // VALIDATION - POSTCODE
  if (!address.postcode) {
    // Check if there is no postcode provided
    return {
      status: "failed",
      message: "no postcode",
    };
  }
  // VALIDATION - COUNTRY
  if (!address.country) {
    return {
      status: "failed",
      message: "no country",
    };
  }
  // All Valid
  return {
    status: "success",
    message: "valid address",
  };
};

/*=========================================================================================
EXPORT ORDER MODEL
=========================================================================================*/

module.exports = Order = mongoose.model("orders", OrderSchema);

/*=========================================================================================
END
=========================================================================================*/
