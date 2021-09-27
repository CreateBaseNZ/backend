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
	appFooter: undefined,
	newsFooter: undefined,
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
	templateNewsletter: undefined,
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
	if (process.env.DEPLOYMENT !== "production") object.subject = "[TEST] " + object.subject;
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
			case "email-newsletter":
				promise = email.templateNewsletter(object);
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
		if (process.env.DEPLOYMENT !== "production") contents.subject = "[TEST] " + contents.subject;
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

email.appFooter = `Best regards,

The CreateBase Team


<i>Visit our <b><a href='${process.env.SITE_PREFIX}'>website</a></b> and our <b><a href='${process.env.APP_PREFIX}/'>application</a></b>.

Join our exclusive <b><a href='https://www.facebook.com/groups/createbaseteacherscommunity'>Facebook group</a></b> for teachers and receive quick responses to your questions. Check if we have answered your questions in our <b><a href='${process.env.APP_PREFIX}/faq'>FAQ page</a></b>.

Follow our social media and stay up-to-date with the latest news: <b><a href='https://www.facebook.com/CreateBaseNZ'>Facebook</a></b>, <b><a href='https://twitter.com/CreateBaseNZ'>Twitter</a></b>, <b><a href='https://www.instagram.com/createbasenz/'>Instagram</a></b> and <b><a href='https://www.youtube.com/channel/UClLBwFvHpGrRpxyRg1IOB0g'>YouTube</a></b>.

Did you encounter any bugs or errors? <b><a href='${process.env.SITE_PREFIX}contact'>Contact us here</a></b>!</i>`;

email.newsFooter = function (email = "") {
	return `<i>Not for you? <b><a href='${process.env.SITE_PREFIX}mailing-list/unsubscribe/${email}'>Unsubscribe from our mailing list</a></b>.</i>`;
};

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


${email.appFooter}`;
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


Thank you for registering an account with us! Here is your first task!

Verify your account using this code: <b>${object.code}</b>

<b><a href='${process.env.APP_PREFIX}/verify/${object.email}__${object.code}'>Click this link</a></b> to verify your account!


${email.appFooter}`;
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
		const body = `Hi ${object.displayName},


Welcome to CreateBase! Here is your second task!

School accounts are a key part of the CreateBase platform that we call Organisation accounts. To teach with the platform you are required to be associated with an organisation account.

<b><a href='${process.env.APP_PREFIX}/user/my-account/org'>Create or join</a></b> an organisation.


<b>Create an Organisation</b>

To create an account you will need:
<ul><li>The ID of your school</li><li>The name of your school</li></ul>You can find this information <b><a href='https://www.educationcounts.govt.nz/directories/list-of-nz-schools'>here</a></b>.

<b><a href='https://youtu.be/6QTpDvfDZ9s'>Here is a video</a></b> on how to register your organisation.


<b>Join an Organisation</b>

If your school already exists on the CreateBase platform, you will need to join it using the code emailed to the teacher who registered your organisation on our platform.

If your school already exists on the CreateBase platform, you will need to join instead. Here are the different ways you can join the organisation:
<ul><li>Get the invitation link from the teacher who registered your organisation to automatically join the organisation.</li><li>Get the code for educators from the teacher who registered your organisation, and manually join the organisation.</li></ul><b><a href='https://youtu.be/AQ6acGxQZwE'>Here is a video</a></b> on how to join an organisation.


${email.appFooter}`;
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


${email.appFooter}`;
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
		let orgName = "";
		for (let i = 0; i < object.orgName.length; i++) {
			const character = object.orgName[i];
			if (character === " ") {
				orgName = orgName + "-";
			} else {
				orgName = orgName + character;
			}
		}
		const body = `Hi ${object.displayName},


Congratulations! Your organisation is now established on our platform. Each school only has one organisation account and you have all the codes. This is important info so make sure you note the organisation information below, as it's needed to add teachers and students to your organisation.


<b>Organisation Information</b>
<ul><li>Organisation ID: <b>${object.orgId}</b></li><li>Organisation Name: <b>${object.orgName}</b></li><li>Code for Educators: <b>${object.eduCode}</b></li><li>Code for Learners: <b>${object.lerCode}</b></li></ul>
<b>Invite Your Fellow Teachers and Your Students</b>

It is more fun when there are more people in your organisation! So, invite your fellow teachers and your students to the organisation. <b><a href='https://youtu.be/nb0zARtCCK0'>Here is a video</a></b> on how to invite your fellow teachers and your students.

Here are the invitation links that you can send to your fellow educators and your students.
<ul><li>Educator link - ${process.env.APP_PREFIX}/invite/educator/${object.orgId}__${orgName}__${object.eduCode}</li><li>Learner link - ${process.env.APP_PREFIX}/invite/learner/${object.orgId}__${orgName}__${object.lerCode}</li></ul>
${email.appFooter}`;
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


${email.appFooter}`;
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


${email.appFooter}`;
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
		let orgName = "";
		for (let i = 0; i < object.orgName.length; i++) {
			const character = object.orgName[i];
			if (character === " ") {
				orgName = orgName + "-";
			} else {
				orgName = orgName + character;
			}
		}
		const body = `Hi ${object.recipient},


Amazing news! You are now a part of ${object.orgName}!

Each school only has one organisation account and you have all the codes. This is important info so make sure you note the organisation information below, as it's needed to add teachers and students to your organisation.
		

<b>Organisation Information</b>
<ul><li>Organisation ID: <b>${object.orgId}</b></li><li>Organisation Name: <b>${object.orgName}</b></li><li>Code for Educators: <b>${object.eduCode}</b></li><li>Code for Learners: <b>${object.lerCode}</b></li></ul>
<b>Invite Your Fellow Teachers and Your Students</b>

It is more fun when there are more people in your organisation! So, invite your fellow teachers and your students to the organisation. <b><a href='https://youtu.be/nb0zARtCCK0'>Here is a video</a></b> on how to invite your fellow teachers and your students.

Here are the invitation links that you can send to your fellow educators and your students.
<ul><li>Educator link - ${process.env.APP_PREFIX}/invite/educator/${object.orgId}__${orgName}__${object.eduCode}</li><li>Learner link - ${process.env.APP_PREFIX}/invite/learner/${object.orgId}__${orgName}__${object.lerCode}</li></ul>
 ${email.appFooter}`;
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


We have a new inquiry!

From: ${object.name} (${object.userEmail})

Subject: ${object.subject}

Message: ${object.message}


${email.appFooter}`;
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


${email.appFooter}`;
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
		
		
${email.appFooter}`;
		// Build the elements of the email
		const text = body;
		const html = body.replace(/(\r\n|\n|\r)/gm, "<br>");
		// Return the elements of the email
		return resolve({ subject, text, html });
	});
};

email.templateNewsletter = (object = {}) => {
	return new Promise(async (resolve, reject) => {
		// SET THE EMAIL SUBJECT
		const subject = object.subject;
		// Set the email body
		const body = `${object.body}
		
		
${email.appFooter} ${email.newsFooter(object.email)}`;
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
