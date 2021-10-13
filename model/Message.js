/*=========================================================================================
REQUIRED MODULES
=========================================================================================*/

const mongoose = require("mongoose");
const moment = require("moment-timezone");

/*=========================================================================================
VARIABLES
=========================================================================================*/

const Schema = mongoose.Schema;
const email = require("../configs/email/main.js");

/*=========================================================================================
CREATE MODEL
=========================================================================================*/

const MessageSchema = new Schema({
	type: { type: String, default: "" },
	name: { type: String, default: "" },
	email: { type: String, default: "" },
	subject: { type: String, default: "" },
	message: { type: String, default: "" },
	number: {
		inquiry: { type: Number, default: 0 },
	},
	date: {
		created: { type: String, default: "" },
		modified: { type: String, default: "" },
	},
});

/*=========================================================================================
MIDDLEWARE
=========================================================================================*/

MessageSchema.pre("save", async function (next) {
	// DECLARE AND INITIALISE VARIABLES
	const date = moment().tz("Pacific/Auckland").format();
	// UPDATE
	if (this.isNew) this.date.created = date;
	if (this.isModified()) this.date.modified = date;
	// SUCCESS HANDLER
	return next();
});

/*=========================================================================================
STATIC
=========================================================================================*/

// @FUNC  build
// @TYPE  STATICS - PROMISE - ASYNC
// @DESC
MessageSchema.statics.build = function (object = {}, save = true) {
	return new Promise(async (resolve, reject) => {
		// VALIDATION
		if (object.type === "inquiry") {
			try {
				await this.validateInquiry(object);
			} catch (data) {
				return reject(data);
			}
		}
		// CREATE OBJECT
		let message = new this(object);
		// PROCESSING
		if (save) {
			try {
				message = await message.save();
			} catch (error) {
				return reject({ status: "error", content: error });
			}
		}
		// SUCCESS HANDLER
		return resolve(message);
	});
};

// @FUNC  validateInquiry
// @TYPE  STATICS - PROMISE - ASYNC
// @DESC
MessageSchema.statics.validateInquiry = function (object = {}) {
	return new Promise(async (resolve, reject) => {
		// VALIDATE NAME
		let nameRE = /^[A-Za-z0-9_-\s]+$/;
		if (!object.name) {
			return reject({ status: "failed", content: "Name is required" });
		} else if (!nameRE.test(String(object.name).toLowerCase())) {
			return reject({ status: "failed", content: "Invalid name" });
		}
		// VALIDATE EMAIL
		let emailRE = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if (!object.email) {
			return reject({ status: "failed", content: "Email is required" });
		} else if (!emailRE.test(String(object.email).toLowerCase())) {
			return reject({ status: "failed", content: "Invalid email" });
		}
		// VALIDATE SUBJECT
		if (!object.subject) {
			return reject({ status: "failed", content: "Subject is required" });
		} else if (object.subject.includes('"')) {
			return reject({ status: "failed", content: "Subject cannot contain double quotation marks" });
		}
		// VALIDATE MESSAGE
		if (!object.message) {
			return reject({ status: "failed", content: "Message is required" });
		} else if (object.message.includes('"')) {
			return reject({ status: "failed", content: "Message cannot contain double quotation marks" });
		}
		// SUCCESS HANDLER
		return resolve();
	});
};

/*=========================================================================================
METHODS
=========================================================================================*/

// @FUNC  sendInquiryEmailNotification
// @TYPE  STATICS - PROMISE - ASYNC
// @DESC
MessageSchema.methods.sendInquiryEmailNotification = function () {
	return new Promise(async (resolve, reject) => {
		// Create the email object
		const options1 = {
			recipient: this.email,
			name: this.name,
			receive: "inquiry",
			notification: "general",
			tone: "formal",
			site: true,
			help: true,
			social: true,
			number: this.number.inquiry,
		};
		try {
			await email.execute(options1);
		} catch (data) {
			return reject(data);
		}
		// Notify CreateBase of the new inquiry
		const options2 = {
			name: "team",
			receive: "inq-notif",
			notification: "createbase",
			tone: "friendly",
			userName: this.name,
			userEmail: this.email,
			subject: this.subject,
			message: this.message,
		};
		try {
			await email.execute(options2);
		} catch (data) {
			return reject(data);
		}
		// SUCCESS HANDLER
		return resolve();
	});
};

/*=========================================================================================
EXPORT MAKE MODEL
=========================================================================================*/

module.exports = Message = mongoose.model("message", MessageSchema);

/*=========================================================================================
END
=========================================================================================*/
