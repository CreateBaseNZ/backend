// MODULES ==================================================

const mongoose = require("mongoose");

// VARIABLES ================================================

const Schema = mongoose.Schema;

// MODEL ====================================================

const LicenseSchema = new Schema({
	group: { type: Schema.Types.ObjectId },
	role: { type: Schema.Types.String, default: "" },
	classes: { type: [Schema.Types.ObjectId], default: [] },
	date: {
		created: { type: Schema.Types.String, default: "" },
		modified: { type: Schema.Types.String, default: "" },
		deactivated: { type: Schema.Types.String, default: "" },
	},
	status: { type: Schema.Types.String, default: "" },
	metadata: { type: Schema.Types.Mixed, default: new Object() },
	profile: { type: Schema.Types.ObjectId },
});

// STATICS ==================================================

// METHODS ==================================================

// EXPORT ===================================================

module.exports = License = mongoose.model("license", LicenseSchema);

// END ======================================================
