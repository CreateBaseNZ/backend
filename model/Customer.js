/*=========================================================================================
REQUIRED MODULES
=========================================================================================*/

const mongoose = require("mongoose");

/*=========================================================================================
VARIABLES
=========================================================================================*/

const Schema = mongoose.Schema;

/*=========================================================================================
EXTERNAL MODELS
=========================================================================================*/

const Mail = require("./Mail.js");

/*=========================================================================================
CREATE CUSTOMER MODEL
=========================================================================================*/

const CustomerSchema = new Schema({
  accountId: { type: Schema.Types.ObjectId, required: true },
  displayName: { type: String, required: true },
  picture: { type: Schema.Types.ObjectId },
  bio: { type: String, default: "" },
  address: {
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
  subscription: {
    mail: { type: Boolean, default: false }
  }
});

/*=========================================================================================
STATUS
=========================================================================================*/

// @FUNC  build
// @TYPE  STATICS PROMISE ASYNC
// @DESC
CustomerSchema.statics.build = function (object = {}, save = true) {
  return new Promise(async (resolve, reject) => {
    // VALIDATION
    try {
      await this.validateDisplayName(object.displayName);
    } catch (data) {
      return reject(data);
    }
    // CREATE CUSTOMER
    const customer = new this(object);
    if (save) {
      try {
        await customer.save();
      } catch (error) {
        return reject({ status: "error", content: error });
      }
    }
    // SUCCESS HANDLER
    return resolve(customer);
  });
}

// @FUNC  create
// @TYPE  STATICS PROMISE ASYNC
// @DESC
CustomerSchema.statics.create = function (accountId, displayName) {
  return new Promise(async (resolve, reject) => {
    // DECLARE AND INITIALISE VARIABLES
    let valid = true;
    let errors = [];
    // VALIDATION
    // Account Id
    if (!accountId) {
      valid = false;
      const error = "no account id provided";
      errors.push(error);
    }
    // Display Name
    try {
      await this.validateDisplayName(displayName);
    } catch (error) {
      valid = false;
      errors.push(error);
    }
    // Evaluate validation outcome
    if (!valid) {
      return reject(errors);
    }
    // ADDRESS
    const address = {
      recipient: "", unit: "", street: { number: "", name: "" },
      suburb: "", city: "", postcode: "", country: ""
    }
    // CREATE OBJECT PROPERTIES
    const object = { accountId, displayName, address };
    // CREATE CUSTOMER INSTANCE
    const customer = new this(object);
    // SAVE CUSTOMER INSTANCE
    try {
      await customer.save();
    } catch (error) {
      return reject(error);
    }
    // RETURN PROMISE RESPONSE
    return resolve();
  })
}

// @FUNC  validateDisplayName
// @TYPE  STATICS - PROMISE - ASYNC
// @DESC  Validates a display name input
CustomerSchema.statics.validateDisplayName = function (displayName) {
  return new Promise(async (resolve, reject) => {
    // DECLARE AND INITIALISE VARIABLES
    let regex = /^[A-Za-z0-9_-\s]+$/;
    // CHECK FOR NAME INPUT
    if (!displayName) return reject({ status: "failed", content: "name is required" });
    // CHECK FOR VALID NAME
    if (!regex.test(String(displayName).toLowerCase())) return reject({ status: "failed", content: "invalid name" });
    // SUCCESS HANDLER
    return resolve();
  })
}

/*=========================================================================================
METHODS
=========================================================================================*/

// @FUNC  subscribeMail
// @TYPE  METHODS
// @DESC
// @ARGU
CustomerSchema.methods.subscribeMail = function (email) {
  return new Promise(async (resolve, reject) => {
    // DECLARE AND INITIALISE VARIABLES
    const accountId = this.accountId;
    // SUBSCRIBE USER
    // Update customer's subscription status
    this.subscription.mail = true;
    // Create a new mail instance
    try {
      await Mail.create(email, accountId);
    } catch (error) {
      return reject(error);
    }
    // RETURN PROMISE RESPONSE
    return resolve();
  })
}

CustomerSchema.methods.unsubscribeMail = function (email) {
  return new Promise(async (resolve, reject) => {
    // UNSUBSCRIBE USER
    // Update customer's subscription status
    this.subscription.mail = false;
    // Create a new mail instance
    try {
      await Mail.delete(email);
    } catch (error) {
      return reject(error);
    }
    // RETURN PROMISE RESPONSE
    return resolve();
  })
}

// @FUNC  update
// @TYPE  METHODS
// @DESC
// @ARGU  customer - object -
CustomerSchema.methods.update = function (customer, save = false) {
  return new Promise(async (resolve, reject) => {
    // UPDATE
    for (const property in customer) {
      // Validate Detail
      // TEMPORARY - NEED VALIDATION FUNCTION
      // Update Detail
      this[property] = customer[property];
    }
    // SAVE
    let savedCustomer;
    if (save) {
      try {
        savedCustomer = await this.save();
      } catch (error) {
        return reject({ status: "error", content: error });
      }
    }
    // SUCCESS HANDLER
    return resolve(savedCustomer);
  });
};

/*=========================================================================================
EXPORT CUSTOMER MODEL
=========================================================================================*/

module.exports = Customer = mongoose.model("customers", CustomerSchema);

/*=========================================================================================
END
=========================================================================================*/
