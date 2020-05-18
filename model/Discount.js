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
CREATE DISCOUNT MODEL
=========================================================================================*/

const DiscountSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true
  },
  rate: {
    type: Number,
    required: true
  },
  duration: {
    type: {
      type: String,
      required: true
    },
    start: {
      type: String,
      default: ""
    },
    end: {
      type: String,
      default: ""
    }
  },
  audience: {
    type: {
      type: String,
      required: true
    },
    accounts: {
      type: [String],
      default: []
    },
    customers: {
      type: [Schema.Types.ObjectId],
      default: []
    }
  }
});

/*=========================================================================================
STATIC
=========================================================================================*/

// @FUNC  create
// @TYPE  ASYNCHRONOUS PROMISE
// @DESC  
// @ARGU
DiscountSchema.statics.create = function (properties) {
  return new Promise(async (resolve, reject) => {
    // VALIDATE DISCOUNT PROPERTIES
    let data;
    for (const property in properties) {
      data = this.validate(property, properties[property]);
      if (data.status === "invalid") {
        reject(data.content);
        return;
      }
    }
    // CREATE A DISCOUNT INSTANCE
    let discount = new this();
    // ASSIGN DISCOUNT INSTANCE PROPERTIES
    discount = properties;
    // SET DEFAULT VALUES;
    discount.setDefault();
    // SAVE THE NEW DISCOUNT INSTANCE
    try {
      await discount.save();
    } catch (error) {
      reject(error);
      return;
    }
    // RESOLVE THE PROMISE
    resolve();
    return;
  });
};

// @FUNC  update
// @TYPE  ASYNCHRONOUS PROMISE
// @DESC  
// @ARGU
DiscountSchema.statics.update = function (code, updates) {
  return new Promise(async (resolve, reject) => {
    // VALIDATE DISCOUNT PROPERTIES
    let data;
    for (const property in updates) {
      data = this.validate(property, updates[property]);
      if (data.status === "invalid") {
        reject(data.content);
        return;
      }
    }
    // FETCH THE DISCOUNT INSTANCE
    let discount;
    try {
      discount = await this.findOne({ code });
    } catch (error) {
      reject(error);
      return;
    }
    // UPDATE THE DISCOUNT INSTANCE
    for (const property in updates) {
      discount[property] = updates[property];
    }
    // SAVE THE UPDATED DISCOUNT INSTANCE
    try {
      await discount.save();
    } catch (error) {
      reject(error);
      return;
    }
    // RESOLVE THE PROMISE
    resolve();
    return;
  });
};

// @FUNC  validate
// @TYPE  PROMISE
// @DESC  
// @ARGU
DiscountSchema.statics.validate = function (property, value) {
  let data = {
    status: "valid",
    content: "the value of the property is valid"
  };
  if (property === "name") {
    const name = value;
    if (!name) {
      data.status = "invalid";
      data.content = "no name is provided";
      return;
    }
  } else if (property === "code") {
    const code = value;
    if (!code) {
      data.status = "invalid";
      data.content = "no code is provided";
      return;
    }
  } else if (property === "rate") {
    const rate = value;
    if (!rate) {
      data.status = "invalid";
      data.content = "no rate is provided";
      return;
    }
  } else if (property === "duration") {
    const duration = value;
    if (!duration) {
      data.status = "invalid";
      data.content = "no duration object is provided";
      return;
    }
    if (!(duration.type)) {
      data.status = "invalid";
      data.content = "no duration type is provided";
      return;
    }
  } else if (property === "audience") {
    const audience = value;
    if (!audience) {
      data.status = "invalid";
      data.content = "no audience object is provided";
      return;
    }
    if (!(audience.type)) {
      data.status = "invalid";
      data.content = "no audience type is provided";
      return;
    }
  }
}

/*=========================================================================================
METHOD
=========================================================================================*/

DiscountSchema.methods.setDefault = function () {
  // DECLARE AND INITIALISE TODAY'S DATE
  const today = moment().tz("Pacific/Auckland").format("YYYY-MM-DD");
  // SET START DATE TO TODAY IF NOTHING PROVIDED
  if (!(this.duration.start)) {
    this.duration.start = today;
  }
  return;
}

/*=========================================================================================
EXPORT ACCOUNT MODEL
=========================================================================================*/

module.exports = Discount = mongoose.model("discounts", DiscountSchema);

/*=========================================================================================
END
=========================================================================================*/
