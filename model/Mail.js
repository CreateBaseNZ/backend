/*=========================================================================================
REQUIRED MODULES
=========================================================================================*/

const mongoose = require("mongoose");
const moment = require("moment-timezone");

/*=========================================================================================
GRIDFS
=========================================================================================*/

/*=========================================================================================
VARIABLES
=========================================================================================*/

const Schema = mongoose.Schema;

/*=========================================================================================
MODELS
=========================================================================================*/

/*=========================================================================================
CREATE MAILING MODEL
=========================================================================================*/

const MailSchema = new Schema({
  accountId: { type: Schema.Types.ObjectId },
  email: { type: String, required: true }
});

/*=========================================================================================
STATIC
=========================================================================================*/

// @FUNC  create
// @TYPE  STATICS
// @DESC
// @ARGU
MailSchema.statics.create = function (email, accountId) {
  return new Promise(async (resolve, reject) => {
    // EMAIL VALIDATION
    try {
      await this.validateEmail(email);
    } catch (error) {
      return reject(error);
    }
    // SUBSCRIPTION
    let mail;
    try {
      mail = await this.findOne({ email });
    } catch (error) {
      return reject(error);
    }
    // SETUP OR CREATE MAIL INSTANCE
    if (!mail) {
      mail = new this({ email });
    }
    mail.accountId = accountId;
    // SAVE MAIL INSTANCE
    try {
      await mail.save();
    } catch (error) {
      return reject(error);
    }
    // RETURN PROMISE RESPONSE
    return resolve();
  })
}

// @FUNC  validateEmail
// @TYPE  STATICS - PROMISE - ASYNC
// @DESC  Validates an email input
// @ARGU  
MailSchema.statics.validateEmail = function (email) {
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
    }
    // RETURN PROMISE RESPONSE
    if (!valid) {
      return reject(error);
    }
    return resolve();
  })
}

// @FUNC  findByEmail
// @TYPE  STATICS
// @DESC
// @ARGU
MailSchema.statics.findByEmail = function (email) {
  return new Promise(async (resolve, reject) => {
    let mail;

    try {
      mail = await this.findOne({ email });
    } catch (error) {
      reject(error);
    }

    resolve(mail);
  });
};

// @FUNC  delete
// @TYPE  STATICS
// @DESC
// @ARGU
MailSchema.statics.delete = function (email) {
  return new Promise(async (resolve, reject) => {
    try {
      await this.deleteOne({ email });
    } catch (error) {
      reject(error);
    }
    resolve("success");
  });
};

/*=========================================================================================
METHOD
=========================================================================================*/

/*=========================================================================================
EXPORT MAIL MODEL
=========================================================================================*/

module.exports = Mail = mongoose.model("mail", MailSchema);

/*=========================================================================================
END
=========================================================================================*/
