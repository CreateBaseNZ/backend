/*=========================================================================================
REQUIRED MODULES
=========================================================================================*/

const mongoose = require("mongoose");

/*=========================================================================================
VARIABLES
=========================================================================================*/

const Schema = mongoose.Schema;

/*=========================================================================================
SUB MODELS
=========================================================================================*/

const AddressSchema = new Schema({
  unit: {
    type: String
  },
  street: {
    number: {
      type: String
    },
    name: {
      type: String
    }
  },
  suburb: {
    type: String
  },
  city: {
    type: String
  },
  postcode: {
    type: String
  },
  country: {
    type: String
  }
});

/*=========================================================================================
CREATE ORDER MODEL
=========================================================================================*/

const OrderSchema = new Schema({
  accountId: {
    type: Schema.Types.ObjectId
  },
  status: {
    type: String
  },
  makes: {
    type: [Schema.Types.ObjectId]
  },
  items: {
    type: [Schema.Types.ObjectId]
  },
  discounts: {
    type: [Schema.Types.ObjectId]
  },
  manufacturingSpeed: {
    type: String
  },
  shipping: {
    address: {
      option: {
        type: String
      },
      saved: {
        type: AddressSchema
      },
      new: {
        type: AddressSchema
      },
      save: {
        type: Boolean
      }
    },
    method: {
      type: String
    }
  }
});

/*=========================================================================================
EXPORT ORDER MODEL
=========================================================================================*/

module.exports = Order = mongoose.model("orders", OrderSchema);

/*=========================================================================================
END
=========================================================================================*/
