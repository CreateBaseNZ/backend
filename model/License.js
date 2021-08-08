// MODULES ==================================================

const mongoose = require("mongoose");

// VARIABLES ================================================

const Schema = mongoose.Schema;

// MODEL ====================================================

const LicenseSchema = new Schema({
  organisation: { type: Schema.Types.ObjectId },
  username: { type: String, required: true},
  password: { type: String, required: true },
  statuses: [Schema.Types.Mixed],
  access: {
    admin: { type: Boolean, default: false},
    educator: { type: Boolean, default: false },
    learner: { type: Boolean, default: false }
  },
  profile: { type: Schema.Types.ObjectId, required: true }
});

// STATICS ==================================================

LicenseSchema.statics.build = function (object = {}, save = true) {
  return new Promise(async (resolve, reject) => {
    // Validate the inputs
    try {
      await this.validate(object);
    } catch (error) {
      return reject({ status: "error", content: error });
    }
    // Create the license instance
    let license = new this(object);
    // Save the license instance
    if (save) {
      try {
        license = await license.save();
      } catch (error) {
        return reject({ status: "error", content: error });
      }
    }
    // Success handler
    return resolve(license);
  });
}

LicenseSchema.statics.validate = function (object = {}) {
  return new Promise(async (resolve, reject) => {
    // Declare variables
    let valid = true;
    let errors = [];
    // Handler
    if (valid) {
      return resolve();
    } else {
      return reject(errors);
    }
  });
}

// METHODS ==================================================

// EXPORT ===================================================

module.exports = License = mongoose.model("licenses", LicenseSchema);

// END ======================================================