/*=========================================================================================
REQUIRED MODULES
=========================================================================================*/

const express = require("express");
const nodemailer = require("nodemailer");
const inlineCSS = require("inline-css");

/*=========================================================================================
VARIABLES
=========================================================================================*/

const router = new express.Router();

/*=========================================================================================
MODELS
=========================================================================================*/

const Mail = require("../../model/Mail.js");
const Account = require("../../model/Account.js");
const Customer = require("../../model/Customer.js");

/*=========================================================================================
MIDDLEWARE
=========================================================================================*/

// Admin Access Middleware

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

/*=========================================================================================
ROUTES
=========================================================================================*/

// @route     POST /email/send/template-one
// @desc
// @access    Admin
router.post("/email/send/template-one", async (req, res) => {
  const recipient = req.body.recipient;
  const options = req.body.options;
  let data;
  try {
    data = await sendEmail(recipient, templateOne, options);
  } catch (error) {
    return res.send(error);
  }
  res.send(data);
});

/*=========================================================================================
FUNCTIONS
=========================================================================================*/

const sendEmail = (recipient, template, options) => {
  return new Promise(async (resolve, reject) => {
    // Configure Transport Options
    const transportOptions = {
      service: "Gmail",
      auth: {
        type: "login",
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    };
    // Create Transporter
    const transporter = nodemailer.createTransport(transportOptions);
    // Create the Text and HTML to send
    const message = template(options);
    // Construct email
    const email = {
      from: `"CreateBase" <${process.env.EMAIL_USER}>`,
      to: `"${options.recipient}" ${recipient}`,
      subject: message.subject,
      text: message.text,
      html: message.html,
    };
    // Send the email
    let data;
    try {
      data = await transporter.sendEmail(email);
    } catch (error) {
      reject({ status: "failed", content: "failed to send the email" });
    }
    resolve({ status: "success", content: "email sent" });
  });
};

const templateOne = (options) => {
  // Create the Subject
  const subject = ``;
  // Create the Text
  const text = ``;
  // Create the HTML
  const html = ``;
  // Create the CSS Styling
  const css = ``;
  // Combine the HTML and CSS
  const combined = html + css;
  // Inline the CSS
  const inlineCSSOptions = {
    url: "/",
  };
  const inline = inlineCss(combined, inlineCSSOptions);
  // Return the email object
  return { subject, text, html: inline };
};

/*=========================================================================================
EXPORT ROUTE
=========================================================================================*/

module.exports = router;

/*=========================================================================================
END
=========================================================================================*/
