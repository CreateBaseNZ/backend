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
 * This schema contains all the behaviours that we are tracking.
 */
const BehaviourSchema = new Schema({
  _id: { type: String, required: true },
  code: { type: Number, required: true },
  date: { type: String, required: true },
  sessionId: { type: String, required: true },
  accountId: { type: String, default: "" },
  properties: { type: Schema.Types.Mixed },
});

/**
 * Statics
 */

/**
 *
 * @param {Object} object
 * @param {Boolean} save
 * @returns
 */
BehaviourSchema.statics.build = function (object = {}, save = true) {
  return new Promise(async (resolve, reject) => {
    object._id = uuidv4();
    // Validate the inputs
    try {
      await this.validate(object);
    } catch (error) {
      return reject({ status: "error", content: error });
    }
    // Create the behaviour instance
    let behaviour = new this(object);
    // Save the behaviour instance
    if (save) {
      try {
        behaviour = await behaviour.save();
      } catch (error) {
        return reject({ status: "error", content: error });
      }
    }
    // Success handler
    return resolve(behaviour);
  });
};

/**
 *
 * @param {Object} object
 * @returns
 */
BehaviourSchema.statics.validate = function (object = {}) {
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

module.exports = Behaviour = mongoose.model("behaviours", BehaviourSchema);
