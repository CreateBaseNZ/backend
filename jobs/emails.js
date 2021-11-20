// MODULES ==================================================

// VARIABLES ================================================

// MODELS ===================================================

const Account = require("../model/Account.js");
const Class = require("../model/Class.js");
const Group = require("../model/Group.js");
const Job = require("../model/Job.js");
const License = require("../model/License.js");
const Mail = require("../model/Mail.js");
const Profile = require("../model/Profile.js");

// EXPORT ===================================================

module.exports = function (agenda) {
	agenda.define("email", async (job) => {
		let option = job.attrs.data.option;
		const accountId = job.attrs.data.accountId;
		// Check if an email is provided
		if (!option.recipient) {
			let account;
			try {
				account = await Account.findOne({ _id: accountId });
			} catch (error) {
				return;
			}
			if (!account) return;
			option.recipient = account.email;
		}
		// Check if the recipients name is provided
		if (!option.name && accountId) {
			let profile;
			try {
				profile = await Profile.findOne({ "account.local": accountId });
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
			return;
		}
		// Terminate
		return;
	});
	agenda.define("cold-email", async (job) => {
		const option = job.attrs.data.option;
		const follows = job.attrs.data.follows;
		// Fetch the mail document associated with this email
		let mail;
		try {
			mail = await Mail.findOne({ email: option.recipient, "notification.cold": true });
		} catch (error) {
			return;
		}
		if (!mail) return;
		// Send the email
		try {
			await mail.sendEmail(option);
		} catch (error) {
			return;
		}
		// Save the mail object
		try {
			await mail.save();
		} catch (error) {
			return;
		}
		// Schedule future cold emails
		if (follows) {
			for (let i = 0; i < follows.length; i++) {
				const follow = follows[i];
				agenda.schedule(follow.date, "cold-email", follow.data);
			}
		}
		// Terminate
		return;
	});
};

// FUNCTIONS ================================================

// END ======================================================
