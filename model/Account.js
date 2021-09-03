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
		let errors = { email: "", username: "", displayName: "", password: "", date: "" };
		// Check if user exist within the organisation
		let account;
		try {
			account = await this.findOne({ email: object.email });
		} catch (error) {
			return reject({ status: "error", content: error });
		}
		if (account) {
			valid = false;
			errors.email = "This email is already taken";
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

AccountSchema.methods.sendAccountVerificationEmail = function () {
	return new Promise(async (resolve, reject) => {
		// Fetch the profile
		let profile;
		try {
			profile = await Profile.findOne({ "account.local": this._id });
		} catch (error) {
			return reject({ status: "error", content: error });
		}
		// Validate if the profile has been fetched successfully
		if (!profile) {
			return res.send({ status: "failed", content: "There is not profile associated with this account" });
		}
		// Generate the code
		const code = randomize("aA0", 6);
		// Create the input object
		const input = { email: this.email, displayName: profile.displayName };
		// Create the email object
		let mail;
		try {
			mail = await email.create(input, "account-verification");
		} catch (data) {
			return reject(data);
		}
		try {
			await email.send(mail);
		} catch (data) {
			return reject(data);
		}
		return resolve();
	});
};

// EXPORT ===================================================

module.exports = Account = mongoose.model("accounts", AccountSchema);

// END ======================================================
