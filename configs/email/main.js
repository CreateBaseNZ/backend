// MODULES ==================================================

const nodemailer = require("nodemailer");
const { convert } = require("html-to-text");

const greeting = require("./greeting.js");
const closing = require("./closing.js");
const footer = require("./footer.js");
const newsletter = require("./body/newsletter.js");
const onboarding = require("./body/onboarding.js");
const product = require("./body/product.js");
const cold = require("./body/cold.js");

// VARIABLES ================================================

if (process.env.NODE_ENV !== "production") require("dotenv").config();
let email = {
	execute: undefined,
	construct: undefined,
	send: undefined,
};

// FUNCTIONS ================================================

email.execute = function (object = {}) {
	return new Promise(async (resolve, reject) => {
		// Create the mail object
		let mail;
		try {
			mail = await email.construct(object);
		} catch (data) {
			return reject(data);
		}
		// Send the email
		try {
			await email.send(mail);
		} catch (data) {
			return reject(data);
		}
		// Success handler
		return resolve();
	});
};

email.construct = function (object = {}) {
	return new Promise(async (resolve, reject) => {
		let greetingMessage;
		try {
			greetingMessage = await greeting.construct(object);
		} catch (data) {
			return reject(data);
		}
		let closingMessage;
		try {
			closingMessage = await closing.construct(object);
		} catch (data) {
			return reject(data);
		}
		let footerMessage;
		try {
			footerMessage = await footer.construct(object);
		} catch (data) {
			return reject(data);
		}
		let bodyMessage = object.body;
		if (!bodyMessage) {
			switch (object.notification) {
				case "newsletter":
					try {
						bodyMessage = await newsletter.construct(object);
					} catch (data) {
						return reject(data);
					}
					break;
				case "onboarding":
					try {
						bodyMessage = await onboarding.construct(object);
					} catch (data) {
						return reject(data);
					}
					break;
				case "product":
					try {
						bodyMessage = await product.construct(object);
					} catch (data) {
						return reject(data);
					}
					break;
				case "cold":
					try {
						bodyMessage = await cold.construct(object);
					} catch (data) {
						return reject(data);
					}
					break;
				default:
					return reject({ status: "failed", content: "invalid option" });
			}
		}
		const message = `${greetingMessage}
    
    
    ${bodyMessage}
    
    
    ${closingMessage}
    
    
    ${footerMessage}`;
		const text = convert(message);
		const html = message.replace(/(\r\n|\n|\r)/gm, "<br>");
		// Create the mail object;
		const mail = {
			from: `"CreateBase" <${process.env.EMAIL_ADDRESS}>`,
			to: object.recipient,
			subject: object.subject,
			text: text,
			html: html,
		};
		// Success handler
		return resolve(mail);
	});
};

email.send = function (object = {}) {
	return new Promise(async (resolve, reject) => {
		// TODO: Validate inputs
		// Configure the transport's options
		const options = {
			host: process.env.AWS_SMTP_HOST,
			port: process.env.AWS_SMTP_PORT,
			secure: true,
			auth: {
				user: process.env.AWS_SMTP_USERNAME,
				pass: process.env.AWS_SMTP_PASSWORD,
			},
		};
		// Create the transporter
		const transporter = nodemailer.createTransport(options);
		// Send the email
		try {
			await transporter.sendMail(object);
		} catch (error) {
			return reject({ status: "error", content: error });
		}
		// Success handler
		return resolve();
	});
};

// EXPORT ===================================================

module.exports = email;

// END ======================================================
