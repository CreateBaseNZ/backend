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
      mail = await this.findOne(object);
    } catch (error) {
      return reject({ status: "error", content: error });
    }
    // CHECK IF EMAIL IS ALREADY SUBSCRIBED
    if (mail) return reject({ status: "succeeded", content: "You are already subscribed" });
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

// @FUNC  demolish
// @TYPE  STATICS
// @DESC
MailSchema.statics.demolish = function (object) {
  return new Promise(async (resolve, reject) => {
    // EMAIL VALIDATION
    try {
      await this.validateEmail(object.email);
    } catch (data) {
      return reject(data);
    }
    // FETCH THE MAIL
    let mail;
    try {
      mail = await this.findOne(object);
    } catch (error) {
      return reject({ status: "error", content: error });
    }
    // VALIDATE IF THE MAIL EXIST
    if (!mail) return resolve({ status: "succeeded", content: "You are already unsubscribed" });
    // DEMOLISH MAIL
    try {
      await mail.deleteOne();
    } catch (error) {
      return reject({ status: "error", content: error });
    }
    // SUCCESS HANDLER
    return resolve();
  });
}

// @FUNC  validateEmail
// @TYPE  STATICS - PROMISE - ASYNC
// @DESC  Validates an email input
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

/*=========================================================================================
EXPORT MAIL MODEL
=========================================================================================*/

module.exports = Mail = mongoose.model("mail", MailSchema);

/*=========================================================================================
END
=========================================================================================*/
