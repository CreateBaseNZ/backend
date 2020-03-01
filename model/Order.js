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
    type: String
  },
  street: {
    number: {
      type: String
    },
    name: {
      type: String
    }
  },
  suburb: {
    type: String
  },
  city: {
    type: String
  },
  postcode: {
    type: String
  },
  country: {
    type: String
  }
});

/*=========================================================================================
CREATE ORDER MODEL
=========================================================================================*/

const OrderSchema = new Schema({
  accountId: {
    type: mongoose.Types.ObjectId
  },
  status: {
    type: String,
    default: ""
  },
  makes: {
    awaitingQuote: {
      type: [mongoose.Types.ObjectId],
      default: []
    },
    checkout: {
      type: [mongoose.Types.ObjectId],
      default: []
    }
  },
  items: {
    type: [mongoose.Types.ObjectId],
    default: []
  },
  discounts: {
    type: [mongoose.Types.ObjectId],
    default: []
  },
  manufacturingSpeed: {
    type: String,
    default: ""
  },
  shipping: {
    address: {
      option: {
        type: String,
        default: ""
      },
      saved: {
        type: AddressSchema
      },
      new: {
        type: AddressSchema
      },
      save: {
        type: Boolean,
        default: true
      }
    },
    method: {
      type: String,
      default: ""
    }
  },
  payment: {
    method: {
      type: String,
      default: ""
    }
  },
  comments: {
    type: [mongoose.Types.ObjectId],
    default: []
  },
  date: {
    created: {
      type: String,
      default: ""
    },
    validated: {
      type: String,
      default: ""
    },
    built: {
      type: String,
      default: ""
    },
    shipped: {
      type: String,
      default: ""
    },
    arrived: {
      type: String,
      default: ""
    },
    reviewed: {
      type: String
    },
    completed: {
      type: String,
      default: ""
    },
    cancelled: {
      type: String,
      default: ""
    },
    modified: {
      type: String,
      default: ""
    }
  }
});

/*=========================================================================================
STATIC - MODEL
=========================================================================================*/

// @FUNC  findByStatus
// @TYPE  STATICS
// @DESC
// @ARGU
OrderSchema.statics.findByStatus = function(status) {
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
OrderSchema.statics.findOneByAccoundIdAndStatus = function(accountId, status) {
  return new Promise(async (resolve, reject) => {
    let order;

    try {
      order = await this.findOne({ accountId, status });
    } catch (error) {
      reject(error);
    }

    resolve(order);
  });
};

/*=========================================================================================
METHODS - DOCUMENT
=========================================================================================*/

// @FUNC  updateStatus
// @TYPE  METHODS
// @DESC
// @ARGU
OrderSchema.methods.updateStatus = function(status) {
  return new Promise(async (resolve, reject) => {
    const statuses = [
      "created",
      "validated",
      "built",
      "shipped",
      "arrived",
      "reviewed",
      "completed",
      "cancelled"
    ];

    // VALIDATION START

    if (statuses.indexOf(status) === -1) {
      reject({
        status: "failed",
        message: "invalid status"
      });
    }

    // VALIDATION END

    const date = moment()
      .tz("Pacific/Auckland")
      .format();

    this.status = status;
    this.date[status] = date;
    this.date.modified = date;

    let savedOrder;

    try {
      savedOrder = await this.save();
    } catch (error) {
      reject({
        status: "failed",
        message: error
      });
    }

    resolve(savedOrder);
  });
};

// @FUNC  updateSavedAddress
// @TYPE  METHODS
// @DESC
// @ARGU
OrderSchema.methods.updateSavedAddress = function() {};

// @FUNC  validateCart
// @TYPE  METHODS
// @DESC
// @ARGU
OrderSchema.methods.validateCart = function() {
  // Check if there are prints or items ready for checkout
  if (!(this.makes.awaitingQuote.length || this.items.length)) {
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
OrderSchema.methods.validateShipping = function() {
  return true;
};

/*=========================================================================================
EXPORT ORDER MODEL
=========================================================================================*/

module.exports = Order = mongoose.model("orders", OrderSchema);

/*=========================================================================================
END
=========================================================================================*/
