/**
 * Modules
 */
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

/**
 * Variables
 */
const Schema = mongoose.Schema;

/**
 * User Session Schema
 *
 * This schema contains the details of a user in a given browser session.
 */
const UserSessionSchema = new Schema({
  _id: { type: String, required: true },
  site: { type: String, required: true },
  deployment: { type: String, required: true },
  accountId: { type: String, default: "" },
  behaviours: [String],
  saves: [Schema.Types.Mixed],
  date: {
    created: { type: String, required: true },
    modified: { type: String, default: "" },
  },
});

/**
 * Statics
 */

UserSessionSchema.statics.build = function (object = {}, save = true) {
  return new Promise(async (resolve, reject) => {
    object._id = uuidv4();
    // Validate the inputs
    try {
      await this.validate(object);
    } catch (error) {
      return reject({ status: "error", content: error });
    }
    // Create the user session instance
    let userSession = new this(object);
    // Save the user session instance
    if (save) {
      try {
        userSession = await userSession.save();
      } catch (error) {
        return reject({ status: "error", content: error });
      }
    }
    // Success handler
    return resolve(userSession);
  });
};

UserSessionSchema.statics.validate = function (object = {}) {
  return new Promise(async (resolve, reject) => {
    // Declare variables
    let valid = true;
    let error = "";
    // Handler
    if (valid) {
      return resolve();
    } else {
      return reject(error);
    }
  });
};

/**
 * Methods
 */

/**
 * Export
 */

module.exports = UserSession = mongoose.model(
  "user-sessions",
  UserSessionSchema
);
