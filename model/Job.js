// MODULES ==================================================

const mongoose = require("mongoose");

// VARIABLES ================================================

const Schema = mongoose.Schema;

// MODEL ====================================================

const JobSchema = new Schema({
	type: { type: Schema.Types.String, default: "" },
	metadata: { type: Schema.Types.Mixed, default: { init: "" } },
});

// STATICS ==================================================

// METHODS ==================================================

// EXPORT ===================================================

module.exports = Job = mongoose.model("job", JobSchema);

// END ======================================================
