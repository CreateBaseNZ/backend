/*=========================================================================================
REQUIRED MODULES
=========================================================================================*/

const nodemailer = require("nodemailer");
const inlineCSS = require("inline-css");

/*=========================================================================================
VARIABLES
=========================================================================================*/

if (process.env.NODE_ENV !== "production") require("dotenv").config();
let email = {
	build: undefined,
	create: undefined,
	send: undefined,
	// TEMPLATES
	templateInquiry: undefined,
	templateAccountVerification: undefined,
	templateWelcome: undefined,
	templatePasswordReset: undefined,
	templateOrganisationDetail: undefined,
	templateInviteEducator: undefined,
	templateEducatorJoin: undefined,
	templateEducatorAccept: undefined,
	templateInqNotif: undefined,
	templateNewOrgNotif: undefined,
	templateNewsletterRaw: undefined,
};
const members = [
	"carlvelasco96@gmail.com",
	"bo75salim@hotmail.com",
	"bradyoung109@gmail.com",
	"brydonburnett@gmail.com",
	"craig.vaz1337@gmail.com",
	"louiscflin@gmail.com",
	"todd.lachlan.broadhurst@gmail.com",
	"weiweiwu766@gmail.com",
];

/*=========================================================================================
FUNCTIONS
=========================================================================================*/

/**
 * This function builds the email object
 * @param {Object} object
 */
email.build = (object = {}, teamNotif = false) => {
	// VALIDATE OBJECT

	// CONSTRUCT EMAIL
	// Recipient
	let recipient;
	if (teamNotif) {
		recipient = members;
	} else {
		recipient = object.email;
	}
	// Test
	if (process.env.NODE_ENV !== "production") object.subject = "[TEST]: " + object.subject;
	const mail = {
		from: `"CreateBase" <${process.env.EMAIL_ADDRESS}>`,
		to: `${recipient}`,
		subject: object.subject,
		text: object.text,
		html: object.html,
	};
	// SUCCESS HANDLER
	return mail;
};

email.create = (object = {}, template = "", teamNotif = false) => {
	return new Promise(async (resolve, reject) => {
		// VALIDATE OBJECT
		// BUILD CONTENTS
		let promise;
		switch (template) {
			case "inquiry":
				promise = email.templateInquiry(object);
				break;
			case "account-verification":
				promise = email.templateAccountVerification(object);
				break;
			case "password-reset":
				promise = email.templatePasswordReset(object);
				break;
			case "welcome":
				promise = email.templateWelcome(object);
				break;
			case "organisation-detail":
				promise = email.templateOrganisationDetail(object);
				break;
			case "invite-educator":
				promise = email.templateInviteEducator(object);
				break;
			case "educator-join":
				promise = email.templateEducatorJoin(object);
				break;
			case "inq-notif":
				promise = email.templateInqNotif(object);
				break;
			case "new-org-notif":
				promise = email.templateNewOrgNotif(object);
				break;
			case "newsletter-raw":
				promise = email.templateNewsletterRaw(object);
				break;
			default:
				return reject({ status: "error", content: "no template is provided" });
		}
		let contents;
		try {
			contents = await promise;
		} catch (data) {
			return reject(data);
		}
		// Test
		if (process.env.NODE_ENV !== "production") contents.subject = "[TEST]: " + contents.subject;
		// CONSTRUCT EMAIL
		const mail = {
			from: `"CreateBase" <${process.env.EMAIL_ADDRESS}>`,
			to: `${teamNotif ? members : object.email}`,
			subject: contents.subject,
			text: contents.text,
			html: contents.html,
		};
		// SUCCESS HANDLER
		return resolve(mail);
	});
};

email.send = (object = {}) => {
	return new Promise(async (resolve, reject) => {
		// VALIDATE OBJECT

		// CONFIGURE TRANSPORT OPTIONS
		const transportOptions = {
			host: process.env.AWS_SMTP_HOST,
			port: process.env.AWS_SMTP_PORT,
			secure: true,
			auth: {
				user: process.env.AWS_SMTP_USERNAME,
				pass: process.env.AWS_SMTP_PASSWORD,
			},
		};
		// CREATE TRANSPORT
		const transporter = nodemailer.createTransport(transportOptions);
		// SEND THE MAIL
		try {
			await transporter.sendMail(object);
		} catch (error) {
			return reject({ status: "error", content: error });
		}
		// SUCCESS HANDLER
		return resolve();
	});
};

/* ----------------------------------------------------------------------------------------
TEMPLATES
---------------------------------------------------------------------------------------- */

email.templateInquiry = (object) => {
	return new Promise(async (resolve, reject) => {
		// SET THE EMAIL SUBJECT
		const subject = `Thank you for your inquiry (#${object.number}).`;
		// BUILD THE EMAIL BODY
		const text = `
Hi ${object.name},


Thank you for the message, we will get back to you as soon as possible!


Best regards,

The CreateBase Team


Join our community and receive quick responses and feedback to your questions

 - Facebook Community - https://www.facebook.com/groups/createbaseteacherscommunity`;
		// Return the email object
		return resolve({ subject, text });
	});
};

email.templateAccountVerification = (object) => {
	return new Promise(async (resolve, reject) => {
		// SET THE EMAIL SUBJECT
		const subject = `Your Verification Code: ${object.code}`;
		// BUILD THE EMAIL BODY
		const text = `
Hi ${object.displayName},


Your account verification code is: ${object.code}

Log into your CreateBase account and enter this code - ${process.env.APP_PREFIX}/auth/login


Best regards,

The CreateBase Team`;
		// Return the email object
		return resolve({ subject, text });
	});
};

email.templateWelcome = (object = {}) => {
	return new Promise(async (resolve, reject) => {
		// Set the subject of the email
		const subject = `Welcome to CreateBase ${object.displayName}!`;
		// Set the email body
		const text = `
Hi ${object.displayName},


Here is your first quest!

School accounts are a key part of the CreateBase platform that we call Organisation accounts. To teach with the platform you are required to be associated with an organisation account.

Create an or join an existing organisation - ${process.env.APP_PREFIX}/user/my-account

To create an account you will need:
	- The ID of your school
	- The name of your school
You can find these information here - https://www.educationcounts.govt.nz/directories/list-of-nz-schools

If your school already exists on the CreateBase platform, you will need to join it using the code emailed to the teacher who registered your organisation on our platform.


Best regards,

The CreateBase Team


Join our community and receive quick responses and feedback to your questions

 - Facebook Community - https://www.facebook.com/groups/createbaseteacherscommunity`;
		// Return the email object
		return resolve({ subject, text });
	});
};

email.templatePasswordReset = (object) => {
	return new Promise(async (resolve, reject) => {
		// SET THE EMAIL SUBJECT
		const subject = `Your Password Reset Code: ${object.code}`;
		// BUILD THE EMAIL BODY
		const text = `
Hi ${object.displayName},


Click the link below to change your password.

${process.env.APP_PREFIX}/auth/forgot-password/${object.email}/${object.code}


Best regards,

The CreateBase Team`;
		// Return the email object
		return resolve({ subject, text });
	});
};

email.templateOrganisationDetail = (object = {}) => {
	return new Promise(async (resolve, reject) => {
		// SET THE EMAIL SUBJECT
		const subject = `Hooray! Your organisation, ${object.orgName}, is now registered on the CreateBase platform.`;
		// BUILD THE EMAIL BODY
		const text = `
Hi ${object.displayName},


Congratulations! Your organisation is now established on our platform. Each school only has one organisation account and you have all the codes. This is important info so make sure you note the organisation information below, as it's needed to add teachers and students to your organisation.

Organisation information:
 - Organisation ID: ${object.orgId}
 - Organisation Name: ${object.orgName}
 - Code for Educators: ${object.eduCode}
 - Code for Learners: ${object.lerCode}

Invite other teachers using your educator code: ${object.eduCode}


Best regards,

The CreateBase Team


Join our community and receive quick responses and feedback to your questions

 - Facebook Community - https://www.facebook.com/groups/createbaseteacherscommunity`;
		// Return the email object
		return resolve({ subject, text });
	});
};

email.templateInviteEducator = (object = {}) => {
	return new Promise(async (resolve, reject) => {
		// SET THE EMAIL SUBJECT
		const subject = `${object.sender} invited you to join ${object.orgName} on the CreateBase platform!`;
		// BUILD THE EMAIL BODY
		const text = `
Hi ${object.recipient},


${object.sender} invited you to join ${object.orgName} on the CreateBase platform!

Follow the link below to join!

${process.env.APP_PREFIX}/invite/educator/${object.url}


Best regards,

The CreateBase Team


Join our community and receive quick responses and feedback to your questions

 - Facebook Community - https://www.facebook.com/groups/createbaseteacherscommunity`;
		// Return the email object
		return resolve({ subject, text });
	});
};

email.templateEducatorJoin = (object = {}) => {
	return new Promise(async (resolve, reject) => {
		// SET THE EMAIL SUBJECT
		const subject = `${object.sender} is requesting to join you at ${object.orgName}`;
		// BUILD THE EMAIL BODY
		const text = `
Hi ${object.recipient},


${object.sender} requested to join you and your team at ${object.orgName}!

Follow the link below to accept their request to join!

${process.env.APP_PREFIX}/invite/educator/${object.url}


Best regards,

The CreateBase Team


Join our community and receive quick responses and feedback to your questions

 - Facebook Community - https://www.facebook.com/groups/createbaseteacherscommunity`;
		// Return the email object
		return resolve({ subject, text });
	});
};

email.templateEducatorAccept = (object = {}) => {
	return new Promise(async (resolve, reject) => {
		// SET THE EMAIL SUBJECT
		const subject = `You are now a part of ${object.orgName}`;
		// BUILD THE EMAIL BODY
		const text = `
Hi ${object.recipient},


Amazing news! You are now a part of ${object.orgName}!


Best regards,

The CreateBase Team


Join our community and receive quick responses and feedback to your questions

 - Facebook Community - https://www.facebook.com/groups/createbaseteacherscommunity`;
		// Return the email object
		return resolve({ subject, text });
	});
};

email.templateInqNotif = (object = {}) => {
	return new Promise(async (resolve, reject) => {
		// SET THE EMAIL SUBJECT
		const subject = `New inquiry from ${object.name}`;
		// BUILD THE EMAIL BODY
		const text = `
Hey team,


We have a new inquiry from ${object.name} (${object.userEmail}).

"${object.subject}

${object.message}"


Kind Regards,

The CreateBase Team`;
		// Success handler
		return resolve({ subject, text });
	});
};

email.templateNewOrgNotif = (object = {}) => {
	return new Promise(async (resolve, reject) => {
		// SET THE EMAIL SUBJECT
		const subject = `${object.orgName} just joined CreateBase!`;
		// BUILD THE EMAIL BODY
		const text = `
Hey team,


${object.displayName} from ${object.orgName} just registered their organisation on our platform!

Amazing job team! Looking forward to more amazing news!


Best regards,

The CreateBase Team`;
		// Success handler
		return resolve({ subject, text });
	});
};

email.templateNewsletterRaw = (object = {}) => {
	return new Promise(async (resolve, reject) => {
		// SET THE EMAIL SUBJECT
		const subject = object.subject;
		// BUILD THE EMAIL BODY
		const text = object.text;
		const html = object.html;
		// Return the email object
		return resolve({ subject, text, html });
	});
};

/*=========================================================================================
EXPORT
=========================================================================================*/

module.exports = email;

/*=========================================================================================
END
=========================================================================================*/
