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
  },
  usage: {
    type: {
      type: String,
      required: true
    },
    limit: {
      type: Number,
      default: 0
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
      if (data.status === "invalid") return reject(data.content);
    }
    // Check if the discount code already exist
    let discount;
    try {
      discount = await this.findOne({ code: properties.code });
    } catch (error) {
      return reject(error);
    }
    if (discount) return reject("overlapping discount code");
    // CREATE A DISCOUNT INSTANCE
    discount = new this(properties);
    // SET DEFAULT VALUES;
    discount.setDefault();
    // SAVE THE NEW DISCOUNT INSTANCE
    try {
      await discount.save();
    } catch (error) {
      return reject(error);
    }
    // RESOLVE THE PROMISE
    return resolve(discount);
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
      if (data.status === "invalid") return reject(data.content);
    }
    // FETCH THE DISCOUNT INSTANCE
    let discount;
    try {
      discount = await this.findOne({ code });
    } catch (error) {
      return reject(error);
    }
    // UPDATE THE DISCOUNT INSTANCE
    for (const property in updates) {
      discount[property] = updates[property];
    }
    // SAVE THE UPDATED DISCOUNT INSTANCE
    try {
      await discount.save();
    } catch (error) {
      return reject(error);
    }
    // RESOLVE THE PROMISE
    return resolve(discount);
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
    }
  } else if (property === "code") {
    const code = value;
    if (!code) {
      data.status = "invalid";
      data.content = "no code is provided";
    }
  } else if (property === "rate") {
    const rate = value;
    if (!rate) {
      data.status = "invalid";
      data.content = "no rate is provided";
    }
  } else if (property === "duration") {
    const duration = value;
    if (!duration) {
      data.status = "invalid";
      data.content = "no duration object is provided";
    }
    if (!(duration.type)) {
      data.status = "invalid";
      data.content = "no duration type is provided";
    }
  } else if (property === "audience") {
    const audience = value;
    if (!audience) {
      data.status = "invalid";
      data.content = "no audience object is provided";
    }
    if (!(audience.type)) {
      data.status = "invalid";
      data.content = "no audience type is provided";
    }
  } else if (property === "usage") {
    const usage = value;
    if (!usage) {
      data.status = "invalid";
      data.content = "no usage object is provided";
    }
    if (!(usage.type)) {
      data.status = "invalid";
      data.content = "no usage type is provided";
    }
  }
  return data;
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
