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
	templateInqNotif: undefined,
	templateNewOrgNotif: undefined,
	templateTestEmail: undefined,
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
			case "inq-notif":
				promise = email.templateInqNotif(object);
				break;
			case "new-org-notif":
				promise = email.templateNewOrgNotif(object);
				break;
			case "test":
				promise = email.templateTestEmail();
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
		// Recipient
		let recipient;
		if (teamNotif) {
			recipient = members;
		} else {
			recipient = object.email;
		}
		// Test
		if (process.env.NODE_ENV !== "production") contents.subject = "[TEST]: " + contents.subject;
		// CONSTRUCT EMAIL
		const mail = {
			from: `"CreateBase" <${process.env.EMAIL_ADDRESS}>`,
			to: `${recipient}`,
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
		const subject = object.subject;
		// BUILD THE EMAIL BODY
		const text = `
Hi ${object.name},


Thank you for the message, we will get back to you as soon as possible!


Kind Regards,

CreateBase Team`;

		const div = `
    <div id="body">
      <div id="wrap">
        <div id="content-container">
          <table border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" id="bodyTable">
            <tr>
              <td align="center" valign="top">
                <table border="0" cellpadding="20" cellspacing="0" id="emailContainer">
                  <tr>
                    <td align="center" valign="top" id="header-td">
                      <table border="0" cellpadding="0" cellspacing="0" width="100%" id="emailHeader">
                        <tr>
                          <td align="center" valign="top">
                            <img src="https://createbase.co.nz/public/images/logo-dark.png" alt="CreateBase" id="logo">
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <table id="content-table">
                    <tr>
                      <td align="center" valign="center">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" id="emailBody">
                          <tr>
                            <td align="center" valign="top" width="100%">
                              <h1>Hi ${object.name}</h1>
                              <p class="content-text">Thank you for the message, we will get
                                back to you as soon as possible!</p>
                            </td>
                          </tr>
                          <tr>
                            <td align="center" valign="top" width="100%" style="padding-top: 2em;">
                              <h3>The CreateBase Team</h3>
                            </td>
                          </tr>
                        </table>
                      </td>
                      <td align="center" valign="top" id="img1-td">
                        <table border="0" cellpadding="10" cellspacing="0" width="100%" id="emailBody">
                          <tr>
                            <td align="center" valign="top">
                              <img src="https://createbase.co.nz/public/images/email/family-arm.jpg"
                                alt="createbase-img01" id="body-image1">
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                  <tr>
                    <td align="center" valign="center" style="border-top: 3px solid #F0F0F0; padding: 1em 2em;">
                      <table border="0" cellpadding="5" cellspacing="0" width="100%" id="emailFooter">
                        <tr>
                          <td align="left" valign="center">
                            <!-- <img src="/public/images/logo-icon.png" alt="CreateBase" id="icon"> -->
                            <p class="sub-content-text">Stay up to date</p>
                          </td>
                          <td align="right" valign="center">
                            <a
                              href="https://www.facebook.com/CreateBase-110365053954978/?view_public_for=110365053954978"><img
                                src="https://createbase.co.nz/public/images/email/ico_facebook.jpg" alt="CreateBase-icon"
                                class="social-icon"></a>
                            <a href="https://www.instagram.com/createbasenz/"><img
                                src="https://createbase.co.nz/public/images/email/ico_instagram.jpg" alt="CreateBase-icon"
                                class="social-icon"></a>
                            <a href="https://twitter.com/CreateBaseNZ"><img
                                src="https://createbase.co.nz/public/images/email/ico_twitter.jpg" alt="CreateBase-icon"
                                class="social-icon"></a>
                            <a
                              href="https://www.youtube.com/channel/UClLBwFvHpGrRpxyRg1IOB0g/featured?view_as=subscriber"><img
                                src="https://createbase.co.nz/public/images/email/ico_youtube.jpg" alt="CreateBase-icon"
                                class="social-icon"></a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </div>
        <div id="footer">
          <table border="0" cellpadding="20" cellspacing="0" width="100%" id="footerTable">
            <tr>
              <td align="center" valign="top">
                <p class="footer-copyright">&#169; 2021 CreateBase. All rights reserved :)</p>
              </td>
            </tr>
            <tr>
              <td align="center" valign="top" style="padding: 0 0 1em 0;">
                <a href="https://createbase.co.nz/unsubscribe/${object.email}" class="unsub">Unsubscribe from emails</a>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
    `;
		// SET THE CSS STYLING
		const css = `
    <style>
      * {
        margin: 0;
      }
    
      #body {
        font-family: 'Poppins', sans-serif;
        font-style: normal;
        background-color: #F0F0F0;
        width: 100%;
        color: #322D41;
      }
    
      #wrap {
        min-width: 300px;
        width: 100%;
        max-width: 700px;
        margin: auto;
      }
    
      #content-container {
        text-align: center;
        background-color: #FFFFFF;
      }
    
      #logo {
        width: 30%;
        min-width: 10em;
      }
    
      h1 {
        font-size: calc(16px + 6 * ((100vw - 320px) / 680));
        color: #322D41;
        padding-bottom: 1em;
      }
    
      h2 {
        font-size: calc(14px + 4 * ((100vw - 320px) / 680));
        /* padding-top: 1.2em; */
        font-weight: 400;
        color: #322D41;
      }
    
      h3 {
        font-size: calc(10px + 2 * ((100vw - 320px) / 680));
        /* padding-top: 1.5em; */
        color: #322D41;
      }
    
    
      #divider {
        font-size: calc(10px + 2 * ((100vw - 320px) / 680));
        /* padding: 3em 0 1em 0; */
        color: #322D41;
      }
    
      #content-table {
        padding: 1em 2em 2em 2em;
      }
    
      .social-icon {
        width: 2em;
      }
    
      #header-td {
        padding: 2em 0 0 0;
      }
    
      .footer-copyright {
        font-size: 0.8em;
        color: #877da9;
      }
    
      .unsub {
        font-size: 0.7em;
        color: #877da9;
      }
    
      .content-text {
        font-size: calc(12px + 2 * ((100vw - 320px) / 680));
        color: #322D41;
        padding: 0 2em;
      }
    
      .sub-content-text {
        font-size: calc(10px + 2 * ((100vw - 320px) / 680));
        font-weight: 600;
      }
    
      #body-image1 {
        width: 100%;
        min-width: 8em;
      }
    
      @media only screen and (max-width: 375px) {
        #img1-td {
          display: none;
        }
      }
    
    
      @media only screen and (min-width: 600px) {
        .content-text {
          font-size: 0.9em;
        }
    
        .content-table {
          padding: 1em;
        }
      }
    </style>
    `;
		// Combine the HTML and CSS
		const combined = div + css;
		// Inline the CSS
		const inlineCSSOptions = { url: "/" };
		let html;
		try {
			html = await inlineCSS(combined, inlineCSSOptions);
		} catch (error) {
			return reject({ status: "error", content: error });
		}
		// Return the email object
		return resolve({ subject, text, html });
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

email.templateTestEmail = () => {
	return new Promise(async (resolve, reject) => {
		// SET THE EMAIL SUBJECT
		const subject = `Testing the automated email feature`;
		// BUILD THE EMAIL BODY
		const text = `
Good day Ma'am/Sir,


We are just testing to see if you received this email with no problem.


Kind Regards,
CreateBase Team`;

		const div = ``;
		// SET THE CSS STYLING
		const css = ``;
		// Combine the HTML and CSS
		const combined = div + css;
		// Inline the CSS
		const inlineCSSOptions = { url: "/" };
		let html = "";
		// try {
		// 	html = await inlineCSS(combined, inlineCSSOptions);
		// } catch (error) {
		// 	return reject({ status: "error", content: error });
		// }
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
