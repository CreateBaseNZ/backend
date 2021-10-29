// MODULES ==================================================

// VARIABLES ================================================

let groupUpdate = {
	properties: ["name"],
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

groupUpdate.main = (group, update, date) => {
	return new Promise(async (resolve, reject) => {
		// Check if all properties are valid
		let failed = {};
		for (const property in update) {
			if (groupUpdate.properties.indexOf(property) === -1) failed[property] = "invalid property";
		}
		if (Object.keys(failed).length) return reject({ status: "failed", content: failed });
		// Update the properties
		for (const property in update) {
			switch (property) {
				default:
					group[property] = update[property];
					break;
			}
		}
		// Update the date modified
		group.date.modified = date;
		// Success handler
		return resolve(group);
	});
};

// HELPERS ==================================================

// EXPORT ===================================================

module.exports = groupUpdate;

// END ======================================================
