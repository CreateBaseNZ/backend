/*=========================================================================================
REQUIRED MODULES
=========================================================================================*/

const mongoose = require("mongoose");

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
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  suburb: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  postcode: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
});

/*=========================================================================================
CREATE CUSTOMER MODEL
=========================================================================================*/

const CustomerSchema = new Schema({
  accountId: {
    type: Schema.Types.ObjectId,
  },
  picture: {
    type: Schema.Types.ObjectId,
  },
  displayName: {
    type: String,
  },
  bio: {
    type: String,
    default: "",
  },
  address: {
    type: AddressSchema,
  },
  subscription: {
    mail: {
      type: Boolean,
    },
  },
  wallet: {
    amount: {
      type: Number,
      default: 0,
    },
  },
});

/*=========================================================================================
STATUS
=========================================================================================*/

// @FUNC  findByAccountId
// @TYPE  STATICS
// @DESC
// @ARGU
CustomerSchema.statics.findByAccountId = function (accountId) {
  return new Promise(async (resolve, reject) => {
    let customer;

    try {
      customer = await this.findOne({ accountId });
    } catch (error) {
      reject(error);
    }

    resolve(customer);
  });
};

/*=========================================================================================
METHODS
=========================================================================================*/

// @FUNC  update
// @TYPE  METHODS
// @DESC
// @ARGU  customer - object -
CustomerSchema.methods.update = function (customer) {
  return new Promise(async (resolve, reject) => {
    console.log(customer);
    // Update Details
    for (const property in customer) {
      // Validate Detail
      // TEMPORARY - NEED VALIDATION FUNCTION
      // Update Detail
      this[property] = customer[property];
    }
    // Save Update
    let savedCustomer;
    try {
      savedCustomer = await this.save();
    } catch (error) {
      reject(error);
    }
    resolve(savedCustomer);
  });
};

// @FUNC  updateAddress
// @TYPE  METHODS
// @DESC
// @ARGU  address - object -
CustomerSchema.methods.updateAddress = function (address) {
  return new Promise(async (resolve, reject) => {
    this.address = address;
    let savedCustomer;
    try {
      savedCustomer = await this.save();
    } catch (error) {
      reject({
        status: "failed",
        message: error,
      });
    }
    resolve(savedCustomer);
  });
};

/*=========================================================================================
EXPORT CUSTOMER MODEL
=========================================================================================*/

module.exports = Customer = mongoose.model("customers", CustomerSchema);

/*=========================================================================================
END
=========================================================================================*/
