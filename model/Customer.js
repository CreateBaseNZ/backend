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
  address: { type: Schema.Types.Mixed, required: true },
  subscription: {
    mail: { type: Boolean, default: false }
  }
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

// @FUNC  create
// @TYPE  STATICS PROMISE ASYNC
// @DESC
// @ARGU
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
// @ARGU  
CustomerSchema.statics.validateDisplayName = function (displayName) {
  return new Promise(async (resolve, reject) => {
    // DECLARE AND INITIALISE VARIABLES
    let valid = true;
    let error = "";
    // Display Name REGEX

    // VALIDATIONS
    if (!displayName) {
      valid = false;
      error = "no display name provided";
    } else if (!(true)) {
      valid = false;
      error = "invalid display name";
    }
    // RETURN PROMISE RESPONSE
    if (!valid) {
      return reject(error);
    }
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

/*=========================================================================================
EXPORT CUSTOMER MODEL
=========================================================================================*/

module.exports = Customer = mongoose.model("customers", CustomerSchema);

/*=========================================================================================
END
=========================================================================================*/
