/*=========================================================================================
REQUIRED MODULES
=========================================================================================*/

const mongoose = require("mongoose");
const moment = require("moment-timezone");

/*=========================================================================================
VARIABLES
=========================================================================================*/

const Schema = mongoose.Schema;
const email = require("../configs/email.js");

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
		let mail1;
		try {
			mail1 = await email.create({ email: this.email, number: this.number.inquiry, name: this.name }, "inquiry");
		} catch (data) {
			return reject(data);
		}
		// SEND EMAIL
		try {
			await email.send(mail1);
		} catch (data) {
			return reject(data);
		}
		// Process: Notify CreateBase of the new inquiry
		// Build the email object
		const emailObject = { name: this.name, userEmail: this.email, subject: this.subject, message: this.message };
		// Create the email object
		let mail2;
		try {
			mail2 = await email.create(emailObject, "inq-notif", true);
		} catch (data) {
			return reject(data);
		}
		// Send the verification email
		try {
			await email.send(mail2);
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
