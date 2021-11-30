// MODULES ==================================================

const mongoose = require("mongoose");

// VARIABLES ================================================

const Schema = mongoose.Schema;

// MODEL ====================================================

const ErrorSchema = new Schema({
	email: { type: Schema.Types.String, default: "" },
	profile: { type: Schema.Types.ObjectId, default: "" },
	route: { type: Schema.Types.String, default: "" },
	type: { type: Schema.Types.String, default: "" },
	date: { type: Schema.Types.String, default: "" },
	metadata: { type: Schema.Types.Mixed, default: { init: "" } },
});

// STATICS ==================================================

// METHODS ==================================================

// EXPORT ===================================================

module.exports = Error = mongoose.model("error", ErrorSchema);

// END ======================================================
