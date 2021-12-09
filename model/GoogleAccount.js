// MODULES ==================================================

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const randomize = require("randomatic");

// VARIABLES ================================================

const Schema = mongoose.Schema;

// MODEL ====================================================

const GoogleAccountSchema = new Schema({
	profile: { type: Schema.Types.ObjectId },
	googleId: { type: Schema.Types.String, default: "" },
	email: { type: Schema.Types.String, default: "" },
	date: { type: Schema.Types.String, default: "" },
	metadata: { type: Schema.Types.Mixed, default: { init: "" } },
});

// MIDDLEWARE ===============================================

// STATICS ==================================================

// METHODS ==================================================

// EXPORT ===================================================

module.exports = GoogleAccount = mongoose.model("google-account", GoogleAccountSchema);

// END ======================================================
