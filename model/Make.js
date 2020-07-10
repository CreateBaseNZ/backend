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

const Comment = require("./Comment.js");

/*=========================================================================================
CREATE MAKE MODEL
=========================================================================================*/

const MakeSchema = new Schema({
  accountId: { type: Schema.Types.ObjectId },
  sessionId: { type: String, default: "" },
  file: {
    id: { type: Schema.Types.ObjectId },
    name: { type: String, required: true },
  },
  status: { type: String, required: true },
  build: { type: String, required: true },
  quick: { type: String, default: "" },
  process: { type: String, required: true },
  material: { type: String, required: true },
  quality: { type: String, required: true },
  strength: { type: String, required: true },
  colour: { type: String, required: true },
  quantity: {
    ordered: { type: Number, required: true },
    built: { type: Number, default: 0 }
  },
  comment: { type: Schema.Types.ObjectId },
  date: {
    awaitingQuote: { type: String, default: "" },
    checkout: { type: String, default: "" },
    purchased: { type: String, default: "" },
    modified: { type: String, default: "" },
  },
  price: { type: Number, default: 0 }
});

/*=========================================================================================
MIDDLEWARE
=========================================================================================*/

MakeSchema.pre("save", async function (next) {
  const date = moment().tz("Pacific/Auckland").format();
  // update the date modified property
  if (this.isModified()) this.date.modified = date;
  if (this.isModified("status")) this.date[this.status] = date;
  next();
});

/*=========================================================================================
STATIC
=========================================================================================*/

// @FUNC  build
// @TYPE  STATICS
// @DESC  
MakeSchema.statics.build = function (object = {}, save = true) {
  return new Promise(async (resolve, reject) => {
    // TO DO .....
    // VALIDATE EACH PROPERTY
    // TO DO .....
    // CREATE THE DOCUMENT
    let make = new this(object);
    if (save) {
      try {
        make = await make.save();
      } catch (error) {
        return reject({ status: "error", content: error });
      }
    }
    return resolve(make);
  });
}

// @FUNC  fetch
// @TYPE  STATICS
// @DESC  
MakeSchema.statics.fetch = function (query = {}, withComment = false) {
  return new Promise(async (resolve, reject) => {
    // FETCH MAKES
    let makes = [];
    try {
      makes = await this.find(query);
    } catch (error) {
      return reject({ status: "error", content: error });
    }
    let formattedMakes = [];
    if (!makes.length) return resolve(makes);
    for (let i = 0; i < makes.length; i++) formattedMakes[i] = makes[i].toObject();
    // GET COMMENT
    if (withComment) {
      let promises = [];
      for (let i = 0; i < makes.length; i++) promises.push(Comment.fetch({ _id: formattedMakes[i].comment }));
      let commentsArray;
      try {
        commentsArray = await Promise.all(promises);
      } catch (error) {
        return reject({ status: "error", content: error });
      }
      for (let i = 0; i < commentsArray.length; i++) formattedMakes[i].comment = commentsArray[i][0];
    }
    // CONSTRUCT THE FORMATTED MAKES
    const filteredMakes = formattedMakes.map(make => {
      let filteredMake = {
        id: make._id, file: make.file, build: make.build, quick: make.quick,
        process: make.process, material: make.material, quality: make.quality,
        strength: make.strength, colour: make.colour, quantity: make.quantity,
        comment: make.comment, date: make.date, price: make.price
      }
      return filteredMake;
    });
    return resolve(filteredMakes);
  });
}

// @FUNC  merge
// @TYPE  STATICS
// @DESC
// @ARGU
MakeSchema.statics.merge = function (accountId, sessionId) {
  return new Promise(async (resolve, reject) => {
    // FETCH THE MAKES WITH THE CORRESPONDING SESSION ID
    let makes;
    try {
      makes = await this.find({ sessionId });
    } catch (error) {
      return reject(error);
    }
    // UPDATE THE MAKES
    let promises = [];
    for (let i = 0; i < makes.length; i++) {
      let make = makes[i];
      make.accountId = accountId;
      promises.push(make.save());
    }
    // SAVE ALL MAKES
    try {
      await Promise.all(promises);
    } catch (error) {
      return reject({ status: "error", content: error });
    }
    // RETURN PROMISE RESOLVE
    return resolve();
  })
}

// @FUNC  deleteByIdAndAccountId
// @TYPE  STATICS
// @DESC
// @ARGU
MakeSchema.statics.deleteByIdAndAccountId = function (_id, accountId) {
  return new Promise(async (resolve, reject) => {
    // Find the make to be deleted
    let make;
    try {
      make = await this.findOne({ _id, accountId });
    } catch (error) {
      reject(error);
    }
    // Delete the make
    let deletedMake;
    try {
      deletedMake = await make.deleteOne();
    } catch (error) {
      reject(error);
    }
    // Find and Delete the comment associated with the Make
    if (deletedMake.comment) {
      const commentId = mongoose.Types.ObjectId(deletedMake.comment);
      let comment;
      try {
        comment = await Comment.findOne({ _id: commentId, accountId });
      } catch (error) {
        reject(error);
      }
      try {
        await comment.deleteOne();
      } catch (error) {
        reject(error);
      }
    }
    // Return the deleted make
    resolve(deletedMake);
  });
};

/*=========================================================================================
METHOD
=========================================================================================*/

// @FUNC  update
// @TYPE  METHODS
// @DESC
// @ARGU
MakeSchema.methods.update = function (updates) {
  // UPDATE ORDER
  for (let i = 0; i < updates.length; i++) {
    const update = updates[i];
    switch (update.property.length) {
      case 1:
        this[update.property[0]] = update.value;
        break;
      case 2:
        this[update.property[0]][update.property[1]] = update.value;
        break;
      case 3:
        this[update.property[0]][update.property[1]]
        [update.property[2]] = update.value;
        break;
      case 4:
        this[update.property[0]][update.property[1]]
        [update.property[2]][update.property[3]] = update.value;
        break;
      default:
        return;
    }
  }
  // SUCCESS RESPONSE
  return;
}

/*=========================================================================================
EXPORT MAKE MODEL
=========================================================================================*/

module.exports = Make = mongoose.model("make", MakeSchema);

/*=========================================================================================
END
=========================================================================================*/
