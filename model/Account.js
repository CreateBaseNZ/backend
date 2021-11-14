// MODULES ==================================================

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const randomize = require("randomatic");

// VARIABLES ================================================

const Schema = mongoose.Schema;

// MODEL ====================================================

const AccountSchema = new Schema({
	profile: { type: Schema.Types.ObjectId },
	email: { type: Schema.Types.String, default: "" },
	password: { type: Schema.Types.String, default: "" },
	date: {
		created: { type: Schema.Types.String, default: "" },
		modified: { type: Schema.Types.String, default: "" },
		verified: { type: Schema.Types.String, default: "" },
	},
	verified: {
		status: { type: Schema.Types.Boolean, default: false },
		code: { type: Schema.Types.String, default: "" },
		date: { type: Schema.Types.String, default: "" },
	},
	resetPassword: {
		code: { type: Schema.Types.String, default: "" },
		date: { type: Schema.Types.String, default: "" },
	},
	metadata: { type: Schema.Types.Mixed, default: { init: "" } },
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

// METHODS ==================================================

AccountSchema.methods.matchPassword = function (password = "") {
	return new Promise(async (resolve, reject) => {
		// Check if the password match
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

AccountSchema.methods.updateCode = function (property = "verified") {
	// Generate the code
	const code = randomize("aA0", 6);
	const date = new Date().toString();
	Object.assign(this[property], { code, date });
	return;
};

AccountSchema.methods.matchCode = function (code = "", property = "verified") {
	// TODO: Check if the code expired
	// Check if the code match
	if (code !== this[property].code) throw "incorrect";
	return;
};

// EXPORT ===================================================

module.exports = Account = mongoose.model("account", AccountSchema);

// END ======================================================
