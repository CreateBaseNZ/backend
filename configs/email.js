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
	footer: undefined,
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
	templateRaw: undefined,
};
const members = ["carlvelasco96@gmail.com"];

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
			case "educator-accept":
				promise = email.templateEducatorAccept(object);
				break;
			case "inq-notif":
				promise = email.templateInqNotif(object);
				break;
			case "new-org-notif":
				promise = email.templateNewOrgNotif(object);
				break;
			case "email-raw":
				promise = email.templateRaw(object);
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

email.footer = `Best regards,

The CreateBase Team


<i>Visit our <b><a href='https://createbase.co.nz/'>website</a></b> and our <b><a href='https://app.createbase.co.nz/'>application</a></b>.

Join our exclusive <b><a href='https://www.facebook.com/groups/createbaseteacherscommunity'>Facebook group</a></b> for teachers and receive quick responses to your questions.

Follow our social media and stay up-to-date with the latest news: <b><a href='https://www.facebook.com/CreateBaseNZ'>Facebook</a></b>, <b><a href='https://twitter.com/CreateBaseNZ'>Twitter</a></b>, <b><a href='https://www.instagram.com/createbasenz/'>Instagram</a></b> and <b><a href='https://www.youtube.com/channel/UClLBwFvHpGrRpxyRg1IOB0g'>YouTube</a></b>.</i>`;

/* ----------------------------------------------------------------------------------------
TEMPLATES
---------------------------------------------------------------------------------------- */

email.templateInquiry = (object) => {
	return new Promise(async (resolve, reject) => {
		// SET THE EMAIL SUBJECT
		const subject = `Thank you for your inquiry (#${object.number}).`;
		// BUILD THE EMAIL BODY
		const body = `Hi ${object.name},


Thank you for the message, we will get back to you as soon as possible!


${email.footer}`;
		// Build the elements of the email
		const text = body;
		const html = body.replace(/(\r\n|\n|\r)/gm, "<br>");
		// Return the elements of the email
		return resolve({ subject, text, html });
	});
};

email.templateAccountVerification = (object) => {
	return new Promise(async (resolve, reject) => {
		// SET THE EMAIL SUBJECT
		const subject = `Your Verification Code: ${object.code}`;
		// BUILD THE EMAIL BODY
		const body = `Hi ${object.displayName},


Your account verification code is: ${object.code}

<b><a href='${process.env.APP_PREFIX}/auth/login'>Log into your CreateBase account</a></b> and enter this code!


${email.footer}`;
		// Build the elements of the email
		const text = body;
		const html = body.replace(/(\r\n|\n|\r)/gm, "<br>");
		// Return the elements of the email
		return resolve({ subject, text, html });
	});
};

email.templateWelcome = (object = {}) => {
	return new Promise(async (resolve, reject) => {
		// Set the subject of the email
		const subject = `Welcome to CreateBase ${object.displayName}!`;
		// Set the email body
		const body = `
Hi ${object.displayName},


Here is your first quest!

School accounts are a key part of the CreateBase platform that we call Organisation accounts. To teach with the platform you are required to be associated with an organisation account.

<b><a href='${process.env.APP_PREFIX}/user/my-account'>Create or join</a></b> an existing organisation.

To create an account you will need:
	- The ID of your school
	- The name of your school
You can find these information <b><a href='https://www.educationcounts.govt.nz/directories/list-of-nz-schools'>here</a></b>.

If your school already exists on the CreateBase platform, you will need to join it using the code emailed to the teacher who registered your organisation on our platform.


${email.footer}`;
		// Build the elements of the email
		const text = body;
		const html = body.replace(/(\r\n|\n|\r)/gm, "<br>");
		// Return the elements of the email
		return resolve({ subject, text, html });
	});
};

email.templatePasswordReset = (object) => {
	return new Promise(async (resolve, reject) => {
		// SET THE EMAIL SUBJECT
		const subject = `Your Password Reset Code: ${object.code}`;
		// BUILD THE EMAIL BODY
		const body = `Hi ${object.displayName},


Click <b><a href='${process.env.APP_PREFIX}/auth/forgot-password/${object.email}/${object.code}'>this link</a></b> to change your password.


${email.footer}`;
		// Build the elements of the email
		const text = body;
		const html = body.replace(/(\r\n|\n|\r)/gm, "<br>");
		// Return the elements of the email
		return resolve({ subject, text, html });
	});
};

email.templateOrganisationDetail = (object = {}) => {
	return new Promise(async (resolve, reject) => {
		// SET THE EMAIL SUBJECT
		const subject = `Hooray! Your organisation, ${object.orgName}, is now registered on the CreateBase platform.`;
		// BUILD THE EMAIL BODY
		const body = `Hi ${object.displayName},


Congratulations! Your organisation is now established on our platform. Each school only has one organisation account and you have all the codes. This is important info so make sure you note the organisation information below, as it's needed to add teachers and students to your organisation.

Organisation information:
 - Organisation ID: ${object.orgId}
 - Organisation Name: ${object.orgName}
 - Code for Educators: ${object.eduCode}
 - Code for Learners: ${object.lerCode}

Invite other teachers using your educator code: ${object.eduCode}


${email.footer}`;
		// Build the elements of the email
		const text = body;
		const html = body.replace(/(\r\n|\n|\r)/gm, "<br>");
		// Return the elements of the email
		return resolve({ subject, text, html });
	});
};

email.templateInviteEducator = (object = {}) => {
	return new Promise(async (resolve, reject) => {
		// SET THE EMAIL SUBJECT
		const subject = `${object.sender} invited you to join ${object.orgName} on the CreateBase platform!`;
		// BUILD THE EMAIL BODY
		const body = `Hi ${object.recipient},


${object.sender} invited you to join ${object.orgName} on the CreateBase platform!

Click <b><a href='${process.env.APP_PREFIX}/invite/educator/${object.url}'>this link</a></b> to join!


${email.footer}`;
		// Build the elements of the email
		const text = body;
		const html = body.replace(/(\r\n|\n|\r)/gm, "<br>");
		// Return the elements of the email
		return resolve({ subject, text, html });
	});
};

email.templateEducatorJoin = (object = {}) => {
	return new Promise(async (resolve, reject) => {
		// SET THE EMAIL SUBJECT
		const subject = `${object.sender} is requesting to join you at ${object.orgName}`;
		// BUILD THE EMAIL BODY
		const body = `Hi ${object.recipient},


${object.sender} requested to join you and your team at ${object.orgName}!

Click <b><a href='${process.env.APP_PREFIX}/invite/educator/${object.url}'>this link</a></b> to accept this request!


${email.footer}`;
		// Build the elements of the email
		const text = body;
		const html = body.replace(/(\r\n|\n|\r)/gm, "<br>");
		// Return the elements of the email
		return resolve({ subject, text, html });
	});
};

email.templateEducatorAccept = (object = {}) => {
	return new Promise(async (resolve, reject) => {
		// SET THE EMAIL SUBJECT
		const subject = `You are now a part of ${object.orgName}`;
		// BUILD THE EMAIL BODY
		const body = `
Hi ${object.recipient},


Amazing news! You are now a part of ${object.orgName}!

Each school only has one organisation account and you have all the codes. This is important info so make sure you note the organisation information below, as it's needed to add teachers and students to your organisation.

Organisation information:
 - Organisation ID: ${object.orgId}
 - Organisation Name: ${object.orgName}
 - Code for Educators: ${object.eduCode}
 - Code for Learners: ${object.lerCode}


 ${email.footer}`;
		// Build the elements of the email
		const text = body;
		const html = body.replace(/(\r\n|\n|\r)/gm, "<br>");
		// Return the elements of the email
		return resolve({ subject, text, html });
	});
};

email.templateInqNotif = (object = {}) => {
	return new Promise(async (resolve, reject) => {
		// SET THE EMAIL SUBJECT
		const subject = `New inquiry from ${object.name}`;
		// BUILD THE EMAIL BODY
		const body = `Hey team,


We have a new inquiry from ${object.name} (${object.userEmail}).

Subject: ${object.subject}

Message: ${object.message}


${email.footer}`;
		// Build the elements of the email
		const text = body;
		const html = body.replace(/(\r\n|\n|\r)/gm, "<br>");
		// Return the elements of the email
		return resolve({ subject, text, html });
	});
};

email.templateNewOrgNotif = (object = {}) => {
	return new Promise(async (resolve, reject) => {
		// SET THE EMAIL SUBJECT
		const subject = `${object.orgName} just joined CreateBase!`;
		// BUILD THE EMAIL BODY
		const body = `Hey team,


${object.displayName} from ${object.orgName} just registered their organisation on our platform!

Amazing job team! Looking forward to more amazing news!


${email.footer}`;
		// Build the elements of the email
		const text = body;
		const html = body.replace(/(\r\n|\n|\r)/gm, "<br>");
		// Return the elements of the email
		return resolve({ subject, text, html });
	});
};

email.templateRaw = (object = {}) => {
	return new Promise(async (resolve, reject) => {
		// SET THE EMAIL SUBJECT
		const subject = object.subject;
		// Set the email body
		const body = `${object.body}
		
		
${email.footer}`;
		// Build the elements of the email
		const text = body;
		const html = body.replace(/(\r\n|\n|\r)/gm, "<br>");
		// Return the elements of the email
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
