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
	alias: {
		carl: '"Carl Velasco" <carl@createbase.co.nz>',
		brad: '"Bradley Young" <brad@createbase.co.nz>',
		brydon: `"Brydon Burnett" <brydon@createbase.co.nz>`,
		craig: `"Craig Vaz" <craig@createbase.co.nz>`,
		louis: `"Louis Lin" <louis@createbase.co.nz>`,
		todd: `"Todd Broadhurst" <todd@createbase.co.nz>`,
		weiwei: `"Weiwei Wu" <weiwei@createbase.co.nz>`,
		admin: `"CreateBase" <admin@createbase.co.nz>`,
	},
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
		// Create the mail object;
		const mail = {
			from: object.alias ? (email.alias[object.alias.toLowerCase()] ? email.alias[object.alias.toLowerCase()] : email.alias["admin"]) : email.alias["admin"],
			to: object.notification === "createbase" ? "internal@createbase.co.nz" : object.recipient,
			subject: process.env.DEPLOYMENT === "production" ? subjectMessage : `[TEST] ${subjectMessage}`,
			text: convert(message),
			html: message.replace(/(\r\n|\n|\r)/gm, "<br>"),
			attachments: object.attachments
				? object.attachments.map((attachment) => {
						[filename, path] = attachment.split("+").map((element) => element.trim());
						return { filename, path };
				  })
				: undefined,
		};
		// Examine
		// console.log(`-------------- START --------------`);
		// console.log(mail);
		// console.log(`--------------- END ---------------`);
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
