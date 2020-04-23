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
  sessionId: {
    type: String,
  },
  date: {
    modified: {
      type: String,
    },
    visited: {
      type: String,
    },
  },
});

const Session = mongoose.model("sessions", SessionSchema);

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
    }
    // If session doesn't exist, create one
    let newSession = new Session({
      sessionId,
      date: {
        modified: date,
        visited: date,
      },
    });
    // Save the new session
    try {
      await newSession.save();
    } catch (error) {
      reject(error);
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
    }
    // Delete the Make documents
    try {
      await Make.deleteMany({ sessionId });
    } catch (error) {
      reject(error);
    }
    // Delete the Order documents
    try {
      await Order.deleteMany({ sessionId });
    } catch (error) {
      reject(error);
    }
    // Resolve the promise
    resolve("deletion completed");
  });
};

/*=========================================================================================
METHOD
=========================================================================================*/

/*=========================================================================================
EXPORT ACCOUNT MODEL
=========================================================================================*/

module.exports = Session;

/*=========================================================================================
END
=========================================================================================*/
