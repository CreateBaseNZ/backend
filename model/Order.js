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
    type: String
  },
  makes: {
    awaitingQuote: {
      type: [mongoose.Types.ObjectId]
    },
    checkout: {
      type: [mongoose.Types.ObjectId]
    }
  },
  items: {
    type: [mongoose.Types.ObjectId]
  },
  discounts: {
    type: [mongoose.Types.ObjectId]
  },
  manufacturingSpeed: {
    type: String
  },
  shipping: {
    address: {
      option: {
        type: String
      },
      saved: {
        type: AddressSchema
      },
      new: {
        type: AddressSchema
      },
      save: {
        type: Boolean
      }
    },
    method: {
      type: String
    }
  },
  comments: {
    type: [mongoose.Types.ObjectId]
  },
  date: {
    created: {
      type: String
    },
    validated: {
      type: String
    },
    built: {
      type: String
    },
    shipped: {
      type: String
    },
    arrived: {
      type: String
    },
    reviewed: {
      type: String
    },
    completed: {
      type: String
    },
    cancelled: {
      type: String
    },
    modified: {
      type: String
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
