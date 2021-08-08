// MODULES ==================================================

const mongoose = require("mongoose");

// VARIABLES ================================================

const Schema = mongoose.Schema;

// MODEL ====================================================

const ProfileSchema = new Schema({
  license: { type: Schema.Types.ObjectId },
  account: {
    local: { type: Schema.Types.ObjectId },
    google: { type: Schema.Types.ObjectId }
  },
  saves: [Schema.Types.Mixed]
});

// STATICS ==================================================

ProfileSchema.statics.build = function (object = {}, save = true) {
  return new Promise(async (resolve, reject) => {
    // Validate the inputs
    try {
      await this.validate(object);
    } catch (error) {
      return reject({ status: "error", content: error });
    }
    // Create the profile instance
    let profile = new this(object);
    // Save the profile instance
    if (save) {
      try {
        profile = await profile.save();
      } catch (error) {
        return reject({ status: "error", content: error });
      }
    }
    // Success handler
    return resolve(profile);
  });
}

ProfileSchema.statics.validate = function (object = {}) {
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

module.exports = Profile = mongoose.model("profiles", ProfileSchema);

// END ======================================================