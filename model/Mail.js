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
const Account = require("./Account.js");

/*=========================================================================================
CREATE MAILING MODEL
=========================================================================================*/

const MailSchema = new Schema({
  email: { type: String, required: true },
  owner: { type: Schema.Types.ObjectId },
  received: { type: [String], default: ["newSubscriber"] }
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
  })
}

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
}

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
      const html = this.buildNewSubscriberEmail(object);
      const subject = "Thank you for subscribing to CreateBase!";
      const emailAddress = object.email;
      const text = "";
      const emailObject = email.build({ subject, html, email: emailAddress, text });
      try {
        await email.send(emailObject);
      } catch (error) {
        return reject(data);
      }
    }
    // Return success
    return resolve();
  });
}

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
}

MailSchema.statics.buildNewSubscriberEmail = function (object = {}) {
  const html = `<!doctype html><html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head><title></title> <!--[if !mso]><!-- --><meta http-equiv="X-UA-Compatible" content="IE=edge"> <!--<![endif]--><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="light dark"><meta name="supported-color-schemes" content="light dark"><style type="text/css">#outlook a{padding:0}body{margin:0;padding:0;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%}table,td{border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt}img{border:0;height:auto;line-height:100%;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic}p{display:block;margin:13px 0}@media (prefers-color-scheme: dark){.dark-mode-bg{background-color:#272623 !important;background:#272623 !important}.dark-mode{background-color:#393939 !important;background:#393939 !important}.dark-mode-text{color:#fff !important}.light-image{display:none !important}.darkimageWrapper{display:block !important}.darkimage{display:block !important}[data-ogsc] .dark-mode-bg{background-color:#272623 !important;background:#272623 !important}[data-ogsc] .dark-mode{background-color:#393939 !important;background:#393939 !important}[data-ogsc] .dark-mode-text{color:#fff !important}[data-ogsc] .light-image{display:none !important}[data-ogsc] .darkimageWrapper{display:block !important}[data-ogsc] .darkimage{display:block !important}}</style><!--[if mso]> <xml> <o:OfficeDocumentSettings> <o:AllowPNG/> <o:PixelsPerInch>96</o:PixelsPerInch> </o:OfficeDocumentSettings> </xml> <![endif]--> <!--[if lte mso 11]><style type="text/css">.mj-outlook-group-fix{width:100% !important}</style><![endif]--> <!--[if !mso]><!--><link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700" rel="stylesheet" type="text/css"><style type="text/css">@import url(https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700);</style><!--<![endif]--><style type="text/css">@media only screen and (min-width:480px){.mj-column-per-100{width:100% !important;max-width:100%}}</style><style type="text/css">@media only screen and (max-width:480px){table.mj-full-width-mobile{width:100% !important}td.mj-full-width-mobile{width:auto !important}}</style></head><body><div class="dark-mode-bg" style="background-color: #F4F4F4;background: #F4F4F4;"> <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"> <![endif]--><div style="margin:0px auto;max-width:600px;"><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;"><tbody><tr><td style="direction:ltr;font-size:0px;padding:20px;text-align:center;"> <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr></tr></table> <![endif]--></td></tr></tbody></table></div> <!--[if mso | IE]></td></tr></table> <![endif]--> <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:500px;" width="500" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"> <![endif]--><div class="dark-mode" style="background:white;background-color:white;margin:0px auto;max-width:500px;"><table class="dark-mode" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:white;background-color:white;width:100%;"><tbody><tr><td style="direction:ltr;font-size:0px;padding:30px 0px 0px 0px;text-align:center;"> <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:500px;" > <![endif]--><div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"><tr><td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;"><tbody><tr><td style="width:150px;"> <a href="${process.env.SITE_PREFIX}" target="_blank"> <img height="auto" src="${process.env.SITE_PREFIX}public-image/logo-full.png" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;background: transparent;background-color: transparent;" width="150" /> </a></td></tr></tbody></table></td></tr></table></div> <!--[if mso | IE]></td></tr></table> <![endif]--></td></tr></tbody></table></div> <!--[if mso | IE]></td></tr></table> <![endif]--> <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:500px;" width="500" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"> <![endif]--><div class="dark-mode" style="background:white;background-color:white;margin:0px auto;max-width:500px;"><table class="dark-mode" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:white;background-color:white;width:100%;"><tbody><tr><td style="direction:ltr;font-size:0px;padding:0;text-align:center;"> <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:500px;" > <![endif]--><div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"><tr><td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;"><div class="dark-mode-text" style="font-family:Poppins, Helvetica, Arial, sans-serif;font-size:13px;line-height:250%;text-align:center;color:#1A1039;"><h1>Thank you for subscribing!</h1></div></td></tr><tr><td align="center" style="font-size:0px;padding:0;word-break:break-word;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;"><tbody><tr><td style="width:500px;"> <img height="auto" src="${process.env.SITE_PREFIX}public-image/journey.png" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;background: transparent;background-color: transparent;" width="500" /></td></tr></tbody></table></td></tr></table></div> <!--[if mso | IE]></td></tr></table> <![endif]--></td></tr></tbody></table></div> <!--[if mso | IE]></td></tr></table> <![endif]--> <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:500px;" width="500" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"> <![endif]--><div class="dark-mode" style="background:white;background-color:white;margin:0px auto;max-width:500px;"><table class="dark-mode" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:white;background-color:white;width:100%;"><tbody><tr><td style="direction:ltr;font-size:0px;padding:0;text-align:center;"> <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:500px;" > <![endif]--><div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"><tr><td align="center" style="font-size:0px;padding:30px;word-break:break-word;"><div class="dark-mode-text" style="font-family:Poppins, Helvetica, Arial, sans-serif;font-size:13px;line-height:180%;text-align:center;color:#1A1039;"><h2>Part of our journey</h2><p>Our community plays a vital role in helping us develop our products.</p></div></td></tr><tr><td align="center" style="font-size:0px;padding:0;word-break:break-word;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;"><tbody><tr><td style="width:500px;"> <img height="auto" src="${process.env.SITE_PREFIX}public-image/platform.png" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;background: transparent;background-color: transparent;" width="500" /></td></tr></tbody></table></td></tr><tr><td align="center" style="font-size:0px;padding:30px;word-break:break-word;width:500px;"><div class="dark-mode-text" style="font-family:Poppins, Helvetica, Arial, sans-serif;font-size:13px;line-height:180%;text-align:center;color:#1A1039;"><p>We will keep you updated with the latest product releases and provide opportunities to help shape our direction right from your email!</p></div></td></tr></table></div> <!--[if mso | IE]></td></tr></table> <![endif]--></td></tr></tbody></table></div> <!--[if mso | IE]></td></tr></table> <![endif]--> <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:500px;" width="500" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"> <![endif]--><div class="dark-mode" style="background:white;background-color:white;margin:0px auto;max-width:500px;"><table class="dark-mode" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:white;background-color:white;width:100%;"><tbody><tr><td style="direction:ltr;font-size:0px;padding:10px 0px;text-align:center;width:500px;"> <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:500px;" > <![endif]--><div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"><tr><td align="center" style="font-size:0px;padding:30px 30px 0px 30px;word-break:break-word;"><div class="dark-mode-text" style="font-family:Poppins, Helvetica, Arial, sans-serif;font-size:13px;line-height:180%;text-align:center;color:#1A1039;"><h2>Share the love</h2><p>Do you know someone who is interested in technology? Share this link with them to help them on their journey:</p></div></td></tr><tr><td align="center" vertical-align="middle" style="font-size:0px;padding:20px;word-break:break-word;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;line-height:100%;"><tr><td align="center" bgcolor="#209CE2" role="presentation" style="border:none;border-radius:10px;cursor:auto;mso-padding-alt:20px 40px;background:#209CE2;" valign="middle"> <a class="dark-mode-text" href="${process.env.SITE_PREFIX}" style="display:inline-block;background:#209CE2;color:white;font-family:Helvetica;font-size:15px;font-weight:normal;line-height:120%;margin:0;text-decoration:none;text-transform:none;padding:20px 40px;mso-padding-alt:0px;border-radius:10px;" target="_blank"> Refer a friend </a></td></tr></table></td></tr></table></div> <!--[if mso | IE]></td></tr></table> <![endif]--></td></tr></tbody></table></div> <!--[if mso | IE]></td></tr></table> <![endif]--> <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:500px;" width="500" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"> <![endif]--><div class="dark-mode" style="background:white;background-color:white;margin:0px auto;max-width:500px;"><table class="dark-mode" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:white;background-color:white;width:100%;"><tbody><tr><td style="direction:ltr;font-size:0px;padding:30px 0px 10px 0px;text-align:center;width:500px;"> <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:500px;" > <![endif]--><div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"><tr><td align="center" style="font-size:0px;padding:10px 25px;padding-top:30px;word-break:break-word;"><div class="dark-mode-text" style="font-family:Poppins, Helvetica, Arial, sans-serif;font-size:13px;line-height:180%;text-align:center;color:#1A1039;"><h2>Kickstarter coming soon</h2></div></td></tr><tr><td align="center" style="font-size:0px;padding:10px;word-break:break-word;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;"><tbody><tr><td style="width:500px;"> <img height="auto" src="${process.env.SITE_PREFIX}public-image/kickstarter.png" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;background: transparent;background-color: transparent;" width="500" /></td></tr></tbody></table></td></tr><tr><td align="center" style="font-size:0px;padding:30px 30px 30px 30px;word-break:break-word;"><div class="dark-mode-text" style="font-family:Poppins, Helvetica, Arial, sans-serif;font-size:13px;line-height:180%;text-align:center;color:#1A1039;"><p>Keep an eye out for our Kickstarter campaign that will be launching within the next few months.</p></div></td></tr></table></div> <!--[if mso | IE]></td></tr></table> <![endif]--></td></tr></tbody></table></div> <!--[if mso | IE]></td></tr></table> <![endif]--> <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:500px;" width="500" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"> <![endif]--><div class="dark-mode" style="background:white;background-color:white;margin:0px auto;max-width:500px;"><table class="dark-mode" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:white;background-color:white;width:100%;"><tbody><tr><td style="direction:ltr;font-size:0px;padding:30px 0;text-align:center;width:500px;"> <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:500px;" > <![endif]--><div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"><tr><td align="center" style="font-size:0px;padding:10px 30px;word-break:break-word;"><div class="dark-mode-text" style="font-family:Poppins, Helvetica, Arial, sans-serif;font-size:13px;line-height:180%;text-align:center;color:#1A1039;"><h2>Stay in the know</h2><p>To be the first to know about our latest events, competitions and to engage with our journey directly, follow us on social media.</p></div></td></tr><tr><td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;"> <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" ><tr><td> <![endif]--><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="float:none;display:inline-table;"><tr><td style="padding:4px;vertical-align:middle;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#4BADE9;border-radius:3px;width:30px;"><tr><td style="font-size:0;height:30px;vertical-align:middle;width:30px;"> <a href="${process.env.SITE_PREFIX}" target="_blank"> <img height="30" src="${process.env.SITE_PREFIX}public-image/logo.png" style="border-radius:3px;display:block;" width="30" /> </a></td></tr></table></td></tr></table> <!--[if mso | IE]></td><td> <![endif]--><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="float:none;display:inline-table;"><tr><td style="padding:4px;vertical-align:middle;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#3b5998;border-radius:3px;width:30px;"><tr><td style="font-size:0;height:30px;vertical-align:middle;width:30px;"> <a href="https://www.facebook.com/sharer/sharer.php?u=https://www.facebook.com/CreateBaseNZ/" target="_blank"> <img height="30" src="https://www.mailjet.com/images/theme/v1/icons/ico-social/facebook.png" style="border-radius:3px;display:block;" width="30" /> </a></td></tr></table></td></tr></table> <!--[if mso | IE]></td><td> <![endif]--><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="float:none;display:inline-table;"><tr><td style="padding:4px;vertical-align:middle;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#55acee;border-radius:3px;width:30px;"><tr><td style="font-size:0;height:30px;vertical-align:middle;width:30px;"> <a href="https://twitter.com/intent/tweet?url=https://twitter.com/CreateBaseNZ" target="_blank"> <img height="30" src="https://www.mailjet.com/images/theme/v1/icons/ico-social/twitter.png" style="border-radius:3px;display:block;" width="30" /> </a></td></tr></table></td></tr></table> <!--[if mso | IE]></td><td> <![endif]--><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="float:none;display:inline-table;"><tr><td style="padding:4px;vertical-align:middle;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#3f729b;border-radius:3px;width:30px;"><tr><td style="font-size:0;height:30px;vertical-align:middle;width:30px;"> <a href="https://www.instagram.com/createbasenz/" target="_blank"> <img height="30" src="https://www.mailjet.com/images/theme/v1/icons/ico-social/instagram.png" style="border-radius:3px;display:block;" width="30" /> </a></td></tr></table></td></tr></table> <!--[if mso | IE]></td><td> <![endif]--><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="float:none;display:inline-table;"><tr><td style="padding:4px;vertical-align:middle;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#EB3323;border-radius:3px;width:30px;"><tr><td style="font-size:0;height:30px;vertical-align:middle;width:30px;"> <a href="https://www.youtube.com/channel/UClLBwFvHpGrRpxyRg1IOB0g" target="_blank"> <img height="30" src="https://www.mailjet.com/images/theme/v1/icons/ico-social/youtube.png" style="border-radius:3px;display:block;" width="30" /> </a></td></tr></table></td></tr></table> <!--[if mso | IE]></td></tr></table> <![endif]--></td></tr></table></div> <!--[if mso | IE]></td></tr></table> <![endif]--></td></tr></tbody></table></div> <!--[if mso | IE]></td></tr></table> <![endif]--> <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:500px;" width="500" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"> <![endif]--><div class="dark-mode" style="background:white;background-color:white;margin:0px auto;max-width:500px;"><table class="dark-mode" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:white;background-color:white;width:100%;"><tbody><tr><td style="direction:ltr;font-size:0px;padding:0;text-align:center;"> <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:500px;" > <![endif]--><div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"><tr><td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;"><div style="font-family:Poppins, Helvetica, Arial, sans-serif;font-size:11px;line-height:180%;text-align:center;color:#ABABAB;"><p>For any questions, please email <a href="mailto:admin@createbase.co.nz" style="font-weight:bold; color:#ABABAB;">admin@createbase.co.nz</a></p><p><a href="${process.env.SITE_PREFIX}mailing-list/unsubscribe/:email" style="font-weight:bold;text-decoration:underline; color:#ABABAB;">Unsubscribe from mailing list</a></p></div></td></tr><tr><td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;"><div style="font-family:Poppins, Helvetica, Arial, sans-serif;font-size:10px;line-height:1;text-align:center;color:#ABABAB;"><p>&copy; CreateBase 2021</p></div></td></tr></table></div> <!--[if mso | IE]></td></tr></table> <![endif]--></td></tr></tbody></table></div> <!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"> <![endif]--><div style="margin:0px auto;max-width:600px;"><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;"><tbody><tr><td style="direction:ltr;font-size:0px;padding:20px;text-align:center;"> <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr></tr></table> <![endif]--></td></tr></tbody></table></div> <!--[if mso | IE]></td></tr></table> <![endif]--></div></body></html>`;
  return html;
}

/*=========================================================================================
EXPORT MAIL MODEL
=========================================================================================*/

module.exports = Mail = mongoose.model("mail", MailSchema);

/*=========================================================================================
END
=========================================================================================*/
