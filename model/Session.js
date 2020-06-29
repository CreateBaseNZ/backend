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
MODELS
=========================================================================================*/

const Make = require("./Make.js");
const Order = require("./Order.js");

/*=========================================================================================
CREATE SESSION MODEL
=========================================================================================*/

const SessionSchema = new Schema({
  sessionId: { type: String },
  date: {
    modified: { type: String },
    visited: { type: String },
  },
  // Sets status selected by the user default value is "unset"
  status: { type: String }
});

/*=========================================================================================
STATIC
=========================================================================================*/

SessionSchema.statics.create = function (sessionId) {
  return new Promise(async (resolve, reject) => {
    // Get current date
    const date = moment().tz("Pacific/Auckland").format();
    // Check if the session already exist
    let session;
    try {
      session = await this.findOne({ sessionId });
    } catch (error) {
      reject(error);
      return;
    }
    if (session) {
      // Update the sessions visited date
      session.date.visited = date;
      // Save session update
      try {
        await session.save();
      } catch (error) {
        reject(error);
      }
      resolve("session already exists");
      return;
    }
    // If session doesn't exist, create one
    let newSession = new this({
      sessionId,
      date: {
        modified: date,
        visited: date,
      },
      status: "unset",
    });
    // Save the new session
    try {
      await newSession.save();
    } catch (error) {
      reject(error);
      return;
    }
    // Resolve the promise
    resolve("session created");
  });
};

SessionSchema.statics.deleteSession = function (sessionId) {
  return new Promise(async (resolve, reject) => {
    // Delete the Session document
    try {
      await this.deleteOne({ sessionId });
    } catch (error) {
      reject(error);
      return;
    }
    // Delete the Make documents
    try {
      await Make.deleteMany({ sessionId });
    } catch (error) {
      reject(error);
      return;
    }
    // Delete the Order documents
    try {
      await Order.deleteMany({ sessionId });
    } catch (error) {
      reject(error);
      return;
    }
    // Resolve the promise
    resolve("deletion completed");
    return;
  });
};

/*=========================================================================================
METHOD
=========================================================================================*/

/*=========================================================================================
EXPORT ACCOUNT MODEL
=========================================================================================*/

module.exports = Session = mongoose.model("sessions", SessionSchema);

/*=========================================================================================
END
=========================================================================================*/
