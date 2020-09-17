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
  send: undefined,
  // TEMPLATES
  templateOne: undefined
}

/*=========================================================================================
FUNCTIONS
=========================================================================================*/

email.build = (object = {}, template = "") => {
  return new Promise(async (resolve, reject) => {
    // VALIDATE OBJECT

    // BUILD CONTENTS
    let promise;
    switch (template) {
      case "one": promise = email.templateOne(object); break;
      default: return reject({ status: "failed", content: "No template is provided" });
    }
    let contents;
    try {
      contents = await promise;
    } catch (data) {
      return reject(data);
    }
    // CONSTRUCT EMAIL
    const mail = {
      from: `"CreateBase" <${process.env.EMAIL_ADDRESS}>`,
      to: `${object.email}`,
      subject: contents.subject,
      text: contents.text,
      html: contents.html
    };
    // SUCCESS HANDLER
    return resolve(mail);
  });
}

email.send = (object = {}) => {
  return new Promise(async (resolve, reject) => {
    // VALIDATE OBJECT

    // CONFIGURE TRANSPORT OPTIONS
    const transportOptions = {
      host: "smtp.gmail.com", port: 465, secure: true,
      auth: {
        type: "OAuth2", user: process.env.EMAIL_ADDRESS,
        serviceClient: process.env.EMAIL_CLIENT_ID,
        privateKey: process.env.EMAIL_PRIVATE_KEY
      }
    };
    // CREATE TRANSPOORT
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
}

/* ----------------------------------------------------------------------------------------
TEMPLATES
---------------------------------------------------------------------------------------- */

email.templateOne = (object) => {
  return new Promise(async (resolve, reject) => {
    // SET THE EMAIL SUBJECT
    const subject = object.subject;
    // BUILD THE EMAIL BODY
    const text = "";
    const div = "";
    // SET THE CSS STYLING
    const css = "";
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
  })
};

/*=========================================================================================
EXPORT
=========================================================================================*/

module.exports = email;

/*=========================================================================================
END
=========================================================================================*/
