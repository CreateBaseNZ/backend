// MODULES ==================================================

const mongoose = require("mongoose");

// VARIABLES ================================================

const Schema = mongoose.Schema;

// MODEL ====================================================

const ClassSchema = new Schema({
	organisation: { type: Schema.Types.ObjectId, required: true },
	admin: { type: Schema.Types.ObjectId, required: true },
	name: { type: Schema.Types.String, required: true },
	educators: { type: [Schema.Types.ObjectId], default: new Array() },
	learners: { type: [Schema.Types.ObjectId], default: new Array() },
	projects: { type: [Schema.Types.ObjectId], default: new Array() },
	private: {
		status: { type: Schema.Types.Boolean, default: false },
		password: { type: Schema.Types.String, default: "" },
	},
	hide: { type: Schema.Types.Boolean, default: false },
	archive: { type: Schema.Types.Boolean, default: false },
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
		// Name
		try {
			await this.validateName(object);
		} catch (data) {
			if (data.status === "error") {
				return reject(data);
			} else {
				valid = false;
				errors.name = data.content;
			}
		}
		// TODO: Perform validation on the inputs
		// Handle the outcome
		if (valid) {
			return resolve();
		} else {
			return reject({ status: "failed", content: errors });
		}
	});
};

ClassSchema.statics.validateName = function (object = new Object()) {
	return new Promise(async (resolve, reject) => {
		// Check if the name is already taken
		let classInstance;
		try {
			classInstance = await this.findOne({ organisation: object.organisation, name: object.name });
		} catch (error) {
			return reject({ status: "error", content: error });
		}
		if (classInstance) return reject({ status: "failed", content: "already taken" });
		// Success handler
		return resolve();
	});
};

// METHODS ==================================================

// EXPORT ===================================================

module.exports = Class = mongoose.model("classes", ClassSchema);

// END ======================================================
