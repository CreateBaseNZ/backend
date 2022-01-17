// MODULES ==================================================

// VARIABLES ================================================

// MODELS ===================================================

const Account = require("../model/Account.js");
const Class = require("../model/Class.js");
const Group = require("../model/Group.js");
const GoogleAccount = require("../model/GoogleAccount.js");
const Job = require("../model/Job.js");
const License = require("../model/License.js");
const Mail = require("../model/Mail.js");
const Profile = require("../model/Profile.js");

// EXPORT ===================================================

module.exports = function (agenda) {
	agenda.define("email", async (job) => {
		let option = job.attrs.data.option;
		const user = job.attrs.data.user ? job.attrs.data.user : {};
		// Check if an email is provided
		if (!option.recipient && option.notification !== "createbase") {
			let promise;
			if (user.provider === "credentials") {
				promise = Account.findOne({ _id: user.accountId });
			} else if (user.provider === "google") {
				promise = GoogleAccount.findOne({ googleId: user.accountId });
			}
			let account;
			try {
				account = await promise;
			} catch (error) {
				return;
			}
			if (!account) return;
			option.recipient = account.email;
		}
		// Check if the recipients name is provided
		if (!option.name && user.accountId) {
			let promise;
			if (user.provider === "credentials") {
				promise = Profile.findOne({ "account.local": user.accountId });
			} else if (user.provider === "google") {
				promise = Profile.findOne({ "account.google": user.accountId });
			}
			let profile;
			try {
				profile = await promise;
			} catch (error) {
				return;
			}
			if (!profile) return;
			option.name = profile.name.first;
		}
		// Send the email
		try {
			await Mail.sendEmail(option);
		} catch (data) {
			console.log(data);
			return;
		}
		// Terminate
		return;
	});
};

// FUNCTIONS ================================================

// END ======================================================
