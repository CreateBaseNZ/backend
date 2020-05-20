/*=========================================================================================
REQUIRED MODULES
=========================================================================================*/

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const moment = require("moment-timezone");

/*=========================================================================================
VARIABLES
=========================================================================================*/

const Schema = mongoose.Schema;

/*=========================================================================================
CREATE ACCOUNT MODEL
=========================================================================================*/

const AccountSchema = new Schema({
  type: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  verification: {
    status: {
      type: Boolean,
      default: false
    },
    code: {
      type: String,
      required: true
    }
  },
  date: {
    created: {
      type: String,
      required: true
    },
    lastVisited: {
      type: String,
      required: true
    }
  },
  wallet: {
    code: {
      type: String,
      required: true
    },
    bank: {
      number: {
        type: String,
        default: ""
      },
      status: {
        type: Boolean,
        default: false
      }
    }
  }
});

/*=========================================================================================

=========================================================================================*/

AccountSchema.pre("save", async function (next) {
  // Check if password is modified
  if (this.isModified("password")) {
    // Hash the password
    this.password = await bcrypt.hash(this.password, 8);
  }
  // Exit once hashing is completed
  next();
});

/*=========================================================================================
STATIC
=========================================================================================*/

// @FUNC  findByEmail
// @TYPE  STATICS
// @DESC
// @ARGU
AccountSchema.statics.findByEmail = function (email) {
  return new Promise(async (resolve, reject) => {
    let account;

    try {
      account = await this.findOne({ email });
    } catch (error) {
      reject(error);
    }

    resolve(account);
  });
};

// @FUNC  create
// @TYPE  STATICS - PROMISE - ASYNC
// @DESC  Creates the account object required for registering an account
// @ARGU  
AccountSchema.statics.create = function (type, email, password) {
  return new Promise(async (resolve, reject) => {
    // DECLARE AND INITIALISE VARIABLES
    let valid = true;
    let errors = [];
    // VALIDATION
    // Type
    try {
      await this.validateType(type);
    } catch (error) {
      valid = false;
      errors.push(error);
    }
    // Email
    try {
      await this.validateEmail(email);
    } catch (error) {
      valid = false;
      errors.push(error);
    }
    // Password
    try {
      await this.validatePassword(password);
    } catch (error) {
      valid = false;
      errors.push(error);
    }
    // Evaluate validation outcome
    if (!valid) {
      return reject(errors);
    }
    // CREATE OBJECT PROPERTIES
    // Verification
    const verification = {
      code: Math.floor(100000 + Math.random() * 900000)
    };
    // Date
    const now = moment().tz("Pacific/Auckland").format();
    const date = {
      created: now,
      lastVisited: now
    };
    // Wallet
    let code;
    let validCode = false;
    while (!validCode) {
      code = Math.floor(100000 + Math.random() * 900000);
      try {
        validCode = await this.validateWalletCode(code);
      } catch (error) {
        return reject(error);
      }
    }
    const wallet = { code };
    const object = { type, email, password, verification, date, wallet };
    // CREATE ACCOUNT INSTANCE
    const account = new this(object);
    // SAVE ACCOUNT INSTANCE
    let savedAccount;
    try {
      savedAccount = await account.save();
    } catch (error) {
      return reject(error);
    }
    // RETURN PROMISE RESPONSE
    return resolve(savedAccount);
  })
}

// @FUNC  validateType
// @TYPE  STATICS
// @DESC  Validates an type input
// @ARGU  
AccountSchema.statics.validateType = function (type) {
  return new Promise((resolve, reject) => {
    // DECLARE AND INITIALISE VARIABLES
    const types = ["admin", "customer", "partner"];
    let valid = true;
    let error = "";
    // VALIDATIONS
    if (!type) {
      valid = false;
      error = "no account type provided";
    } else if ((types.indexOf(type)) == -1) {
      valid = false;
      error = "invalid account type";
    }
    // RETURN PROMISE RESPONSE
    if (!valid) {
      return reject(error);
    }
    return resolve();
  })
}

// @FUNC  validateEmail
// @TYPE  STATICS - PROMISE - ASYNC
// @DESC  Validates an email input
// @ARGU  
AccountSchema.statics.validateEmail = function (email) {
  return new Promise(async (resolve, reject) => {
    // DECLARE AND INITIALISE VARIABLES
    let valid = true;
    let error = "";
    // Email REGEX

    // VALIDATIONS
    if (!email) {
      valid = false;
      error = "no email provided";
    } else if (!(true)) {
      valid = false;
      error = "invalid email";
    } else {
      let account;
      try {
        account = await this.findOne({ email });
      } catch (error) {
        valid = false;
        error = error;
      }
      if (account) {
        valid = false;
        error = "email is already taken";
      }
    }
    // RETURN PROMISE RESPONSE
    if (!valid) {
      return reject(error);
    }
    return resolve();
  })
}

// @FUNC  validatePassword
// @TYPE  STATICS - PROMISE - ASYNC
// @DESC  Validates an password input
// @ARGU  
AccountSchema.statics.validatePassword = function (password) {
  return new Promise(async (resolve, reject) => {
    // DECLARE AND INITIALISE VARIABLES
    let valid = true;
    let error = "";
    // Password REGEX

    // VALIDATIONS
    if (!password) {
      valid = false;
      error = "no password provided";
    } else if (!(true)) {
      valid = false;
      error = "invalid password";
    }
    // RETURN PROMISE RESPONSE
    if (!valid) {
      return reject(error);
    }
    return resolve();
  })
}

// @FUNC  validateWalletCode
// @TYPE  STATICS - PROMISE - ASYNC
// @DESC  Validates a code
// @ARGU  
AccountSchema.statics.validateWalletCode = function (code) {
  return new Promise(async (resolve, reject) => {
    // DECLARE AND INITIALISE VARIABLES
    let account;
    // SEARCH FOR AN ACCOUNT WITH AN IDENTICAL CODE
    try {
      account = await this.findOne({ "wallet.code": code });
    } catch (error) {
      return reject(error);
    }
    // RETURN PROMISE RESPONSE
    if (account) {
      return resolve(false);
    }
    return resolve(true);
  })
}

/*=========================================================================================
METHOD
=========================================================================================*/

AccountSchema.methods.comparePassword = async function (password) {
  let isMatch;
  try {
    isMatch = await bcrypt.compare(password, this.password);
  } catch (error) {
    return false;
  }
  return isMatch;
};

/*=========================================================================================
EXPORT ACCOUNT MODEL
=========================================================================================*/

module.exports = Account = mongoose.model("accounts", AccountSchema);

/*=========================================================================================
END
=========================================================================================*/
