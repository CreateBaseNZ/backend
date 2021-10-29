// MODULES ==================================================

// VARIABLES ================================================

let profileUpdate = {
	types: ["name", "saves"],
	main: undefined,
	saves: undefined,
};

// MODELS ===================================================

const Account = require("../../model/Account.js");
const Class = require("../../model/Class.js");
const Group = require("../../model/Group.js");
const License = require("../../model/License.js");
const Mail = require("../../model/Mail.js");
const Profile = require("../../model/Profile.js");

// FUNCTIONS ================================================

profileUpdate.main = (profile, updates, date, save = true) => {
	return new Promise(async (resolve, reject) => {
		// Check if all properties are valid
		let failed = {};
		for (let i = 0; i < updates.length; i++) {
			if (profileUpdate.types.indexOf(updates[i].type) === -1) failed[updates[i].type] = "invalid type";
		}
		if (Object.keys(failed).length) return reject({ status: "failed", content: failed });
		// Update the properties
		for (let j = 0; j < updates.length; j++) {
			const type = updates[j].type;
			const update = updates[j].update;
			switch (type) {
				case "name":
					profile.name.first = update.first ? update.first : profile.name.first;
					profile.name.last = update.last ? update.last : profile.name.last;
					break;
				case "saves":
					Object.assign(profile.saves, update);
					profile.markModified("saves");
					break;
				default:
					profile[type] = update;
					break;
			}
		}
		// Update the date modified
		profile.date.modified = date;
		// Save the changes
		if (save) {
			try {
				await profile.save();
			} catch (error) {
				return reject({ status: "error", content: error });
			}
		}
		// Success handler
		return resolve(profile);
	});
};

// HELPERS ==================================================

// EXPORT ===================================================

module.exports = profileUpdate;

// END ======================================================
