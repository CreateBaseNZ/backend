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
SUB MODELS
=========================================================================================*/

const AddressSchema = new Schema({
  unit: {
    type: String,
  },
  street: {
    number: {
      type: String,
    },
    name: {
      type: String,
    },
  },
  suburb: {
    type: String,
  },
  city: {
    type: String,
  },
  postcode: {
    type: String,
  },
  country: {
    type: String,
  },
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
  items: {
    type: [Schema.Types.ObjectId],
    default: [],
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
    amount: {
      type: Number,
      default: 0
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
    // Validate if an order is found
    if (!order) {
      reject("no order found");
      return;
    }
    // If successful, resolve by returning the order
    resolve(order);
    return;
  });
};

/*=========================================================================================
METHODS - DOCUMENT
=========================================================================================*/

// @FUNC  updateStatus
// @TYPE  METHODS
// @DESC
// @ARGU
OrderSchema.methods.updateStatus = function (status) {
  return new Promise(async (resolve, reject) => {
    const statuses = [
      "created",
      "checkedout",
      "validated",
      "built",
      "shipped",
      "arrived",
      "reviewed",
      "completed",
      "cancelled",
    ];

    // VALIDATION START

    if (statuses.indexOf(status) === -1) {
      reject("invalid status");
    }

    // VALIDATION END

    const date = moment().tz("Pacific/Auckland").format();

    this.status = status;
    this.date[status] = date;
    this.date.modified = date;

    resolve("order updated");
    return;
  });
};

// @FUNC  updateSavedAddress
// @TYPE  METHODS
// @DESC
// @ARGU
OrderSchema.methods.updateSavedAddress = function () { };

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
