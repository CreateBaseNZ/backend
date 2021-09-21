/*=========================================================================================
REQUIRED MODULES
=========================================================================================*/

const mongoose = require("mongoose");
const moment = require("moment-timezone");

/*=========================================================================================
VARIABLES
=========================================================================================*/

if (process.env.NODE_ENV !== "production") require("dotenv").config();
const Schema = mongoose.Schema;
const email = require("../configs/email.js");

/*=========================================================================================
CREATE MAILING MODEL
=========================================================================================*/

const MailSchema = new Schema({
	email: { type: Schema.Types.String, required: true },
	account: { type: Schema.Types.ObjectId },
	received: { type: [Schema.Types.String], default: ["new-subscriber"] },
	notification: {
		newsletter: { type: Schema.Types.Boolean, default: false },
		onboarding: { type: Schema.Types.Boolean, default: false },
	},
});

/*=========================================================================================
STATIC
=========================================================================================*/

// @FUNC  build
// @TYPE  STATICS
// @DESC
MailSchema.statics.build = function (object = {}, save = true) {
	return new Promise(async (resolve, reject) => {
		// EMAIL VALIDATION
		try {
			await this.validateEmail(object.email);
		} catch (data) {
			return reject(data);
		}
		// SUBSCRIPTION
		let mail;
		try {
			mail = await this.findOne(object);
		} catch (error) {
			return reject({ status: "error", content: error });
		}
		// CHECK IF EMAIL IS ALREADY SUBSCRIBED
		if (mail) return reject({ status: "succeeded", content: "already" });
		// SETUP OR CREATE MAIL INSTANCE
		mail = new this(object);
		// SAVE MAIL INSTANCE
		if (save) {
			try {
				await mail.save();
			} catch (error) {
				return reject(error);
			}
		}
		// RETURN PROMISE RESPONSE
		return resolve(mail);
	});
};

/**
 * Deletes the email from the mailing list
 * @param {Object} object
 */
MailSchema.statics.demolish = function (object = {}) {
	return new Promise(async (resolve, reject) => {
		// Validate email
		try {
			await this.validateEmail(object.email);
		} catch (data) {
			return reject(data);
		}
		// Fetch Mail
		let mail;
		try {
			mail = await this.findOne(object);
		} catch (error) {
			return reject({ status: "error", content: error });
		}
		// Validate if Mail exist
		if (!mail) return resolve({ status: "succeeded", content: "You have already unsubscribed" });
		// Delete Mail
		try {
			await mail.deleteOne();
		} catch (error) {
			return reject({ status: "error", content: error });
		}
		// Resolve the Promise
		return resolve();
	});
};

MailSchema.statics.subscribe = function (object = {}) {
	return new Promise(async (resolve, reject) => {
		// Check if email is already subscribed
		let mail;
		try {
			mail = await this.findOne({ email: object.email });
		} catch (error) {
			return reject({ status: "error", content: error });
		}
		// Check if an account is inputted
		if (mail) {
			if (object.owner && (!mail.owner || mail.owner != object.owner)) {
				mail.owner = object.owner;
				// Save update
				try {
					await mail.save();
				} catch (error) {
					return reject({ status: "error", content: error });
				}
			}
			return reject({ status: "failed", content: "You are already subscribed" });
		}
		// If the mail doesn't exist build it
		try {
			await this.build(object);
		} catch (data) {
			return reject(data);
		}
		// Send an email to the new subscriber
		if (!object.owner) {
			const body = this.buildNewSubscriberEmail(object);
			const subject = "Thank you for signing up for our newsletter!";
			let emailObject;
			try {
				emailObject = await email.create({ subject, body, email: object.email }, "email-newsletter");
			} catch (data) {
				return reject(data);
			}
			try {
				await email.send(emailObject);
			} catch (data) {
				return reject(data);
			}
		}
		// Return success
		return resolve();
	});
};

// @FUNC  validateEmail
// @TYPE  STATICS - PROMISE - ASYNC
// @DESC  Validates an email input
MailSchema.statics.validateEmail = function (email) {
	return new Promise(async (resolve, reject) => {
		// Email REGEX
		let emailRE = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		// VALIDATIONS
		if (!email) {
			return reject({ status: "failed", content: "Please enter your email address" });
		} else if (!emailRE.test(String(email).toLowerCase())) {
			return reject({ status: "failed", content: "Please enter your email address in format: yourname@example.com" });
		}
		return resolve();
	});
};

MailSchema.statics.buildNewSubscriberEmail = function () {
	return `Hi there!


<b>Welcome to CreateBase</b>! We are excited to have you be a part of our journey! We will celebrate with you whenever we
<ul><li>release <b>new features</b>,</li><li>release <b>new projects</b>, and</li><li>achieve <b>new milestones</b>.</li></ul>We will also let you know when we are running <b>events</b> and <b>promotions</b>!


Are you a teacher? <b><a href='https://app.createbase.co.nz/auth/signup'>Sign up for a FREE account</a></b> and try out our platform! We have some fun projects for you and your students:
<ul><li><b>MagneBot</b> - control a robotic arm using flow-based programming to clean up items of rubbish,</li><li><b>Send It</b> - automate a jumping game by creating a simple artificial intelligence (AI).</li><li><b>Line Following</b> (<i>coming soon</i>) - write an algorithm to control a line following robot in a warehouse; enabling it to find and put out fires.</li></ul>Even if you are not a teacher, you can still try our fun and challenging projects! Head over to https://app.createbase.co.nz/ and continue as a guest.

Want to know more about CreateBase? Head over to https://createbase.co.nz/ or check out any of our social media.


We are aiming to inspire the next generation of creators, and we need your help! Share our story with schools, teachers and students, and together we will build the future of education!`;
};

/*=========================================================================================
EXPORT MAIL MODEL
=========================================================================================*/

module.exports = Mail = mongoose.model("mail", MailSchema);

/*=========================================================================================
END
=========================================================================================*/
