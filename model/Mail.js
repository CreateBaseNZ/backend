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
  email: { type: String, required: true }
});

/*=========================================================================================
STATIC
=========================================================================================*/

// @FUNC  build
// @TYPE  STATICS
// @DESC
// @ARGU
MailSchema.statics.build = function (object = {}, save = true) {
  return new Promise(async (resolve, reject) => {
    // EMAIL VALIDATION
    try {
      await this.validateEmail(object.email);
    } catch (data) {
      return reject(data);
    }
    // SUBSCRIPTION
    let mail;
    try {
      mail = await this.findOne({ email: object.email });
    } catch (error) {
      return reject({ status: "error", content: error });
    }
    // CHECK IF EMAIL IS ALREADY SUBSCRIBED
    if (mail) return reject({ status: "failed", content: "You are already subscribed" });
    // SETUP OR CREATE MAIL INSTANCE
    mail = new this(object);
    // SAVE MAIL INSTANCE
    if (save) {
      try {
        await mail.save();
      } catch (error) {
        return reject(error);
      }
    }
    // RETURN PROMISE RESPONSE
    return resolve(mail);
  })
}

// @FUNC  validateEmail
// @TYPE  STATICS - PROMISE - ASYNC
// @DESC  Validates an email input
// @ARGU  
MailSchema.statics.validateEmail = function (email) {
  return new Promise(async (resolve, reject) => {
    // Email REGEX
    let emailRE = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    // VALIDATIONS
    if (!email) {
      return reject({ status: "failed", content: "Email is required" });
    } else if (!emailRE.test(String(email).toLowerCase())) {
      return reject({ status: "failed", content: "Invalid email" });
    }
    return resolve();
  });
}

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
