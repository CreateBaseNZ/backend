// MODULES ==================================================

const mongoose = require("mongoose");

// VARIABLES ================================================

const Schema = mongoose.Schema;

// MODEL ====================================================

const FaultSchema = new Schema({
	email: { type: Schema.Types.String, default: "" },
	profile: { type: Schema.Types.ObjectId, default: "" },
	route: { type: Schema.Types.String, default: "" },
	type: { type: Schema.Types.String, default: "" },
	date: { type: Schema.Types.String, default: "" },
	message: { type: Schema.Types.String, default: "" },
	metadata: { type: Schema.Types.Mixed, default: { init: "" } },
});

// STATICS ==================================================

// METHODS ==================================================

// EXPORT ===================================================

module.exports = Fault = mongoose.model("fault", FaultSchema);

// END ======================================================
