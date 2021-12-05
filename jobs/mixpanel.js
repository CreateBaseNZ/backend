// MODULES ==================================================

const moment = require("moment-timezone");
const axios = require("axios");

// VARIABLES ================================================

if (process.env.NODE_ENV !== "production") require("dotenv").config();

// MODELS ===================================================

const Account = require("../model/Account.js");
const Class = require("../model/Class.js");
const Data = require("../model/Data.js");
const Group = require("../model/Group.js");
const Job = require("../model/Job.js");
const License = require("../model/License.js");
const Mail = require("../model/Mail.js");
const Profile = require("../model/Profile.js");

// EXPORT ===================================================

module.exports = function (agenda) {
	agenda.define("update-data", async (job, done) => {
		// Fetch the data document
		let data;
		try {
			data = (await Data.find())[0];
		} catch (error) {
			console.log(error);
			return;
		}
		if (!data) {
			data = new Data({ project: process.env.MIXPANEL_PROJECT });
		}
		console.log(data);
		// Fetch the data from Mixpanel
		let rawData;
		try {
			rawData = (
				await axios.get(`https://data.mixpanel.com/api/2.0/export?from_date=2021-01-01&to_date=${moment().tz("Pacific/Auckland").format("YYYY-MM-DD")}`, {
					headers: { Authorization: process.env.MIXPANEL_PROJECT_SECRET, Accept: "text/plain" },
				})
			)["data"];
		} catch (error) {
			console.log(error);
			return;
		}
		// Update content
		data.content = rawData;
		data.date = new Date().toString();
		console.log(data);
		try {
			await data.save();
		} catch (error) {
			return;
		}
		// Success handler
		return done();
	});
};

// FUNCTIONS ================================================

// END ======================================================
