// MODULES ==================================================

const mongoose = require("mongoose");

// VARIABLES ================================================

const Schema = mongoose.Schema;

// MODEL ====================================================

const ProjectConfigSchema = new Schema({
	authors: { type: [Schema.Types.ObjectId], default: new Array() },
	project: { type: Schema.Types.String, required: true },
	metadata: { type: Schema.Types.Mixed, default: new Object() },
});

// STATICS ==================================================

ProjectConfigSchema.statics.build = function (object = new Object(), save = true) {
	return new Promise(async (resolve, reject) => {
		// Validate the inputs
		try {
			await this.validate(object);
		} catch (data) {
			return reject(data);
		}
		// Create the instance
		const projectConfig = new this(object);
		// Save the instance
		if (save) {
			try {
				await projectConfig.save();
			} catch (error) {
				return reject({ status: "error", content: error });
			}
		}
		// Success handler
		return resolve(projectConfig);
	});
};

ProjectConfigSchema.statics.retrieve = function (object = new Object()) {
	return new Promise(async (resolve, reject) => {});
};

ProjectConfigSchema.statics.reform = function (object = new Object(), save = true) {
	return new Promise(async (resolve, reject) => {});
};

ProjectConfigSchema.statics.demolish = function (object = new Object()) {
	return new Promise(async (resolve, reject) => {});
};

ProjectConfigSchema.statics.validate = function (object = new Object()) {
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

module.exports = ProjectConfig = mongoose.model("project-configs", ProjectConfigSchema);

// END ======================================================
