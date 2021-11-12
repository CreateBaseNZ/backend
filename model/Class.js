// MODULES ==================================================

const mongoose = require("mongoose");
const randomize = require("randomatic");

// VARIABLES ================================================

const Schema = mongoose.Schema;

// MODEL ====================================================

const ClassSchema = new Schema({
	group: { type: Schema.Types.ObjectId },
	name: { type: Schema.Types.String, default: "" },
	subject: { type: Schema.Types.String, default: "" },
	licenses: {
		active: { type: [Schema.Types.ObjectId], default: [] },
		requested: { type: [Schema.Types.ObjectId], default: [] },
		invited: { type: [Schema.Types.ObjectId], default: [] },
	},
	metadata: { type: Schema.Types.Mixed, default: { init: "" } },
});

// STATICS ==================================================

// METHODS ==================================================

// EXPORT ===================================================

module.exports = Class = mongoose.model("class", ClassSchema);

// END ======================================================
