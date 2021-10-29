// MODULES ==================================================

const mongoose = require("mongoose");
const randomize = require("randomatic");

// VARIABLES ================================================

const Schema = mongoose.Schema;

// MODEL ====================================================

const GroupSchema = new Schema({
	number: { type: Schema.Types.String, default: "" },
	name: { type: Schema.Types.String, default: "" },
	type: { type: Schema.Types.String, default: "" },
	location: {
		address: { type: Schema.Types.String, default: "" },
		city: { type: Schema.Types.String, default: "" },
		country: { type: Schema.Types.String, default: "" },
	},
	classes: { type: [Schema.Types.ObjectId], default: [] },
	licenses: {
		active: { type: [Schema.Types.ObjectId], default: [] },
		queue: { type: [Schema.Types.ObjectId], default: [] },
		inactive: { type: [Schema.Types.ObjectId], default: [] },
	},
	join: { type: Schema.Types.Mixed, default: new Object() },
	date: {
		created: { type: Schema.Types.String, default: "" },
		modified: { type: Schema.Types.String, default: "" },
		verified: { type: Schema.Types.String, default: "" },
	},
	verified: { type: Schema.Types.Boolean, default: false },
	payment: { type: [Schema.Types.ObjectId], default: [] },
	metadata: { type: Schema.Types.Mixed, default: new Object() },
});

// STATICS ==================================================

GroupSchema.statics.generateNumber = function () {
	return new Promise(async (resolve, reject) => {
		let number;
		let unique = false;
		// Generate a unique group number
		while (!unique) {
			// Generate a group number
			number = randomize("0", 6);
			// Check if the group number is already taken
			let group;
			try {
				group = await this.findOne({ number });
			} catch (error) {
				return reject({ status: "error", content: error });
			}
			if (!group) unique = true;
		}
		// Success handling
		return resolve(number);
	});
};

GroupSchema.statics.generateCode = function (property = "") {
	return new Promise(async (resolve, reject) => {
		let code;
		let unique = false;
		// Generate a unique join code
		while (!unique) {
			// Generate a join code
			code = randomize("aA0", 6);
			// Check if the join code is already taken
			let promise;
			switch (property) {
				case "teacher":
					promise = this.findOne({ "join.teacher": code });
					break;
				case "student":
					promise = this.findOne({ "join.student": code });
					break;
				default:
					return reject({ status: "failed", content: { code: "invalid property" } });
			}
			let group;
			try {
				group = await promise;
			} catch (error) {
				return reject({ status: "error", content: error });
			}
			if (!group) unique = true;
		}
		// Success handling
		return resolve(code);
	});
};

// METHODS ==================================================

// EXPORT ===================================================

module.exports = Group = mongoose.model("group", GroupSchema);

// END ======================================================
