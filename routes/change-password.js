/*=========================================================================================
REQUIRED MODULES
=========================================================================================*/

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
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

const Account = require("../model/Account.js");
const Customer = require("../model/Customer.js");

/*=========================================================================================
MIDDLEWARE
=========================================================================================*/

// @route     POST /change-password/validate-email
// @desc      Validate existence of an email
// @access    UNRESTRICTED
router.post("/change-password/validate-email", async (req, res) => {
  // DECLARE AND INITIALISE VARIABLES
  const email = req.body.email;
  // FETCH ACCOUNT
  try {
    await Account.validateEmail(email);
  } catch (data) {
    return res.send(data);
  }
  // SUCCESS HANDLER
  return res.send({ status: "succeeded", content: "valid email" });
});

// @route     POST /change-password/send-code
// @desc      Send the change password email
// @access    UNRESTRICTED
router.post("/change-password/send-code", async (req, res) => {
  // DECLARE AND INITIALISE VARIABLES
  const email = req.body.email;
  // CHECK IF ACCOUNT EXIST
  let account;
  try {
    account = await Account.validateEmail(email);
  } catch (data) {
    return res.send(data);
  }
  // GENERATE A NEW CODE
  account.changePassword.code = Account.generateCode();
  // FETCH USER DETAILS
  let customer;
  try {
    customer = await Customer.findOne({ accountId: account._id });
  } catch (error) {
    return res.send({ status: "error", content: error });
  }
  // SEND THE EMAIL
  // Configure Transport Options
  const transportOptions = {
    host: "smtp.gmail.com", port: 465, secure: true,
    auth: {
      type: "OAuth2", user: process.env.EMAIL_ADDRESS,
      serviceClient: process.env.EMAIL_CLIENT_ID,
      privateKey: process.env.EMAIL_PRIVATE_KEY
    }
  };
  // Create Transporter
  const transporter = nodemailer.createTransport(transportOptions);
  // Create the Text and HTML to send
  let message;
  try {
    message = await template(account, customer);
  } catch (data) {
    return res.send(data);
  }
  // Construct mail
  const mail = {
    from: `"CreateBase" <${process.env.EMAIL_ADDRESS}>`,
    to: `"${customer.displayName}" ${account.email}`,
    subject: message.subject,
    text: message.text,
    html: message.html
  };
  // Send the mail
  try {
    await transporter.sendMail(mail);
  } catch (error) {
    return res.send({ status: "error", content: error });
  }
  // SAVE ACCOUNT
  try {
    await account.save();
  } catch (error) {
    return res.send({ status: "error", content: error });
  }
  // SUCCESS HANDLER
  return res.send({ status: "succeeded", content: "code sent" });
});

// @route     POST /change-password/process
// @desc      Process the password change
// @access    UNRESTRICTED
router.post("/change-password/process", async (req, res) => {
  // DECLARE AND INITIALISE VARIABLES
  const email = req.body.email;
  const code = req.body.code;
  const password = req.body.password;
  // PROCESS SEND CODE
  let error = {
    errorEmail: "",
    errorCode: "",
    errorPassword: ""
  }
  // VALIDATE EMAIL AND FETCH ACCOUNT
  let account;
  try {
    account = await Account.validateEmail(email);
  } catch (data) {
    if (data.status === "error") return res.send(data);
    error.errorEmail = data.content;
    return res.send({ status: "failed", content: error });
  }
  // VALIDATE CODE
  if (!account.changePassword.code) {
    error.errorCode = "no code has been generated, resend the code";
    return res.send({ status: "failed", content: error });
  }
  if (account.changePassword.code != code) {
    error.errorCode = "incorrect code";
    return res.send({ status: "failed", content: error });
  }
  // VALIDATE PASSWORD
  try {
    await Account.validatePassword(password);
  } catch (data) {
    if (data.status === "error") return res.send(data);
    error.errorPassword = data.content;
    return res.send({ status: "failed", content: error });
  }
  // CHANGE PASSWORD
  account.password = password;
  account.changePassword.code = "";
  // SAVE ACCOUNT
  try {
    await account.save();
  } catch (error) {
    return res.send({ status: "error", content: error });
  }
  // SUCCESS HANDLER
  return res.send({ status: "succeeded", content: "password changed" });
});

/*=========================================================================================
FUNCTIONS
=========================================================================================*/

const template = (account, customer) => {
  return new Promise(async (resolve, reject) => {
    // Create the Subject
    const subject = `Password Change`;
    // Create the Text
    const text = ``;
    // Create the HTML
    const html = `
    <div id="body">
        <div id="main">
            <div id="content">
                <h1>Hi ${customer.displayName}</h1>
                <h2>Change your CreateBase account password</h2>
                <p id="caption">Click the button below to change your password</p>
    
                <a href="${process.env.SITE_PREFIX}change-password/${account.email}/${account.changePassword.code}"
                id="verify-btn"><span>CHANGE PASSWORD</span></a>
    
                <div id="divider">
                    <div class="horizontal-line"></div>
                    <span>or</span>
                    <div class="horizontal-line"></div>
                </div>
    
                <h3>Enter the change password code <a href="${process.env.SITE_PREFIX}change-password/${account.email}">here</a></h3>
    
                <ul>
                    <li>${account.changePassword.code[0]}</li> 
                    <li>${account.changePassword.code[1]}</li>
                    <li>${account.changePassword.code[2]}</li>
                    <li>${account.changePassword.code[3]}</li>
                    <li>${account.changePassword.code[4]}</li>
                    <li>${account.changePassword.code[5]}</li>
                </ul>
            </div>
        </div>
    </div>
    `;
    // Create the CSS Styling
    const css = `
    <style>
    *{
      margin: 0;
    }
    #body{
      font-family: Arial, Helvetica, sans-serif;
      background-color: #F0F0F0;
      padding: 2em 0;
      width: 100%;
    }
    #main{
      min-width: 300px;
      width: 40%;
      max-width: 800px;
      margin: auto;
      background-color: #FFFFFF;
    }
    #content{
      padding: 2em;
      text-align: center;
    }
    h1{        
      font-size: calc(16px + 6 * ((100vw - 320px) / 680));
      padding-top: 1.5em;
      color: #322D41;
    }
    h2{
      font-size: calc(14px + 4 * ((100vw - 320px) / 680));
      padding-top: 1.2em;
      font-weight: 400;
      color: #322D41;
    }
    h3{
      font-size: calc(10px + 2 * ((100vw - 320px) / 680));
      padding-top: 1.5em;
      color: #322D41;
    }
    #caption{
      font-size: calc(10px + 2 * ((100vw - 320px) / 680));
      padding: 1.5em 0 3em;
      color:#C7C2D5;
    }
    #verify-btn{
      text-decoration: none;
      padding: 1.5em 5em;
      letter-spacing: 0.1em;
      border-radius: 1.25em;
      background-color: #4e4ed6;
      color: #FFFFFF;
      font-size: calc(10px + 1 * ((100vw - 320px) / 680));
    }
    #divider{
      font-size: calc(10px + 2 * ((100vw - 320px) / 680));
      padding: 3em 0 1em 0;
      color: #322D41;
    }
    .horizontal-line{
      display: inline-block;
      width: 1em;
      margin-bottom: 0.25em;
      border-bottom: thin solid #322D41;
    }
    ul{
      padding: 2em;
    }
    li{
      font-size: calc(14px + 4 * ((100vw - 320px) / 680));
      color: #322D41;
      display: inline-block;
      list-style-type: none;
      font-weight: 700;
      text-decoration: underline;
      width: calc(18px + 2 * ((100vw - 320px) / 680));
    }

    @media screen and (min-width: 1000px){
      h1{        
        padding-top: 1.5em;
      }
      h2{
        padding-top: 1em;
      }
      h3{
        font-size: 0.875;
        padding-top: 1.5em;
      }
      # caption{
        padding: 1.5em 0 3em;
      }
    }
    </style>
    `;
    // Combine the HTML and CSS
    const combined = html + css;
    // Inline the CSS
    const inlineCSSOptions = {
      url: "/",
    };
    let inline;
    try {
      inline = await inlineCSS(combined, inlineCSSOptions);
    } catch (error) {
      return reject({ status: "error", content: error });
    }
    // Return the email object
    return resolve({ subject, text, html: inline });
  });
}

/*=========================================================================================
EXPORT ROUTE
=========================================================================================*/

module.exports = router;

/*=========================================================================================
END
=========================================================================================*/
