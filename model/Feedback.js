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
CREATE FEEDBACK ALPHA MODEL
=========================================================================================*/

const FeedbackSchema = new Schema({
	title: { type: String, required: true },
	items: [Schema.Types.Mixed],
});

/*=========================================================================================
STATIC
=========================================================================================*/

FeedbackSchema.statics.build = function (object = {}, save = true) {
	return new Promise(async (resolve, reject) => {
		// Validate the inputs
		// Create the feedback instance
		let feedback = new this(object);
		// Save the instance
		if (save) {
			try {
				await feedback.save();
			} catch (error) {
				return reject({ status: "error", content: error });
			}
		}
		// Resolve the promise
		return resolve(feedback);
	});
};

/*=========================================================================================
METHODS
=========================================================================================*/

/*=========================================================================================
EXPORT MAIL MODEL
=========================================================================================*/

module.exports = Feedback = mongoose.model("feedbacks", FeedbackSchema);

/*=========================================================================================
END
=========================================================================================*/
