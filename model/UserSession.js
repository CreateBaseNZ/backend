/**
 * Modules
 */
const mongoose = require("mongoose");

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
  userType: { type: String, required: true },
  sessionId: { type: String, required: true },
  accountId: { type: Schema.Types.ObjectId },
  behaviours: [Schema.Types.ObjectId],
  saves: [Schema.Types.Mixed],
  date: {
    created: { type: String, required: true },
    modified: { type: String, required: true },
  },
});

/**
 * Statics
 */

UserSessionSchema.statics.build = function (object = {}, save = true) {
  return new Promise(async (resolve, reject) => {
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
