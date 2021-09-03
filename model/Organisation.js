// MODULES ==================================================

const mongoose = require("mongoose");
const randomize = require("randomatic");

// VARIABLES ================================================

const Schema = mongoose.Schema;

// MODEL ====================================================

const OrganisationSchema = new Schema({
	name: { type: String, required: true },
	licenses: [Schema.Types.ObjectId],
	type: { type: String, required: true },
	lite: {
		activated: { type: Boolean, required: true },
		date: { type: String, default: "" },
	},
	location: {
		city: { type: String, required: true },
		country: { type: String, required: true },
	},
	date: {
		created: { type: String, required: true },
		modified: { type: String, required: true },
	},
	join: {
		educator: { type: String, required: true },
		learner: { type: String, required: true },
	},
	metadata: { type: Schema.Types.Mixed },
});

// STATICS ==================================================

OrganisationSchema.statics.build = function (object = {}, save = true) {
	return new Promise(async (resolve, reject) => {
		// Validate the inputs
		try {
			await this.validate(object);
		} catch (data) {
			return reject(data);
		}
		// Generate the code
		const codeEducator = randomize("aA0", 6);
		const codeLearner = randomize("aA0", 6);
		// Create the organisation instance
		let organisation = new this({
			name: object.name,
			licenses: [object.license],
			type: object.type,
			lite: object.lite,
			location: { city: object.city, country: object.country },
			date: { created: object.date, modified: object.date },
			join: { educator: codeEducator, learner: codeLearner },
			metadata: object.metadata,
		});
		// Save the organisation instance
		if (save) {
			try {
				await organisation.save();
			} catch (error) {
				return reject({ status: "error", content: error });
			}
		}
		// Success handler
		return resolve(organisation);
	});
};

OrganisationSchema.statics.validate = function (object = {}) {
	return new Promise(async (resolve, reject) => {
		// Declare variables
		let valid = true;
		let errors = [];
		// Check if organisation already exist
		let organisation;
		try {
			organisation = await this.findOne({ name: object.name });
		} catch (error) {
			return reject({ status: "error", content: error });
		}
		if (organisation) {
			valid = false;
			errors.push("This organisation already exist");
		}
		// Handler
		if (valid) {
			return resolve();
		} else {
			return reject({ status: "failed", content: errors });
		}
	});
};

// METHODS ==================================================

// EXPORT ===================================================

module.exports = Organisation = mongoose.model("organisations", OrganisationSchema);

// END ======================================================
