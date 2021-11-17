// MODULES ==================================================

// VARIABLES ================================================

let classUpdate = {
	types: ["name", "metadata"],
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

classUpdate.main = (instance, updates, date, save = true) => {
	return new Promise(async (resolve, reject) => {
		// Check if all properties are valid
		let failed = {};
		for (let i = 0; i < updates.length; i++) {
			if (classUpdate.types.indexOf(updates[i].type) === -1) failed[updates[i].type] = "invalid type";
		}
		if (Object.keys(failed).length) return reject({ status: "failed", content: failed });
		// Update the properties
		for (let j = 0; j < updates.length; j++) {
			const type = updates[j].type;
			const update = updates[j].update;
			switch (type) {
				case "name":
					let document;
					try {
						document = await Class.findOne({ name: update.name, group: update.group });
					} catch (error) {
						return reject({ status: "error", content: error });
					}
					if (document) return reject({ status: "failed", content: { class: "taken" } });
					instance.name = update.name;
					break;
				case "metadata":
					Object.assign(instance.metadata, update);
					instance.markModified("metadata");
					break;
				default:
					instance[type] = update;
					break;
			}
		}
		// Save the changes
		if (save) {
			try {
				await instance.save();
			} catch (error) {
				return reject({ status: "error", content: error });
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
