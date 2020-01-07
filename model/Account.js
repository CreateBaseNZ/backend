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
    type: String
  },
  email: {
    type: String
  },
  password: {
    type: String
  }
});

/*=========================================================================================

=========================================================================================*/

AccountSchema.pre("save", async function(next) {
  // Check if password is modified
  if (this.isModified("password")) {
    // Hash the password
    this.password = await bcrypt.hash(this.password, 8);
  }
  // Exit once hashing is completed
  next();
});

AccountSchema.methods.validatePassword = async function(password) {
  return (isMatch = await bcrypt.compare(password, this.password));
};

/*=========================================================================================
EXPORT ACCOUNT MODEL
=========================================================================================*/

module.exports = Account = mongoose.model("accounts", AccountSchema);

/*=========================================================================================
END
=========================================================================================*/
