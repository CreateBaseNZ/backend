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
const Account = require("../model/Account.js");
const Customer = require("../model/Customer.js");

/*=========================================================================================
MIDDLEWARE
=========================================================================================*/

const verifiedAccess = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.verification.status) {
      return next();
    } else {
      return res.redirect("/verification");
    }
  } else {
    return res.redirect("/login");
  }
};

const restrictedAccess = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return res.redirect("/login");
  }
};

/*=========================================================================================
ROUTES
=========================================================================================*/

// @route     POST /subscribe/mailing-list
// @desc      Subscribing to mailing list
// @access    Public
router.post("/subscribe/mailing-list", async (req, res) => {
  const email = (req.isAuthenticated()) ? req.user.email : req.body.email;
  // VALIDATE
  if (!email) return res.send({ status: "failed", content: "email required" });
  // Check if the email is already in the mailing list
  let mail;
  try {
    mail = await Mail.findByEmail(email);
  } catch (error) {
    return res.send({ status: "failed", content: error });
  }
  if (mail) {
    return res.send({ status: "success", content: "already subscribed" });
  }
  // Check if the user is registered
  let account;
  try {
    account = await Account.findByEmail(email);
  } catch (error) {
    return res.send({ status: "failed", content: error });
  }
  if (account) {
    const newMail = new Mail({
      accountId: account._id,
      email,
    });

    try {
      await newMail.save();
    } catch (error) {
      return res.send({ status: "failed", content: error });
    }

    // Update user subscription mailing status
    let customer;
    try {
      customer = await Customer.findByAccountId(account._id);
    } catch (error) {
      return res.send({ status: "failed", content: error });
    }

    customer.subscription = {
      mail: true,
    };

    try {
      await customer.save();
    } catch (error) {
      return res.send({ status: "failed", content: error });
    }

    return res.send({ status: "success", content: "subscribed" });
  }
  // If user is not registered and not subscribed
  const newMail = new Mail({ email });

  try {
    await newMail.save();
  } catch (error) {
    return res.send({ status: "failed", content: error });
  }

  return res.send({ status: "success", content: "subscribed" });
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
  // res.send({ status: "success", content: "unsubscribed successfully" });
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
  res.send({ status: "success", content: "unsubscribed successfully" });
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
  return res.send({ status: "success", content: "Email sent successfully" });
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
