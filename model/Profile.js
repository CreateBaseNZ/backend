// MODULES ==================================================

const mongoose = require("mongoose");

// VARIABLES ================================================

const Schema = mongoose.Schema;

// MODEL ====================================================

const ProfileSchema = new Schema({
	licenses: { type: [Schema.Types.ObjectId], default: [] },
	name: {
		first: { type: Schema.Types.String, default: "" },
		last: { type: Schema.Types.String, default: "" },
	},
	date: {
		created: { type: Schema.Types.String, default: "" },
		modified: { type: Schema.Types.String, default: "" },
		visited: { type: Schema.Types.String, default: "" },
	},
	saves: { type: Schema.Types.Mixed, default: { init: "" } },
	account: {
		local: { type: Schema.Types.ObjectId },
		google: { type: Schema.Types.String, default: "" },
	},
});

// STATICS ==================================================

// METHODS ==================================================

// EXPORT ===================================================

module.exports = Profile = mongoose.model("profile", ProfileSchema);

// END ======================================================
