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
  templateOne: undefined
}

/*=========================================================================================
FUNCTIONS
=========================================================================================*/

/**
 * This function builds the email object
 * @param {Object} object
 */
email.build = (object = {}) => {
  // VALIDATE OBJECT

  // CONSTRUCT EMAIL
  const mail = {
    from: `"CreateBase" <${process.env.EMAIL_ADDRESS}>`,
    to: `${object.email}`,
    subject: object.subject,
    text: object.text,
    html: object.html
  };
  // SUCCESS HANDLER
  return mail;
}

email.create = (object = {}, template = "") => {
  return new Promise(async (resolve, reject) => {
    // VALIDATE OBJECT

    // BUILD CONTENTS
    let promise;
    switch (template) {
      case "inquiry": promise = email.templateInquiry(object); break;
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
      host: process.env.AWS_SMTP_HOST,
      port: process.env.AWS_SMTP_PORT,
      secure: true,
      auth: {
        user: process.env.AWS_SMTP_USERNAME,
        pass: process.env.AWS_SMTP_PASSWORD
      }
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
}

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
                <p class="footer-copyright">&#169; 2020 CreateBase. All rights reserved :)</p>
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

/*=========================================================================================
EXPORT
=========================================================================================*/

module.exports = email;

/*=========================================================================================
END
=========================================================================================*/
