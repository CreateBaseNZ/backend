// MODULES ==================================================

const mongoose = require("mongoose");

// VARIABLES ================================================

const Schema = mongoose.Schema;

// MODEL ====================================================

const ClassSchema = new Schema({
	organisation: { type: Schema.Types.ObjectId, required: true },
	creator: { type: Schema.Types.ObjectId, required: true },
	name: { type: Schema.Types.String, required: true },
	educators: { type: [Schema.Types.ObjectId], default: new Array() },
	learners: { type: [Schema.Types.ObjectId], default: new Array() },
	projects: { type: [Schema.Types.ObjectId], default: new Array() },
	private: {
		status: { type: Schema.Types.Boolean, default: false },
		password: { type: Schema.Types.String, default: "" },
	},
	archived: { type: Schema.Types.Boolean, default: false },
	date: {
		created: { type: Schema.Types.String, required: true },
		modified: { type: Schema.Types.String, required: true },
	},
	metadata: { type: Schema.Types.Mixed, default: new Object() },
});

// STATICS ==================================================

ClassSchema.statics.build = function (object = new Object(), save = true) {
	return new Promise(async (resolve, reject) => {
		// Validate the inputs
		try {
			await this.validate(object);
		} catch (data) {
			return reject(data);
		}
		// Create the instance
		const classInstance = new this(object);
		// Save the instance
		if (save) {
			try {
				await classInstance.save();
			} catch (error) {
				return reject({ status: "error", content: error });
			}
		}
		// Success handler
		return resolve(classInstance);
	});
};

ClassSchema.statics.retrieve = function (object = new Object()) {
	return new Promise(async (resolve, reject) => {});
};

ClassSchema.statics.reform = function (object = new Object(), save = true) {
	return new Promise(async (resolve, reject) => {});
};

ClassSchema.statics.demolish = function (object = new Object()) {
	return new Promise(async (resolve, reject) => {});
};

ClassSchema.statics.validate = function (object = new Object()) {
	return new Promise(async (resolve, reject) => {
		// Declare the variables
		let valid = true;
		let errors = new Object();
		// TODO: Perform validation on the inputs
		// Handle the outcome
		if (valid) {
			return resolve();
		} else {
			return reject({ status: "failed", content: errors });
		}
	});
};

// METHODS ==================================================

// EXPORT ===================================================

module.exports = Class = mongoose.model("classes", ClassSchema);

// END ======================================================
