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
const general = require("./body/general.js");
const createbase = require("./body/createbase.js");

// VARIABLES ================================================

if (process.env.NODE_ENV !== "production") require("dotenv").config();
let email = {
	execute: undefined,
	construct: undefined,
	send: undefined,
	members: [
		"carlvelasco96@gmail.com",
		"bradyoung109@gmail.com",
		"brydonburnett@gmail.com",
		"craig.vaz1337@gmail.com",
		"louiscflin@gmail.com",
		"todd.lachlan.broadhurst@gmail.com",
		"weiweiwu766@gmail.com",
	],
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
		const greetingMessage = greeting.construct(object);
		const closingMessage = closing.construct(object);
		const footerMessage = footer.construct(object);
		let bodyMessage = object.body;
		let subjectMessage = object.subject;
		if (!bodyMessage) {
			const tagArray = object.receive.split("-");
			object.tag = tagArray[0];
			for (let i = 1; i < tagArray.length; i++) {
				const word = tagArray[i];
				object.tag += word[0].toUpperCase() + word.substring(1);
			}
			switch (object.notification) {
				case "newsletter":
					[subjectMessage, bodyMessage] = newsletter.construct(object);
					break;
				case "onboarding":
					[subjectMessage, bodyMessage] = onboarding.construct(object);
					break;
				case "product":
					[subjectMessage, bodyMessage] = product.construct(object);
					break;
				case "cold":
					[subjectMessage, bodyMessage] = cold.construct(object);
					break;
				case "general":
					[subjectMessage, bodyMessage] = general.construct(object);
					break;
				case "createbase":
					[subjectMessage, bodyMessage] = createbase.construct(object);
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
		// Check if the email is a notification for our members
		const recipient = object.notification === "createbase" ? email.members : object.recipient;
		// Examine
		console.log(`-------------- START --------------`);
		console.log(`Sending an email to: ${recipient}`);
		console.log(`------------- MESSAGE -------------`);
		console.log(message);
		console.log(`--------------- END ---------------`);
		// Create the mail object;
		const mail = {
			from: `"CreateBase" <${process.env.EMAIL_ADDRESS}>`,
			to: recipient,
			subject: process.env.DEPLOYMENT === "production" ? subjectMessage : `[TEST] ${subjectMessage}`,
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
