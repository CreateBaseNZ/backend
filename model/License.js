// MODULES ==================================================

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// VARIABLES ================================================

const Schema = mongoose.Schema;

// OTHER MODELS =============================================

const Account = require("./Account.js");
const Profile = require("./Profile.js");

// MODEL ====================================================

const LicenseSchema = new Schema({
	organisation: { type: Schema.Types.ObjectId },
	username: { type: String, required: true },
	password: { type: String, required: true },
	statuses: [Schema.Types.Mixed],
	access: { type: String, required: true },
	profile: { type: Schema.Types.ObjectId, required: true },
	date: {
		modified: { type: String, required: true },
		visited: { type: String, required: true },
		created: { type: String, required: true },
	},
	join: {
		approved: { type: Boolean, default: false },
		date: { type: String, default: "" },
	},
	invite: {
		approved: { type: Boolean, default: false },
		date: { type: String, default: "" },
	},
});

// MIDDLEWARE ===============================================

LicenseSchema.pre("save", async function (next) {
	// Check if password has been modified
	if (this.isModified("password")) {
		// Hash the new password and update password
		this.password = await bcrypt.hash(this.password, 8);
	}
	// Exit the middleware
	return next();
});

// STATICS ==================================================

LicenseSchema.statics.build = function (object = {}, save = true) {
	return new Promise(async (resolve, reject) => {
		// Validate the inputs
		try {
			await this.validate(object);
		} catch (data) {
			return reject(data);
		}
		// Create the license instance
		let license = new this({
			username: object.username,
			password: object.password,
			statuses: object.statuses,
			access: object.access,
			date: { modified: object.date, visited: object.date, created: object.date },
			join: object.join,
		});
		if (object.organisation) license.organisation = object.organisation;
		if (object.profile) license.profile = object.profile;
		// Save the license instance
		if (save) {
			try {
				await license.save();
			} catch (error) {
				return reject({ status: "error", content: error });
			}
		}
		// Success handler
		return resolve(license);
	});
};

LicenseSchema.statics.validate = function (object = {}) {
	return new Promise(async (resolve, reject) => {
		// Declare variables
		let valid = true;
		let errors = {};
		// Check if user exist within the organisation
		try {
			await this.validateUsername(object.username, false);
		} catch (data) {
			if (data.status === "error") {
				return reject(data);
			} else if (data.status === "failed") {
				valid = false;
				errors.username = data.content;
			}
		}
		// Handler
		if (valid) {
			return resolve();
		} else {
			return reject({ status: "failed", content: errors });
		}
	});
};

LicenseSchema.statics.login = function (object = {}) {
	return new Promise(async (resolve, reject) => {
		// TO DO: Pre validation

		// Fetch the license
		let session = new Object();
		let license;
		try {
			license = await this.findOne({ username: object.username });
		} catch (error) {
			return reject({ status: "error", content: error });
		}
		// Post validation
		if (!license) {
			return reject({ status: "failed", content: { username: "incorrect username" } });
		}
		let match;
		try {
			match = await license.validatePassword(object.password);
		} catch (data) {
			return reject(data);
		}
		if (!match) {
			return reject({ status: "failed", content: { password: "incorrect password" } });
		}
		session.license = license._id;
		session.access = license.access;
		session.status = "free";
		// Set the organisation
		if (license.organisation) session.organisation = license.organisation;
		// Fetch the profile
		let profile;
		try {
			profile = await Profile.findOne({ _id: license.profile });
		} catch (error) {
			return reject({ status: "error", content: error });
		}
		session.profile = profile._id;
		// Fetch the account
		if (profile.account.local) {
			let account;
			try {
				account = await Account.findOne({ _id: profile.account.local });
			} catch (error) {
				console.log(error);
				return reject({ status: "error", content: error });
			}
			session.account = account._id;
			session.verified = account.verified.status;
		}
		// Success handler
		return resolve(session);
	});
};

LicenseSchema.statics.reform = function (object = {}, save = true) {
	return new Promise(async (resolve, reject) => {
		// Fetch the license
		let license;
		try {
			license = await this.findOne({ _id: object.license });
		} catch (error) {
			return reject({ status: "error", content: error });
		}
		if (!license) {
			return reject({ status: "error", content: "there is no license found" });
		}
		// Update the properties
		let valid = true;
		let errors = new Object();
		let account;
		if (object.account) {
			// Fetch the account
			try {
				account = await Account.findOne({ _id: object.account });
			} catch (error) {
				return reject({ status: "error", content: error });
			}
		}
		for (const property in object) {
			errors[property] = "";
			if (property === "username") {
				let license2;
				try {
					license2 = await this.findOne({ username: object.username });
				} catch (error) {
					return reject({ status: "error", content: error });
				}
				if (license2) {
					valid = false;
					errors.username = "already taken";
				} else {
					license.username = object.username;
				}
			} else if (property === "password") {
				// Validate old password
				let match;
				try {
					match = await license.validatePassword(object.oldPassword);
				} catch (data) {
					return reject(data);
				}
				if (match) {
					// Update the license's password
					license.password = object.password;
					// Update the password of the user's account
					if (account) {
						// Update the password
						account.password = object.password;
					}
				} else {
					valid = false;
					errors.password = "incorrect password";
				}
			} else {
				if (property !== "license" && property !== "date" && property !== "oldPassword" && property !== "account") {
					valid = false;
					errors[property] = "does not exist or cannot be updated";
				}
			}
		}
		// Check if the update was successful
		if (!valid) return reject({ status: "failed", content: errors });
		license.date.modified = object.date;
		// Save updates
		if (save) {
			try {
				await license.save();
			} catch (error) {
				return reject({ status: "error", content: error });
			}
			if (account) {
				try {
					await account.save();
				} catch (error) {
					return reject({ status: "error", content: error });
				}
			}
		}
		// Success handler
		return resolve(license);
	});
};

LicenseSchema.statics.retrieve = function (object = {}) {
	return new Promise(async (resolve, reject) => {
		// Fetch the license
		let license;
		try {
			license = await this.findOne({ _id: object.license });
		} catch (error) {
			return reject({ status: "error", content: error });
		}
		if (!license) {
			return reject({ status: "error", content: "there is no license found" });
		}
		// Fetch requested data
		let data = new Object();
		for (let i = 0; i < object.properties.length; i++) {
			const property = object.properties[i];
			if (property === "username") {
				data[property] = license[property];
			}
		}
		// Return the requested data
		return resolve(data);
	});
};

LicenseSchema.statics.validateUsername = function (username = "", isTaken = true) {
	return new Promise(async (resolve, reject) => {
		if (!username) return reject({ status: "failed", content: "no input" });
		// Check if the username is already taken
		let license;
		try {
			license = await this.findOne({ username });
		} catch (error) {
			return reject({ status: "error", content: error });
		}
		if (isTaken === !license) {
			if (isTaken) {
				return reject({ status: "failed", content: "invalid username" });
			} else {
				return reject({ status: "failed", content: "already taken" });
			}
		}
		// Success handler
		return resolve();
	});
};

// METHODS ==================================================

LicenseSchema.methods.validatePassword = function (password = "") {
	return new Promise(async (resolve, reject) => {
		let match;
		try {
			match = await bcrypt.compare(password, this.password);
		} catch (error) {
			return reject({ status: "error", content: error });
		}
		// Success handler
		return resolve(match);
	});
};

// EXPORT ===================================================

module.exports = License = mongoose.model("licenses", LicenseSchema);

// END ======================================================
