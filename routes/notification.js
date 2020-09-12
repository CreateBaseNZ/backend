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

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

/*=========================================================================================
MODELS
=========================================================================================*/

const Mail = require("../model/Mail.js");

/*=========================================================================================
MIDDLEWARE
=========================================================================================*/

/*=========================================================================================
ROUTES
=========================================================================================*/

// @route     POST /subscribe/mailing-list
// @desc      Subscribing to mailing list
// @access    Public
router.post("/subscribe/mailing-list", async (req, res) => {
  const object = { email: req.body.email }
  // Check if the email is already in the mailing list
  let mail;
  try {
    mail = await Mail.build(object);
  } catch (data) {
    return res.send(data);
  }
  // SUCCESS HANDLER
  return res.send({ status: "succeeded", content: "Thank you for subscribing!" });
});

// @route     POST /unsubscribe/mailing-list
// @desc      Unsubscribing from mailing list
// @access    Public
router.get("/unsubscribe/mailing-list/:email", async (req, res) => {
  // Declare Email Variable
  const email = req.params.email;
  // Check if Email Exist in the Mailing List
  let mail;
  try {
    mail = await Mail.findByEmail(email);
  } catch (error) {
    return res.send({ status: "failed", content: error });
  }
  // Check if User is Registered
  let account;
  try {
    account = await Account.findOne({ email });
  } catch (error) {
    return res.send({ status: "failed", content: error });
  }
  // If Registered Update Subscription
  if (account) {
  }
  // Remove Email from the Mailing List
  try {
    await Mail.delete(email);
  } catch (error) {
    return res.send({ status: "failed", content: error });
  }
  // Send Success Status
  // res.send({ status: "succeeded", content: "unsubscribed successfully" });
  res.redirect("/login");
});

// @route     POST /unsubscribe/mailing-list
// @desc      Unsubscribing from mailing list
// @access    Public
router.post("/unsubscribe/mailing-list", async (req, res) => {
  // Declare Email Variable
  const email = req.body.email;
  // Check if Email Exist in the Mailing List
  let mail;
  try {
    mail = await Mail.findByEmail(email);
  } catch (error) {
    return res.send({ status: "failed", content: error });
  }
  // Check if User is Registered
  let account;
  try {
    account = await Account.findOne({ email });
  } catch (error) {
    return res.send({ status: "failed", content: error });
  }
  // If Registered Update Subscription
  if (account) {
  }
  // Remove Email from the Mailing List
  try {
    await Mail.delete(email);
  } catch (error) {
    return res.send({ status: "failed", content: error });
  }
  // Send Success Status
  res.send({ status: "succeeded", content: "unsubscribed successfully" });
});

// @route     POST /send-email
// @desc      Send an email
// @access    Public
router.post("/send-email", async (req, res) => {
  const email = req.body.email;
  const subject = req.body.subject;
  const div = req.body.div;
  const style = req.body.style;
  // Configure Transport Options
  const transportOptions = {
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      type: "OAuth2",
      user: process.env.EMAIL_ADDRESS,
      serviceClient: process.env.EMAIL_CLIENT_ID,
      privateKey: process.env.EMAIL_PRIVATE_KEY
    }
  };
  // Create Transporter
  const transporter = nodemailer.createTransport(transportOptions);
  // Create the Text and HTML to send
  let message;
  try {
    message = await template({ subject, div, style });
  } catch (error) {
    return res.send({ status: "failed", content: error });
  }
  // Construct mail
  const mail = {
    from: `"CreateBase" <${process.env.EMAIL_ADDRESS}>`,
    to: `${email}`,
    subject: message.subject,
    text: message.text,
    html: message.html
  };
  // Send the mail
  try {
    await transporter.sendMail(mail);
  } catch (error) {
    return res.send({ status: "failed", content: error });
  }
  //
  return res.send({ status: "succeeded", content: "Email sent successfully" });
})


/*=========================================================================================
FUNCTION
=========================================================================================*/

const template = (object) => {
  return new Promise(async (resolve, reject) => {
    // Create the Subject
    const subject = object.subject;
    // Create the Text
    const text = ``;
    // Create the HTML
    const div = object.div;
    // Create the CSS Styling
    const css = object.style;
    // Combine the HTML and CSS
    const combined = div + css;
    // Inline the CSS
    const inlineCSSOptions = {
      url: "/",
    };
    let html;
    try {
      html = await inlineCSS(combined, inlineCSSOptions);
    } catch (error) {
      return reject(error);
    }
    // Return the email object
    return resolve({ subject, text, html });
  })
};

/*=========================================================================================
EXPORT ROUTE
=========================================================================================*/

module.exports = router;

/*=========================================================================================
END
=========================================================================================*/
