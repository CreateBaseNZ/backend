/*=========================================================================================
REQUIRED MODULES
=========================================================================================*/

const mongoose = require("mongoose");

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
  comments: {
    type: [Schema.Types.ObjectId]
  },
  dates: {
    checkout: {
      type: String
    }
  },
  price: {
    type: Number
  }
});

/*=========================================================================================
EXPORT MAKE MODEL
=========================================================================================*/

module.exports = Make = mongoose.model("make", MakeSchema);

/*=========================================================================================
END
=========================================================================================*/
