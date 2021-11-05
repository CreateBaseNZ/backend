// MODULES ==================================================

// VARIABLES ================================================

let retrieve = {
	groups: undefined,
	classes: undefined,
	licenses: undefined,
	profiles: undefined,
};

// MODELS ===================================================

const Account = require("../model/Account.js");
const Class = require("../model/Class.js");
const Group = require("../model/Group.js");
const License = require("../model/License.js");
const Mail = require("../model/Mail.js");
const Profile = require("../model/Profile.js");

// FUNCTIONS ================================================

retrieve.groups = (groups, option) => {
	return new Promise(async (resolve, reject) => {
		if (option.license) {
			// Convert group instances into a normal object and create an array of license IDs
			let licenseIds = [];
			for (let i = 0; i < groups.length; i++) {
				groups[i] = convertToNormalObject(groups[i]);
				licenseIds = licenseIds.concat(groups[i].licenses.active);
				licenseIds = licenseIds.concat(groups[i].licenses.queue);
				licenseIds = licenseIds.concat(groups[i].licenses.inactive);
			}
			licenseIds = [...new Set(licenseIds)];
			// Fetch the license instances associated with these groups
			let licenses;
			try {
				licenses = await License.find({ _id: licenseIds });
			} catch (error) {
				return reject({ status: "error", content: error });
			}
			// Fetch details of the license instances
			try {
				licenses = await retrieve.licenses(licenses, option);
			} catch (data) {
				return reject(data);
			}
			// Filter license instances details
			if (option.license.length) {
				licenses = licenses.map((license) => {
					let object = {};
					for (let j = 0; j < option.license.length; j++) {
						object[option.license[j]] = license[option.license[j]];
					}
					return object;
				});
			}
			// Attach the license instances to their respective groups
			for (let k = 0; k < groups.length; k++) {
				for (let l = 0; l < groups[k].licenses.active.length; l++) {
					groups[k].licenses.active[l] = licenses.find((license) => license._id.toString() === groups[k].licenses.active[l].toString());
				}
				for (let m = 0; m < groups[k].licenses.queue.length; m++) {
					groups[k].licenses.queue[m] = licenses.find((license) => license._id.toString() === groups[k].licenses.queue[m].toString());
				}
				for (let n = 0; n < groups[k].licenses.inactive.length; n++) {
					groups[k].licenses.inactive[n] = licenses.find((license) => license._id.toString() === groups[k].licenses.inactive[n].toString());
				}
			}
		}
		if (option.class) {
			// Convert group instances into a normal object and create an array of class IDs
			let classIds = [];
			for (let i = 0; i < groups.length; i++) {
				groups[i] = convertToNormalObject(groups[i]);
				classIds = classIds.concat(groups[i].classes);
			}
			classIds = [...new Set(classIds)];
			if (classIds.length) {
				// Fetch the class instances associated with these groups
				let classes;
				try {
					classes = await Class.find(classIds);
				} catch (error) {
					return reject({ status: "error", content: error });
				}
				// Fetch details of the class instances
				try {
					classes = await retrieve.classes(classes, option);
				} catch (data) {
					return reject(data);
				}
				// Filter class instances details
				if (option.class.length) {
					classes = classes.map((instance) => {
						let object = {};
						for (let j = 0; j < option.class.length; j++) {
							object[option.class[j]] = instance[option.class[j]];
						}
						return object;
					});
				}
				// Attach the class instances to their respective groups
				for (let k = 0; k < groups.length; k++) {
					for (let l = 0; l < groups[k].classes.length; l++) {
						groups[k].classes[l] = classes.find((instance) => instance._id.toString() === groups[k].classes[l].toString());
					}
				}
			}
		}
		// Success handler
		return resolve(groups);
	});
};

retrieve.classes = (classes, option) => {
	return new Promise(async (resolve, reject) => {
		if (option.license) {
			// Convert class instances into a normal object and create an array of license IDs
			let licenseIds = [];
			for (let i = 0; i < classes.length; i++) {
				classes[i] = convertToNormalObject(classes[i]);
				licenseIds = licenseIds.concat(classes[i].licenses);
			}
			licenseIds = [...new Set(licenseIds)];
			// Fetch the license instances associated with these classes
			let licenses;
			try {
				licenses = await License.find({ _id: licenseIds });
			} catch (error) {
				return reject({ status: "error", content: error });
			}
			// Fetch details of the license instances
			try {
				licenses = await retrieve.licenses(licenses, option);
			} catch (data) {
				return reject(data);
			}
			// Filter license instances details
			if (option.license.length) {
				licenses = licenses.map((license) => {
					let object = {};
					for (let j = 0; j < option.license.length; j++) {
						object[option.license[j]] = license[option.license[j]];
					}
					return object;
				});
			}
			// Attach the license instances to their respective classes
			for (let k = 0; k < classes.length; k++) {
				for (let l = 0; l < classes[k].licenses.length; l++) {
					classes[k].licenses[l] = licenses.find((license) => license._id.toString() === classes[k].licenses[l].toString());
				}
			}
		}
		// Success handler
		return resolve(classes);
	});
};

retrieve.licenses = (licenses, option) => {
	return new Promise(async (resolve, reject) => {
		if (option.profile) {
			// Convert license instances into a normal object and create an array of profile IDs
			let profileIds = [];
			for (let i = 0; i < licenses.length; i++) {
				licenses[i] = convertToNormalObject(licenses[i]);
				profileIds.push(licenses[i].profile);
			}
			// Fetch the profile instances associated with these licenses
			let profiles;
			try {
				profiles = await Profile.find({ _id: profileIds });
			} catch (error) {
				return reject({ status: "error", content: error });
			}
			// Fetch details of the profile instances
			try {
				profiles = await retrieve.profiles(profiles, option);
			} catch (data) {
				return reject(data);
			}
			// Filter profile instances details
			if (option.profile.length) {
				profiles = profiles.map((profile) => {
					let object = {};
					for (let j = 0; j < option.profile.length; j++) {
						object[option.profile[j]] = profile[option.profile[j]];
					}
					return object;
				});
			}
			// Attach the profile instances to their respective licenses
			for (let k = 0; k < licenses.length; k++) {
				// Fetch the profile associated with this license
				licenses[k].profile = profiles.find((profile) => profile._id.toString() === licenses[k].profile.toString());
			}
		}
		// Success handler
		return resolve(licenses);
	});
};

retrieve.profiles = (profiles, option) => {
	return new Promise(async (resolve, reject) => {
		if (option.account) {
			// Convert profile instances into a normal object and create an array of account IDs
			let accountIds = [];
			for (let i = 0; i < profiles.length; i++) {
				profiles[i] = convertToNormalObject(profiles[i]);
				accountIds.push(profiles[i].account.local);
			}
			// Fetch the account instances associated with these profiles
			let accounts;
			try {
				accounts = await Account.find({ _id: accountIds });
			} catch (error) {
				return reject({ status: "error", content: error });
			}
			// Filter account instances details
			if (option.account.length) {
				accounts = accounts.map((account) => {
					let object = {};
					for (let j = 0; j < option.account.length; j++) {
						object[option.account[j]] = account[option.account[j]];
					}
					return object;
				});
			}
			// Attach the account instances to their respective profiles
			for (let k = 0; k < profiles.length; k++) {
				// Fetch the account associated with this profile
				profiles[k].account = accounts.find((account) => account._id.toString() === profiles[k].account.local.toString());
			}
		}
		// Success handler
		return resolve(profiles);
	});
};

// HELPERS ==================================================

function convertToNormalObject(document) {
	return JSON.parse(JSON.stringify(document));
}

// EXPORT ===================================================

module.exports = retrieve;

// END ======================================================
