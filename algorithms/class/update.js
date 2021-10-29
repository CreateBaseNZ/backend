// MODULES ==================================================

// VARIABLES ================================================

let classUpdate = {
	properties: [],
	main: undefined,
};

// MODELS ===================================================

const Account = require("../../model/Account.js");
const Class = require("../../model/Class.js");
const Group = require("../../model/Group.js");
const License = require("../../model/License.js");
const Mail = require("../../model/Mail.js");
const Profile = require("../../model/Profile.js");

// FUNCTIONS ================================================

classUpdate.main = (instance, update, date) => {
	return new Promise(async (resolve, reject) => {
		// Check if all properties are valid
		let failed = {};
		for (const property in update) {
			if (classUpdate.properties.indexOf(property) === -1) failed[property] = "invalid property";
		}
		if (Object.keys(failed).length) return reject({ status: "failed", content: failed });
		// Update the properties
		for (const property in update) {
			switch (property) {
				default:
					instance[property] = update[property];
					break;
			}
		}
		// Success handler
		return resolve(instance);
	});
};

// HELPERS ==================================================

// EXPORT ===================================================

module.exports = classUpdate;

// END ======================================================
