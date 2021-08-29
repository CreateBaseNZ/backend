/*=========================================================================================
REQUIRED MODULES
=========================================================================================*/

const mongoose = require("mongoose");

/*=========================================================================================
VARIABLES
=========================================================================================*/

if (process.env.NODE_ENV !== "production") require("dotenv").config();
const Schema = mongoose.Schema;

/*=========================================================================================
CREATE COOKIE ALPHA MODEL
=========================================================================================*/

const CookieSchema = new Schema({
  id: { type: String, required: true },
  type: { type: String, required: true },
  date: { type: String, required: true },
  behaviours: [Schema.Types.Mixed]
});

/*=========================================================================================
STATIC
=========================================================================================*/

CookieSchema.statics.build = function (object = {}, save = true) {
  return new Promise(async (resolve, reject) => {
    // Validate the inputs
    // Create the cookie instance
    let cookie = new this(object);
    // Save the instance
    if (save) {
      try {
        await cookie.save();
      } catch (error) {
        return reject({ status: "error", content: error });
      }
    }
    // Resolve the promise
    return resolve(cookie);
  });
}

/*=========================================================================================
METHODS
=========================================================================================*/

/*=========================================================================================
EXPORT COOKIE MODEL
=========================================================================================*/

module.exports = Cookie = mongoose.model("cookies", CookieSchema);

/*=========================================================================================
END
=========================================================================================*/
