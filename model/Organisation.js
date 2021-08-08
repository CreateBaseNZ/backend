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
    date: { type: String, default: "" }
  },
  date: { type: String, required: true }
});

// STATICS ==================================================

OrganisationSchema.statics.build = function (object = {}, save = true) {
  return new Promise(async (resolve, reject) => {
    // Validate the inputs
    try {
      await this.validate(object);
    } catch (error) {
      return reject({ status: "error", content: error });
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
}

OrganisationSchema.statics.validate = function (object = {}) {
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

module.exports = Organisation = mongoose.model("organisations", OrganisationSchema);

// END ======================================================