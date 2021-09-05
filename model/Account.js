// MODULES ==================================================

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const randomize = require("randomatic");

// VARIABLES ================================================

const email = require("../configs/email.js");
const Schema = mongoose.Schema;

// OTHER MODELS =============================================

const Profile = require("./Profile.js");

// MODEL ====================================================

const AccountSchema = new Schema({
	email: { type: String, required: true },
	password: { type: String, required: true },
	profile: { type: Schema.Types.ObjectId, required: true },
	verified: {
		status: { type: Boolean, default: false },
		code: { type: String, default: "" },
		date: {
			codeGenerated: { type: String, default: "" },
			verified: { type: String, default: "" },
		},
	},
	resetPassword: {
		code: { type: String, default: "" },
		date: { type: String, default: "" },
	},
	date: {
		created: { type: String, required: true },
		modified: { type: String, required: true },
	},
});

// MIDDLEWARE ===============================================

AccountSchema.pre("save", async function (next) {
	// Check if password has been modified
	if (this.isModified("password")) {
		// Hash the new password and update password
		this.password = await bcrypt.hash(this.password, 8);
	}
	// Exit the middleware
	return next();
});

// STATICS ==================================================

AccountSchema.statics.build = function (object = {}, save = true) {
	return new Promise(async (resolve, reject) => {
		// Validate input data
		try {
			await this.validate(object);
		} catch (data) {
			return reject(data);
		}
		// Create the input object
		let account = new this({
			email: object.email,
			password: object.password,
			date: { created: object.date, modified: object.date },
		});
		if (object.profile) account.profile = object.profile;
		// Save the the new account
		if (save) {
			try {
				await account.save();
			} catch (error) {
				return reject({ status: "error", content: error });
			}
		}
		// Return the account
		return resolve(account);
	});
};

AccountSchema.statics.validate = function (object = {}) {
	return new Promise(async (resolve, reject) => {
		// Declare variables
		let valid = true;
		let errors = {};
		// Check if user exist within the organisation
		let account;
		try {
			account = await this.findOne({ email: object.email });
		} catch (error) {
			return reject({ status: "error", content: error });
		}
		if (account) {
			valid = false;
			errors.email = "already taken";
		}
		// Handler
		if (valid) {
			return resolve();
		} else {
			return reject({ status: "failed", content: errors });
		}
	});
};

// METHODS ==================================================

AccountSchema.methods.sendAccountVerificationEmail = function (object = {}, save = true) {
	return new Promise(async (resolve, reject) => {
		// Update verification code before all else
		try {
			await this.setVerificationCode(object, save);
		} catch (data) {
			return reject(data);
		}
		// Fetch the profile
		let profile;
		try {
			profile = await Profile.findOne({ "account.local": this._id });
		} catch (error) {
			return reject({ status: "error", content: error });
		}
		// Validate if the profile has been fetched successfully
		if (!profile) return res.send({ status: "error", content: "there is no profile associated with this account" });
		// Create the input object
		const input = { email: this.email, displayName: profile.displayName, code: this.verified.code };
		// Create the email object
		let mail;
		try {
			mail = await email.create(input, "account-verification");
		} catch (data) {
			return reject(data);
		}
		// Send the verification email
		try {
			await email.send(mail);
		} catch (data) {
			return reject(data);
		}
		// Success handler
		return resolve();
	});
};

AccountSchema.methods.setVerificationCode = function (object = {}, save = true) {
	return new Promise(async (resolve, reject) => {
		// Generate the code
		const code = randomize("aA0", 6);
		// Set parametres of the verification object
		this.verified.code = code;
		this.verified.date.codeGenerated = new Date().toString();
		// Save the account
		if (save) {
			try {
				await this.save();
			} catch (error) {
				return reject({ status: "error", content: error });
			}
		}
		// Success handler
		return resolve();
	});
};

AccountSchema.methods.verify = function (object = {}, save = true) {
	return new Promise(async (resolve, reject) => {
		// Check if the code matches
		if (this.verified.code !== object.code) {
			return reject({ status: "failed", content: { code: "incorrect code" } });
		}
		// Update the verification status
		this.verified.status = true;
		this.verified.date.verified = new Date().toString();
		// Save the account
		if (save) {
			try {
				await this.save();
			} catch (error) {
				return reject({ status: "error", content: error });
			}
		}
		// Success handler
		return resolve();
	});
};

AccountSchema.methods.sendPasswordResetEmail = function (object = {}, save = true) {
	return new Promise(async (resolve, reject) => {
		// Update password reset code before all else
		try {
			await this.setPasswordResetCode(object, save);
		} catch (data) {
			return reject(data);
		}
		// Fetch the profile
		let profile;
		try {
			profile = await Profile.findOne({ "account.local": this._id });
		} catch (error) {
			return reject({ status: "error", content: error });
		}
		// Validate if the profile has been fetched successfully
		if (!profile) return res.send({ status: "error", content: "there is no profile associated with this account" });
		// Create the input object
		const input = { email: this.email, displayName: profile.displayName, code: this.resetPassword.code };
		// Create the email object
		let mail;
		try {
			mail = await email.create(input, "password-reset");
		} catch (data) {
			return reject(data);
		}
		// Send the verification email
		try {
			await email.send(mail);
		} catch (data) {
			return reject(data);
		}
		// Success handler
		return resolve();
	});
};

AccountSchema.methods.setPasswordResetCode = function (object = {}, save = true) {
	return new Promise(async (resolve, reject) => {
		// Generate the code
		const code = randomize("aA0", 6);
		// Set parametres of the verification object
		this.resetPassword.code = code;
		this.resetPassword.date = new Date().toString();
		// Save the account
		if (save) {
			try {
				await this.save();
			} catch (error) {
				return reject({ status: "error", content: error });
			}
		}
		// Success handler
		return resolve();
	});
};

// EXPORT ===================================================

module.exports = Account = mongoose.model("accounts", AccountSchema);

// END ======================================================
