// MODULES ==================================================

const mongoose = require("mongoose");

// VARIABLES ================================================

const Schema = mongoose.Schema;

// MODEL ====================================================

const OrganisationSchema = new Schema({
  name: { type: String, required: true },
  licenses: [Schema.Types.ObjectId],
  trial: {
    status: { type: Boolean, default: false },
    key: { type: String, default: "" },
    date: { type: String, default: "" },
  },
  date: { type: String, required: true },
});

// STATICS ==================================================

OrganisationSchema.statics.build = function (object = {}, save = true) {
  return new Promise(async (resolve, reject) => {
    // Validate the inputs
    try {
      await this.validate(object);
    } catch (data) {
      return reject(data);
    }
    // Create the organisation instance
    let organisation = new this(object);
    // Save the organisation instance
    if (save) {
      try {
        organisation = await organisation.save();
      } catch (error) {
        return reject({ status: "error", content: error });
      }
    }
    // Success handler
    return resolve(organisation);
  });
};

OrganisationSchema.statics.validate = function (object = {}) {
  return new Promise(async (resolve, reject) => {
    // Declare variables
    let valid = true;
    let errors = [];
    // Check if organisation already exist
    let organisation;
    try {
      organisation = await this.findOne({ name: object.name });
    } catch (error) {
      return reject({ status: "error", content: error });
    }
    if (organisation) {
      valid = false;
      errors.push("This organisation already exist.");
    }
    // Handler
    if (valid) {
      return resolve();
    } else {
      return reject({ status: "failed", content: errors });
    }
  });
};

// METHODS ==================================================

// EXPORT ===================================================

module.exports = Organisation = mongoose.model(
  "organisations",
  OrganisationSchema
);

// END ======================================================
