// MODULES ==================================================

const mongoose = require("mongoose");

// VARIABLES ================================================

const Schema = mongoose.Schema;

// MODEL ====================================================

const ProfileSchema = new Schema({
	license: { type: Schema.Types.ObjectId },
	licenses: [Schema.Types.ObjectId],
	account: {
		local: { type: Schema.Types.ObjectId },
		google: { type: Schema.Types.ObjectId },
	},
	displayName: { type: String, default: "" },
	saves: { type: Schema.Types.Mixed },
	date: {
		created: { type: String, required: true },
		visited: { type: String, required: true },
		modified: { type: String, required: true },
	},
});

// STATICS ==================================================

ProfileSchema.statics.build = function (object = {}, save = true) {
	return new Promise(async (resolve, reject) => {
		// Validate input data
		try {
			await this.validate(object);
		} catch (data) {
			return reject(data);
		}
		// Create the profile instance
		let profile = new this({ date: { created: object.date, visited: object.date, modified: object.date } });
		if (object.license) profile.license = object.license;
		if (object.account) {
			profile.account.local = object.account.local;
			profile.account.google = object.account.google;
		} else {
			profile.account = new Object();
		}
		if (object.displayName) profile.displayName = object.displayName;
		if (object.saves) {
			profile.saves = object.saves;
		} else {
			profile.saves = new Object();
		}
		// Save the profile instance
		if (save) {
			try {
				await profile.save();
			} catch (error) {
				return reject({ status: "error", content: error });
			}
		}
		// Success handler
		return resolve(profile);
	});
};

ProfileSchema.statics.validate = function (object = {}) {
	return new Promise(async (resolve, reject) => {
		// Declare variables
		let valid = true;
		let errors = {};
		// Handler
		if (valid) {
			return resolve();
		} else {
			return reject({ status: "failed", content: errors });
		}
	});
};

// METHODS ==================================================

// EXPORT ===================================================

module.exports = Profile = mongoose.model("profiles", ProfileSchema);

// END ======================================================
