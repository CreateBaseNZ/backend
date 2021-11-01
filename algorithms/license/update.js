// MODULES ==================================================

// VARIABLES ================================================

let licenseUpdate = {
	types: ["role", "metadata"],
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

licenseUpdate.main = (license, updates, date, save = true) => {
	return new Promise(async (resolve, reject) => {
		// Check if all properties are valid
		let failed = {};
		for (let i = 0; i < updates.length; i++) {
			if (licenseUpdate.types.indexOf(updates[i].type) === -1) failed[updates[i].type] = "invalid type";
		}
		if (Object.keys(failed).length) return reject({ status: "failed", content: failed });
		// Update the properties
		for (let j = 0; j < updates.length; j++) {
			const type = updates[j].type;
			const update = updates[j].update;
			switch (type) {
				case "metadata":
					Object.assign(license.metadata, update);
					license.markModified("metadata");
					break;
				default:
					license[type] = update;
					break;
			}
		}
		// Update the date modified
		license.date.modified = date;
		// Save the changes
		if (save) {
			try {
				await license.save();
			} catch (error) {
				return reject({ status: "error", content: error });
			}
		}
		// Success handler
		return resolve(license);
	});
};

// HELPERS ==================================================

// EXPORT ===================================================

module.exports = licenseUpdate;

// END ======================================================
