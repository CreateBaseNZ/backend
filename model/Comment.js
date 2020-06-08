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
CREATE COMMENT MODEL
=========================================================================================*/

const CommentSchema = new Schema({
  accountId: {
    type: Schema.Types.ObjectId
  },
  message: {
    type: String,
    default: ""
  },
  date: {
    created: {
      type: String,
      default: ""
    },
    modified: {
      type: String,
      default: ""
    }
  },
  attachments: {
    type: [Schema.Types.ObjectId],
    default: []
  }
});

/*=========================================================================================
STATIC
=========================================================================================*/

CommentSchema.statics.create = function (accountId, message = "", attachments = []) {
  return new Promise(async (resolve, reject) => {
    // CREATE COMMENT
    let comment = new this({ accountId, message, attachments });
    // SET DATES
    const date = moment().tz("Pacific/Auckland").format();
    comment.date = { created: date, modified: date };
    // SAVE COMMENT
    try {
      await comment.save();
    } catch (error) {
      return reject(error);
    }
    return resolve(comment);
  });
}

/*=========================================================================================
METHODS
=========================================================================================*/

CommentSchema.methods.setDate = function () {
  return new Promise(async (resolve, reject) => {
    const date = moment()
      .tz("Pacific/Auckland")
      .format();

    this.date.created = date;
    this.date.modified = date;

    let savedComment;

    try {
      savedComment = await this.save();
    } catch (error) {
      reject(error);
    }

    resolve(savedComment);
  });
};

CommentSchema.methods.updateDate = function () {
  return new Promise(async (resolve, reject) => {
    const date = moment()
      .tz("Pacific/Auckland")
      .format();

    this.date.modified = date;

    let savedComment;

    try {
      savedComment = await this.save();
    } catch (error) {
      reject(error);
    }

    resolve(savedComment);
  });
};

/*=========================================================================================
EXPORT COMMENT MODEL
=========================================================================================*/

module.exports = Comment = mongoose.model("comment", CommentSchema);

/*=========================================================================================
END
=========================================================================================*/
