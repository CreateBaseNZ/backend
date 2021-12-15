// MODULES ==================================================

const mongoose = require("mongoose");

// VARIABLES ================================================

if (process.env.NODE_ENV !== "production") require("dotenv").config();
const Schema = mongoose.Schema;
const email = require("../configs/email/main.js");
const notification = {
	personal: ["newsletter", "onboarding", "product", "cold"],
	general: ["general", "createbase"],
};

// MODEL ====================================================

const MailSchema = new Schema({
	email: { type: Schema.Types.String, default: "" },
	account: { type: Schema.Types.ObjectId },
	received: { type: [Schema.Types.Mixed], default: new Array() },
	notification: {
		newsletter: { type: Schema.Types.Boolean, default: false },
		onboarding: { type: Schema.Types.Boolean, default: false },
		product: { type: Schema.Types.Boolean, default: false },
		cold: { type: Schema.Types.Boolean, default: false },
	},
	scheduled: { type: [Schema.Types.String], default: new Array() },
	metadata: { type: Schema.Types.Mixed, default: { init: "" } },
});

// STATICS ==================================================

MailSchema.statics.sendEmail = function (object = {}) {
	return new Promise(async (resolve, reject) => {
		// Send the email
		if (notification.personal.indexOf(object.notification) !== -1) {
			// Fetch the mail instance
			let mail;
			try {
				mail = await this.findOne({ email: object.recipient.toLowerCase() });
			} catch (error) {
				return reject({ status: "error", content: error });
			}
			// Send the email
			try {
				await mail.sendEmail(object);
			} catch (data) {
				return reject(data);
			}
			// Save the mail instance
			try {
				await mail.save();
			} catch (error) {
				return reject({ status: "error", content: error });
			}
		} else if (notification.general.indexOf(object.notification) !== -1) {
			try {
				await email.execute(object);
			} catch (data) {
				return reject(data);
			}
		}
		// Success handler
		return resolve();
	});
};

// METHODS ==================================================

MailSchema.methods.sendEmail = function (object = {}) {
	return new Promise(async (resolve, reject) => {
		if (this.notification[object.notification] === undefined) {
			return reject({ status: "failed", content: "invalid option" });
		}
		if (this.notification[object.notification] === false) {
			return resolve("not subscribed");
		}
		const receive = {
			tag: `${object.notification}-${object.receive}`,
			date: new Date().toString(),
		};
		if (this.received.map((element) => element.tag).indexOf(receive.tag) !== -1) {
			return resolve("already sent");
		}
		if (!object.name) object.name = this.metadata ? this.metadata.name : undefined;
		try {
			await email.execute(object);
		} catch (data) {
			return reject(data);
		}
		this.received.push(receive);
		return resolve("sent");
	});
};

// EXPORT ===================================================

module.exports = Mail = mongoose.model("mail", MailSchema);

// END ======================================================
