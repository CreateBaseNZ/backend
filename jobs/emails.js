// MODULES ==================================================

const email = require("../configs/email/main.js");

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
	agenda.define("cold-email", async (job) => {
		const option = job.attrs.data.option;
		const follows = job.attrs.data.follows;
		// Fetch the mail document associated with this email
		let mail;
		try {
			mail = await Mail.findOne({
				email: option.recipient,
				"notification.cold": true,
			});
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
	});
};

// FUNCTIONS ================================================

// END ======================================================
