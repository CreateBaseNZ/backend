/*=========================================================================================
REQUIRED MODULES
=========================================================================================*/

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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

/*=========================================================================================
METHOD
=========================================================================================*/

AccountSchema.methods.validatePassword = async function (password) {
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
