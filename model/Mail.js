// MODULES ==================================================

const mongoose = require("mongoose");
const moment = require("moment-timezone");

// VARIABLES ================================================

if (process.env.NODE_ENV !== "production") require("dotenv").config();
const Schema = mongoose.Schema;
const email = require("../configs/email/main.js");

// MODEL ====================================================

const MailSchema = new Schema({
	email: { type: Schema.Types.String, required: true },
	account: { type: Schema.Types.ObjectId },
	received: { type: [Schema.Types.String], default: new Array() },
	notification: {
		newsletter: { type: Schema.Types.Boolean, default: false },
		onboarding: { type: Schema.Types.Boolean, default: false },
		product: { type: Schema.Types.Boolean, default: false },
		cold: { type: Schema.Types.Boolean, default: false },
	},
	metadata: { type: Schema.Types.Mixed, default: new Object() },
});

// STATICS ==================================================

// METHODS ==================================================

MailSchema.methods.sendEmail = function (object = {}) {
	return new Promise(async (resolve, reject) => {
		if (this.notification[object.notification] === undefined) {
			return reject({ status: "failed", content: "invalid option" });
		}
		if (this.notification[object.notification] === false) {
			return resolve("not subscribed");
		}
		const receive = `${object.notification}-${object.receive}`;
		if (this.received.indexOf(receive) !== -1) {
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
