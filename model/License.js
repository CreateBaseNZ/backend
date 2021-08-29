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
		let errors = {
			username: "",
		};
		// Check if user exist within the organisation
		let license;
		try {
			license = await this.findOne({ username: object.username });
		} catch (error) {
			return reject({ status: "error", content: error });
		}
		if (license) {
			valid = false;
			errors.username = "This username is already taken.";
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
			return reject({ status: "failed", content: { username: "Incorrect username.", password: "" } });
		}
		let match;
		try {
			match = await license.validatePassword(object.password);
		} catch (data) {
			return reject(data);
		}
		if (!match) {
			return reject({ status: "failed", content: { username: "", password: "Incorrect password." } });
		}
		session.license = license._id;
		session.access = license.access;
		session.status = "free";
		// Fetch the organisation
		if (license.organisation) {
		}
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
				return reject({ status: "error", content: error });
			}
			session.account = account._id;
			session.verified = account.verified.status;
		}
		// Success handler
		return resolve(session);
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
