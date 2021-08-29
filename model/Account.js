// MODULES ==================================================

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const randomize = require("randomatic");

// VARIABLES ================================================

const Schema = mongoose.Schema;

// OTHER MODELS =============================================

// MODEL ====================================================

const AccountSchema = new Schema({
	email: { type: String, required: true },
	password: { type: String, required: true },
	profile: { type: Schema.Types.ObjectId, required: true },
	verified: {
		status: { type: Boolean, required: true },
		code: { type: String, required: true },
		date: {
			codeGenerated: { type: String, required: true },
			verified: { type: String, required: true },
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
		// Generate the code
		const code = randomize("aA0", 6);
		// Create the input object
		let account = new this({
			email: object.email,
			password: object.password,
			verified: {
				status: false,
				code: code,
				date: { codeGenerated: object.date, verified: object.date },
			},
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
			errors.email = "This email is already taken.";
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

// EXPORT ===================================================

module.exports = Account = mongoose.model("accounts", AccountSchema);

// END ======================================================
