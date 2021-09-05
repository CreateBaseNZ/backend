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

MessageSchema.methods.buildInquiryEmail = function (object = {}) {
	const html = `<!doctype html><html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head><title></title> <!--[if !mso]><!-- --><meta http-equiv="X-UA-Compatible" content="IE=edge"> <!--<![endif]--><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="light dark"><meta name="supported-color-schemes" content="light dark"><style type="text/css">#outlook a{padding:0}body{margin:0;padding:0;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%}table,td{border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt}img{border:0;height:auto;line-height:100%;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic}p{display:block;margin:13px 0}@media (prefers-color-scheme: dark){.dark-mode-bg{background-color:#272623 !important;background:#272623 !important}.dark-mode{background-color:#393939 !important;background:#393939 !important}.dark-mode-text{color:#fff !important}.light-image{display:none !important}.darkimageWrapper{display:block !important}.darkimage{display:block !important}[data-ogsc] .dark-mode-bg{background-color:#272623 !important;background:#272623 !important}[data-ogsc] .dark-mode{background-color:#393939 !important;background:#393939 !important}[data-ogsc] .dark-mode-text{color:#fff !important}[data-ogsc] .light-image{display:none !important}[data-ogsc] .darkimageWrapper{display:block !important}[data-ogsc] .darkimage{display:block !important}}</style><!--[if mso]> <xml> <o:OfficeDocumentSettings> <o:AllowPNG/> <o:PixelsPerInch>96</o:PixelsPerInch> </o:OfficeDocumentSettings> </xml> <![endif]--> <!--[if lte mso 11]><style type="text/css">.mj-outlook-group-fix{width:100% !important}</style><![endif]--> <!--[if !mso]><!--><link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700" rel="stylesheet" type="text/css"><style type="text/css">@import url(https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700);</style><!--<![endif]--><style type="text/css">@media only screen and (min-width:480px){.mj-column-per-100{width:100% !important;max-width:100%}}</style><style type="text/css">@media only screen and (max-width:480px){table.mj-full-width-mobile{width:100% !important}td.mj-full-width-mobile{width:auto !important}}</style></head><body><div class="dark-mode-bg" style="background-color: #F4F4F4;background: #F4F4F4;"> <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:500px;" width="500" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"> <![endif]--><div style="margin:0px auto;max-width:500px;"><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;"><tbody><tr><td style="direction:ltr;font-size:0px;padding:20px;text-align:center;"> <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr></tr></table> <![endif]--></td></tr></tbody></table></div> <!--[if mso | IE]></td></tr></table> <![endif]--> <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:500px;" width="500" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"> <![endif]--><div class="dark-mode" style="background:white;background-color:white;margin:0px auto;max-width:500px;"><table class="dark-mode" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:white;background-color:white;width:100%;"><tbody><tr><td style="direction:ltr;font-size:0px;padding:30px 0px 0px 0px;text-align:center;"> <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:500px;" > <![endif]--><div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"><tr><td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;"><tbody><tr><td style="width:150px;"> <a href="${process.env.SITE_PREFIX}" target="_blank"> <img height="auto" src="${process.env.SITE_PREFIX}public-image/logo-full.png" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;background: transparent;background-color: transparent;" width="150" /> </a></td></tr></tbody></table></td></tr></table></div> <!--[if mso | IE]></td></tr></table> <![endif]--></td></tr></tbody></table></div> <!--[if mso | IE]></td></tr></table> <![endif]--> <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:500px;" width="500" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"> <![endif]--><div class="dark-mode" style="background:white;background-color:white;margin:0px auto;max-width:500px;"><table class="dark-mode" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:white;background-color:white;width:100%;"><tbody><tr><td style="direction:ltr;font-size:0px;padding:0;text-align:center;"> <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:500px;" > <![endif]--><div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"><tr><td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;"><div class="dark-mode-text" style="font-family:Poppins, Helvetica, Arial, sans-serif;font-size:13px;line-height:250%;text-align:center;color:#1A1039;"><h1>Hi ${object.name}</h1></div></td></tr><tr><td align="center" style="font-size:0px;padding:10px;word-break:break-word;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;"><tbody><tr><td style="width:500px;"> <img height="auto" src="${process.env.SITE_PREFIX}public-image/Code.png" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;background: transparent;background-color: transparent;" width="500" /></td></tr></tbody></table></td></tr></table></div> <!--[if mso | IE]></td></tr></table> <![endif]--></td></tr></tbody></table></div> <!--[if mso | IE]></td></tr></table> <![endif]--> <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:500px;" width="500" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"> <![endif]--><div class="dark-mode" style="background:white;background-color:white;margin:0px auto;max-width:500px;"><table class="dark-mode" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:white;background-color:white;width:100%;"><tbody><tr><td style="direction:ltr;font-size:0px;padding:0;text-align:center;"> <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:500px;" > <![endif]--><div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"><tr><td align="center" style="font-size:0px;padding:20px;word-break:break-word;"><div class="dark-mode-text" style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:180%;text-align:center;color:#1A1039;"><p>Thank you for the message, we will get back to you as soon as possible!</p><h4>- The CreateBase team</h4></div></td></tr></table></div> <!--[if mso | IE]></td></tr></table> <![endif]--></td></tr></tbody></table></div> <!--[if mso | IE]></td></tr></table> <![endif]--> <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:500px;" width="500" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"> <![endif]--><div class="dark-mode" style="background:white;background-color:white;margin:0px auto;max-width:500px;"><table class="dark-mode" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:white;background-color:white;width:100%;"><tbody><tr><td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;"> <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:500px;" > <![endif]--><div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"><tr><td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;"> <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" ><tr><td> <![endif]--><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="float:none;display:inline-table;"><tr><td style="padding:4px;vertical-align:middle;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#4BADE9;border-radius:3px;width:30px;"><tr><td style="font-size:0;height:30px;vertical-align:middle;width:30px;"> <a href="${process.env.SITE_PREFIX}" target="_blank"> <img height="30" src="${process.env.SITE_PREFIX}public-image/logo.png" style="border-radius:3px;display:block;" width="30" /> </a></td></tr></table></td></tr></table> <!--[if mso | IE]></td><td> <![endif]--><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="float:none;display:inline-table;"><tr><td style="padding:4px;vertical-align:middle;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#3b5998;border-radius:3px;width:30px;"><tr><td style="font-size:0;height:30px;vertical-align:middle;width:30px;"> <a href="https://www.facebook.com/CreateBaseNZ" target="_blank"> <img height="30" src="https://www.mailjet.com/images/theme/v1/icons/ico-social/facebook.png" style="border-radius:3px;display:block;" width="30" /> </a></td></tr></table></td></tr></table> <!--[if mso | IE]></td><td> <![endif]--><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="float:none;display:inline-table;"><tr><td style="padding:4px;vertical-align:middle;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#55acee;border-radius:3px;width:30px;"><tr><td style="font-size:0;height:30px;vertical-align:middle;width:30px;"> <a href="https://twitter.com/intent/tweet?url=https://twitter.com/CreateBaseNZ" target="_blank"> <img height="30" src="https://www.mailjet.com/images/theme/v1/icons/ico-social/twitter.png" style="border-radius:3px;display:block;" width="30" /> </a></td></tr></table></td></tr></table> <!--[if mso | IE]></td><td> <![endif]--><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="float:none;display:inline-table;"><tr><td style="padding:4px;vertical-align:middle;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#3f729b;border-radius:3px;width:30px;"><tr><td style="font-size:0;height:30px;vertical-align:middle;width:30px;"> <a href="https://www.instagram.com/createbasenz/" target="_blank"> <img height="30" src="https://www.mailjet.com/images/theme/v1/icons/ico-social/instagram.png" style="border-radius:3px;display:block;" width="30" /> </a></td></tr></table></td></tr></table> <!--[if mso | IE]></td><td> <![endif]--><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="float:none;display:inline-table;"><tr><td style="padding:4px;vertical-align:middle;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#EB3323;border-radius:3px;width:30px;"><tr><td style="font-size:0;height:30px;vertical-align:middle;width:30px;"> <a href="https://www.youtube.com/channel/UClLBwFvHpGrRpxyRg1IOB0g" target="_blank"> <img height="30" src="https://www.mailjet.com/images/theme/v1/icons/ico-social/youtube.png" style="border-radius:3px;display:block;" width="30" /> </a></td></tr></table></td></tr></table> <!--[if mso | IE]></td></tr></table> <![endif]--></td></tr></table></div> <!--[if mso | IE]></td></tr></table> <![endif]--></td></tr></tbody></table></div> <!--[if mso | IE]></td></tr></table> <![endif]--> <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:500px;" width="500" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"> <![endif]--><div class="dark-mode" style="background:white;background-color:white;margin:0px auto;max-width:500px;"><table class="dark-mode" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:white;background-color:white;width:100%;"><tbody><tr><td style="direction:ltr;font-size:0px;padding:0;text-align:center;"> <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:500px;" > <![endif]--><div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"><tr><td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;"><div style="font-family:Poppins, Helvetica, Arial, sans-serif;font-size:11px;line-height:180%;text-align:center;color:#ABABAB;"><p>For any questions, please email <a href="mailto:admin@createbase.co.nz" style="font-weight:bold; color:#ABABAB;">admin@createbase.co.nz</a></p><p><a href="${process.env.SITE_PREFIX}mailing-list/unsubscribe/${object.email}" style="font-weight:bold;text-decoration:underline; color:#ABABAB;">Unsubscribe from mailing list</a></p></div></td></tr><tr><td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;"><div style="font-family:Poppins, Helvetica, Arial, sans-serif;font-size:10px;line-height:1;text-align:center;color:#ABABAB;"><p>&copy; CreateBase 2021</p></div></td></tr></table></div> <!--[if mso | IE]></td></tr></table> <![endif]--></td></tr></tbody></table></div> <!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"> <![endif]--><div style="margin:0px auto;max-width:600px;"><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;"><tbody><tr><td style="direction:ltr;font-size:0px;padding:20px;text-align:center;"> <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr></tr></table> <![endif]--></td></tr></tbody></table></div> <!--[if mso | IE]></td></tr></table> <![endif]--></div></body></html>`;
	return html;
};

/*=========================================================================================
METHODS
=========================================================================================*/

// @FUNC  sendInquiryEmailNotification
// @TYPE  STATICS - PROMISE - ASYNC
// @DESC
MessageSchema.methods.sendInquiryEmailNotification = function () {
	return new Promise(async (resolve, reject) => {
		const html = this.buildInquiryEmail({ name: this.name, email: this.email });
		const subject = `Thank you for your inquiry (#${this.number.inquiry}).`;
		const emailAddress = this.email;
		const text = "";
		const emailObject = email.build({ subject, html, email: emailAddress, text });
		// SEND EMAIL
		try {
			await email.send(emailObject);
		} catch (data) {
			return reject(data);
		}
		// Process: Notify CreateBase of the new inquiry
		// Build the email object
		const emailObject2 = {
			email: "carlvelasco96@gmail.com",
			name: this.name,
			userEmail: this.email,
			subject: this.subject,
			message: this.message,
		};
		// Create the email object
		let mail2;
		try {
			mail2 = await email.create(emailObject2, "inq-notif");
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
