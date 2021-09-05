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
		if (object.license) {
			profile.license = object.license;
			profile.licenses = [object.license];
		}
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

ProfileSchema.statics.reform = function (object = {}, save = true) {
	return new Promise(async (resolve, reject) => {
		// Fetch the profile instance
		let profile;
		try {
			profile = await this.findOne({ _id: object.profile });
		} catch (error) {
			return reject({ status: "error", content: error });
		}
		// Update properties
		for (const property in object) {
			if (property === "displayName") {
				profile.reformDisplayName(object["displayName"]);
			} else if (property === "saves") {
				profile.reformSaves(object["saves"]);
			}
		}
		profile.date.modified = object.date;
		// Save updates
		profile.markModified("saves");
		if (save) {
			try {
				await profile.save();
			} catch (error) {
				return reject({ status: "error", content: error });
			}
		}
		// Return updated profile
		return resolve(profile);
	});
};

ProfileSchema.statics.retrieve = function (object = {}) {
	return new Promise(async (resolve, reject) => {
		// Fetch the profile instance
		let profile;
		try {
			profile = await this.findOne({ _id: object.profile });
		} catch (error) {
			return reject({ status: "error", content: error });
		}
		if (!profile) return reject({ status: "failed", content: "There is no profile found" });
		// Fetch data
		let data = new Object();
		if (object.properties) {
			for (let i = 0; i < object.properties.length; i++) {
				const property = object.properties[i];
				data[property] = profile[property];
			}
		}
		if (object.saves) {
			let saves = new Object();
			for (let i = 0; i < object.saves.length; i++) {
				const property = object.saves[i];
				saves[property] = profile.saves[property];
			}
			data["saves"] = saves;
		}
		// Return data
		return resolve(data);
	});
};

ProfileSchema.statics.retrieveAll = function (object = {}) {
	return new Promise(async (resolve, reject) => {
		// Fetch the profile instances
		let profiles;
		try {
			profiles = await this.find({ _id: object.profiles });
		} catch (error) {
			return reject({ status: "error", content: error });
		}
		// Filter the data
		let dataArray = [];
		for (let i = 0; i < profiles.length; i++) {
			const profile = profiles[i];
			let data = new Object();
			if (object.properties) {
				for (let i = 0; i < object.properties.length; i++) {
					const property = object.properties[i];
					data[property] = profile[property];
				}
			}
			if (object.saves) {
				let saves = new Object();
				for (let i = 0; i < object.saves.length; i++) {
					const property = object.saves[i];
					saves[property] = profile.saves[property];
				}
				data["saves"] = saves;
			}
			dataArray.push(data);
		}
		// Return data
		return resolve(dataArray);
	});
};

ProfileSchema.statics.demolishSaves = function (object = {}, save = true) {
	return new Promise(async (resolve, reject) => {
		// Fetch the profile instance
		let profile;
		try {
			profile = await this.findOne({ _id: object.profile });
		} catch (error) {
			return reject({ status: "error", content: error });
		}
		// Delete data
		for (let i = 0; i < object.saves.length; i++) {
			const property = object.saves[i];
			if (Object.hasOwnProperty.call(profile.saves, property)) {
				delete profile.saves[property];
			}
		}
		profile.date.modified = object.date;
		// Save updates
		profile.markModified("saves");
		if (save) {
			try {
				await profile.save();
			} catch (error) {
				return reject({ status: "error", content: error });
			}
		}
		// Return success
		return resolve();
	});
};

// METHODS ==================================================

ProfileSchema.methods.reformDisplayName = function (displayName = "") {
	// TODO: Validate Display Name
	// Update display name
	this.displayName = displayName;
	// Success handler
	return;
};

ProfileSchema.methods.reformSaves = function (saves = {}) {
	// TODO: Validate Saves
	// Updates saves
	if (!this.saves) this.saves = new Object();
	Object.assign(this.saves, saves);
	// Success handler
	return;
};

// EXPORT ===================================================

module.exports = Profile = mongoose.model("profiles", ProfileSchema);

// END ======================================================
