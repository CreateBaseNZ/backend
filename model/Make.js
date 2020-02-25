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
CREATE MAKE MODEL
=========================================================================================*/

const MakeSchema = new Schema({
  accountId: {
    type: Schema.Types.ObjectId
  },
  fileId: {
    type: Schema.Types.ObjectId
  },
  status: {
    type: String
  },
  build: {
    type: String
  },
  process: {
    type: String
  },
  material: {
    type: String
  },
  quality: {
    type: String
  },
  strength: {
    type: String
  },
  colour: {
    type: String
  },
  quantity: {
    type: Number
  },
  comment: {
    type: Schema.Types.ObjectId
  },
  date: {
    awaitingQuote: {
      type: String
    },
    checkout: {
      type: String
    },
    purchased: {
      type: String
    },
    modified: {
      type: String
    }
  },
  price: {
    type: Number
  }
});

/*=========================================================================================
STATIC
=========================================================================================*/

// @FUNC  findByAccountIdAndStatus
// @TYPE  STATICS
// @DESC
// @ARGU
MakeSchema.statics.findByAccountIdAndStatus = function(accountId, status) {
  return new Promise(async (resolve, reject) => {
    let makes;

    try {
      makes = await this.find({ accountId, status });
    } catch (error) {
      reject(error);
    }

    resolve(makes);
  });
};

/*=========================================================================================
METHOD
=========================================================================================*/

// @FUNC  updateStatus
// @TYPE  METHODS
// @DESC
// @ARGU
MakeSchema.methods.updateStatus = function(status) {
  return new Promise(async (resolve, reject) => {
    const statuses = ["awaitingQuote", "checkout", "purchased"];

    // VALIDATION START

    if (statuses.indexOf(status) === -1) {
      reject("invalid status");
    }

    // VALIDATION END

    const date = moment()
      .tz("Pacific/Auckland")
      .format();

    this.status = status;
    this.date[status] = date;
    this.date.modified = date;

    let savedMake;

    try {
      savedMake = await this.save();
    } catch (error) {
      reject({
        status: "failed",
        message: error
      });
    }

    resolve(savedMake);
  });
};

/*=========================================================================================
EXPORT MAKE MODEL
=========================================================================================*/

module.exports = Make = mongoose.model("make", MakeSchema);

/*=========================================================================================
END
=========================================================================================*/
