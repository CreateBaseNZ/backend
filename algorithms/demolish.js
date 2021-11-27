// MODULES ==================================================

// VARIABLES ================================================

let demolish = {
	groups: undefined,
	classes: undefined,
	licenses: undefined,
	profiles: undefined,
	accounts: undefined,
};

// MODELS ===================================================

const Account = require("../model/Account.js");
const Class = require("../model/Class.js");
const Group = require("../model/Group.js");
const License = require("../model/License.js");
const Mail = require("../model/Mail.js");
const Profile = require("../model/Profile.js");

// FUNCTIONS ================================================

demolish.groups = (groups = [], licenses = [], classes = []) => {
	return new Promise(async (resolve, reject) => {
		if (!groups.length) return resolve();
		// Fetch licenses and classes
		if (!licenses.length) {
			let licenseIds = [];
			for (let i = 0; i < groups.length; i++) {
				licenseIds = licenseIds.concat(groups[i].licenses.active);
				licenseIds = licenseIds.concat(groups[i].licenses.queue);
				licenseIds = licenseIds.concat(groups[i].licenses.inactive);
			}
			if (licenseIds.length) {
				try {
					licenses = await License.find({ _id: licenseIds });
				} catch (error) {
					return reject({ status: "error", content: error });
				}
			}
		}
		if (!classes.length) {
			let classIds = [];
			for (let j = 0; j < groups.length; j++) {
				classIds = classIds.concat(groups[j].classes);
			}
			if (classIds.length) {
				try {
					classes = await Class.find({ _id: classIds });
				} catch (error) {
					return reject({ status: "error", content: error });
				}
			}
		}
		// Delete the classes associated with the group
		if (classes.length) {
			try {
				await demolish.classes(classes, licenses);
			} catch (error) {
				return reject(error);
			}
		}
		// Delete the licenses associated with the group
		if (licenses.length) {
			try {
				await demolish.licenses(licenses);
			} catch (error) {
				return reject(error);
			}
		}
		// Delete the group
		try {
			await Group.deleteMany({ _id: groups.map((element) => element._id) });
		} catch (error) {
			return reject({ status: "error", content: error });
		}
		// Success handler
		return resolve();
	});
};

demolish.classes = (classes = [], licenses = []) => {
	return new Promise(async (resolve, reject) => {
		if (!classes.length) return resolve();
		// Success handler
		return resolve();
	});
};

demolish.licenses = (licenses = [], option) => {
	return new Promise(async (resolve, reject) => {
		if (!licenses.length) return resolve();
		// Success handler
		return resolve();
	});
};

demolish.profiles = (profiles, option) => {
	return new Promise(async (resolve, reject) => {
		if (!profiles.length) return resolve();
		// Success handler
		return resolve();
	});
};

demolish.accounts = (accounts, option) => {
	return new Promise(async (resolve, reject) => {
		if (!accounts.length) return resolve();
		// Success handler
		return resolve();
	});
};

// HELPERS ==================================================

function convertToNormalObject(document) {
	return JSON.parse(JSON.stringify(document));
}

// EXPORT ===================================================

module.exports = demolish;

// END ======================================================
