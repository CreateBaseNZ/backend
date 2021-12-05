// MODULES ==================================================

const mongoose = require("mongoose");

// VARIABLES ================================================

const Schema = mongoose.Schema;

// MODEL ====================================================

const DataSchema = new Schema({
	content: { type: Schema.Types.String, default: "" },
	project: { type: Schema.Types.String, default: "" },
	date: { type: Schema.Types.String, default: "" },
});

// STATICS ==================================================

// METHODS ==================================================

// EXPORT ===================================================

module.exports = Data = mongoose.model("data", DataSchema);

// END ======================================================
