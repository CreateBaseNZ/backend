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

demolish.groups = (groups = [], licenses = [], classes = [], process = "delete group") => {
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
				await demolish.classes(classes, groups, licenses, process);
			} catch (error) {
				return reject(error);
			}
		}
		// Delete the licenses associated with the group
		if (licenses.length) {
			try {
				await demolish.licenses(licenses, groups, classes, process);
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

demolish.classes = (classes = [], groups = [], licenses = [], process = "delete class") => {
	return new Promise(async (resolve, reject) => {
		if (!classes.length) return resolve();
		if (process === "delete class") {
			// Fetch groups
			// TODO: Validated inputted groups. Does it match with the groups' licenses?
			if (!groups.length) {
				let groupIds = [];
				for (let h = 0; h < classes.length; h++) {
					groupIds.push(classes[h].group);
				}
				try {
					groups = await Group.find({ _id: groupIds });
				} catch (error) {
					return reject({ status: "error", content: error });
				}
			}
			// Fetch licenses
			// TODO: Validated inputted licenses. Does it match with the classes' licenses?
			if (!licenses.length) {
				let licenseIds = [];
				for (let i = 0; i < classes.length; i++) {
					licenseIds = licenseIds.concat(classes[i].licenses.active);
					licenseIds = licenseIds.concat(classes[i].licenses.requested);
					licenseIds = licenseIds.concat(classes[i].licenses.invited);
				}
				if (licenseIds.length) {
					try {
						licenses = await License.find({ _id: licenseIds });
					} catch (error) {
						return reject({ status: "error", content: error });
					}
				}
			}
			let promises = [];
			// Remove the linkage between groups and classes
			for (let j = 0; j < classes.length; j++) {
				const instance = classes[j];
				// Find the group of interest
				let group = groups.find((group) => group._id.toString() === instance._id.toString());
				// Remove the class ID from the group's classes array
				group.classes = group.classes.filter((classId) => {
					return classId.toString() !== instance._id.toString();
				});
				// Save changes
				group.date.modified = new Date().toString();
				promises.push(group.save());
			}
			// Remove the linkage between licenses and classes
			if (licenses) {
				// For each license of each class, remove the class ID from its classes array
				for (let k = 0; k < classes.length; k++) {
					const instance = classes[k];
					// Retrieve all the licenses associated with the class
					let instanceLicenses = licenses.filter((license) => {
						return license.classes.some((classId) => classId.toString() === instance._id.toString());
					});
					// For each license, remove the class ID
					for (let l = 0; l < instanceLicenses.length; l++) {
						let license = instanceLicenses[l];
						// Remove the class ID from its classes array
						license.classes = license.classes.filter((classId) => {
							return classId.toString() !== instance._id.toString();
						});
						// Save changes
						license.date.modified = new Date().toString();
						promises.push(license.save());
					}
				}
			}
		}
		// Delete the class
		try {
			await Class.deleteMany({ _id: classes.map((element) => element._id) });
		} catch (error) {
			return reject({ status: "error", content: error });
		}
		// Success handler
		return resolve();
	});
};

demolish.licenses = (licenses = [], groups = [], classes = [], process = "delete license") => {
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
