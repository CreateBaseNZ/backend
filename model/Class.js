// MODULES ==================================================

const mongoose = require("mongoose");
const randomize = require("randomatic");

// VARIABLES ================================================

const Schema = mongoose.Schema;

// MODEL ====================================================

const ClassSchema = new Schema({
	group: { type: Schema.Types.ObjectId },
	name: { type: Schema.Types.String, default: "" },
	subject: { type: Schema.Types.String, default: "" },
	licenses: { type: [Schema.Types.ObjectId], default: [] },
	code: { type: Schema.Types.String, default: "" },
	metadata: { type: Schema.Types.Mixed, default: { init: "" } },
});

// STATICS ==================================================

ClassSchema.statics.generateCode = function (group) {
	return new Promise(async (resolve, reject) => {
		let code;
		let unique = false;
		// Generate a unique join code
		while (!unique) {
			// Generate a join code
			code = randomize("aA0", 6);
			// Check if the join code is already taken
			let instance;
			try {
				instance = await this.findOne({ group, code });
			} catch (error) {
				return reject({ status: "error", content: error });
			}
			if (!instance) unique = true;
		}
		// Success handling
		return resolve(code);
	});
};

// METHODS ==================================================

// EXPORT ===================================================

module.exports = Class = mongoose.model("class", ClassSchema);

// END ======================================================
