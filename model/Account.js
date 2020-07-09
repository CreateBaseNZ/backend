/*=========================================================================================
REQUIRED MODULES
=========================================================================================*/

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const moment = require("moment-timezone");
const nodemailer = require("nodemailer");
const inlineCSS = require("inline-css");

/*=========================================================================================
VARIABLES
=========================================================================================*/

const Schema = mongoose.Schema;

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

/*=========================================================================================
EXTERNAL MODELS
=========================================================================================*/

const Customer = require("./Customer.js");

/*=========================================================================================
CREATE ACCOUNT MODEL
=========================================================================================*/

const AccountSchema = new Schema({
  type: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  changePassword: {
    code: { type: String, default: "" }
  },
  verification: {
    status: { type: Boolean, default: false },
    code: { type: String, required: true }
  },
  date: {
    created: { type: String, required: true },
    lastVisited: { type: String, required: true }
  },
  wallet: {
    code: { type: String, required: true },
    bank: {
      number: { type: String, default: "" },
      status: { type: Boolean, default: false }
    }
  }
});

/*=========================================================================================
MIDDLEWARE
=========================================================================================*/

AccountSchema.pre("save", async function (next) {
  // Check if password is modified
  if (this.isModified("password")) {
    // Hash the password
    this.password = await bcrypt.hash(this.password, 8);
  }
  // Exit once hashing is completed
  next();
});

/*=========================================================================================
STATICS
=========================================================================================*/

// @FUNC  build
// @TYPE  STATICS - PROMISE - ASYNC
// @DESC  
AccountSchema.statics.build = function (object = {}, save = true) {
  return new Promise(async (resolve, reject) => {
    // VALIDATION
    try {
      await this.validateType(object.type);
    } catch (data) {
      return reject(data);
    }
    try {
      await this.validateEmail(object.email, false);
    } catch (data) {
      return reject(data);
    }
    try {
      await this.validatePassword(object.password);
    } catch (data) {
      return reject(data);
    }
    // GENERATE CODES
    // verification
    const verificationCode = this.generateCode();
    object.verification = { code: verificationCode };
    // wallet
    let walletCode;
    try {
      walletCode = await this.generateWalletCode();
    } catch (data) {
      return reject(data);
    }
    object.wallet = { code: walletCode };
    // SET DATES
    const date = moment().tz("Pacific/Auckland").format();
    object.date = {
      created: date,
      lastVisited: date
    }
    // CREATE THE ACCOUNT
    const account = new this(object);
    if (save) {
      try {
        await account.save();
      } catch (error) {
        return reject({ status: "error", content: error });
      }
    }
    // SUCCESS HANDLER
    return resolve(account);
  });
}

// @FUNC  verification
// @TYPE  STATICS - PROMISE - ASYNC
// @DESC  Sends the verification email
// @ARGU  
AccountSchema.statics.verification = function (email) {
  return new Promise(async (resolve, reject) => {
    // FETCH ACCOUNT AND CUSTOMER INSTANCES
    let account;
    try {
      account = await this.findOne({ email });
    } catch (error) {
      return reject({ status: "error", content: error });
    }
    if (!account) return reject({ status: "failed", content: "no account found" });
    let customer;
    try {
      customer = await Customer.findOne({ accountId: account._id });
    } catch (error) {
      return reject({ status: "error", content: error });
    }
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
      message = await template(account, customer);
    } catch (data) {
      return reject(data);
    }
    // Construct mail
    const mail = {
      from: `"CreateBase" <${process.env.EMAIL_ADDRESS}>`,
      to: `"${customer.displayName}" ${email}`,
      subject: message.subject,
      text: message.text,
      html: message.html
    };
    // Send the mail
    try {
      await transporter.sendMail(mail);
    } catch (error) {
      return reject({ status: "error", content: error });
    }
    return resolve();
  })
}

// @FUNC  verify
// @TYPE  STATICS - PROMISE - ASYNC
// @DESC  Verifies the account
// @ARGU  
AccountSchema.statics.verify = function (email, code) {
  return new Promise(async (resolve, reject) => {
    // FETCH THE ACCOUNT ASSOCIATED TO THE EMAIL
    let account;
    try {
      account = await this.findOne({ email });
    } catch (error) {
      return reject(error);
    }
    // COMPARE CODE
    if (account.verification.code !== code) return reject("incorrect code");
    // CHECK IF ACCOUNT IS ALREADY VERIFIED
    if (account.verification.status) return resolve();
    // UPDATE ACCOUNT VERIFICATION STATUS
    account.verification.status = true;
    // SAVE ACCOUNT UPDATE
    try {
      await account.save();
    } catch (error) {
      return reject(error);
    }
    // UPDATE CUSTOMER'S MAIL SUBSCRIPTION
    // Fetch Customer
    let customer;
    try {
      customer = await Customer.findOne({ accountId: account._id });
    } catch (error) {
      return reject(error);
    }
    // Subscribe Customer
    try {
      await customer.subscribeMail(account.email);
    } catch (error) {
      return reject(error);
    }
    // Save Customer Updates
    try {
      await customer.save();
    } catch (error) {
      return reject(error);
    }
    // RETURN RESOLVE
    return resolve();
  })
}

/* ----------------------------------------------------------------------------------------
CODE GENERATION
---------------------------------------------------------------------------------------- */

// @FUNC  generateCode
// @TYPE  STATICS
// @DESC  
AccountSchema.statics.generateCode = function () {
  return String(Math.floor(100000 + Math.random() * 900000));
}

// @FUNC  generateWalletCode
// @TYPE  STATICS
// @DESC  
AccountSchema.statics.generateWalletCode = function () {
  return new Promise(async (resolve, reject) => {
    let code;
    let generate = true;
    while (generate) {
      code = String(Math.floor(100000 + Math.random() * 900000));
      let account;
      try {
        account = await this.findOne({ "wallet.code": code });
      } catch (error) {
        return reject({ status: "error", content: error });
      }
      if (!account) generate = false;
    }
    // SUCCESS HANDLER
    return resolve(code);
  });
}

/* ----------------------------------------------------------------------------------------
VALIDATION
---------------------------------------------------------------------------------------- */

// @FUNC  validateType
// @TYPE  STATICS
// @DESC  Validates an type input
AccountSchema.statics.validateType = function (type = "") {
  return new Promise((resolve, reject) => {
    // DECLARE AND INITIALISE VARIABLES
    const types = ["admin", "customer", "partner"];
    // CHECK FOR TYPE INPUT
    if (!type) return reject({ status: "failed", content: "type is required" });
    // VALIDATIONS
    if ((types.indexOf(type)) == -1) return reject({ status: "failed", content: "invalid type" });
    // SUCCESS HANDLER
    return resolve();
  });
}

// @FUNC  validateEmail
// @TYPE  STATICS - PROMISE - ASYNC
// @DESC  Validates an email input
AccountSchema.statics.validateEmail = function (email = "", exist = true) {
  return new Promise(async (resolve, reject) => {
    // DECLARE AND INITIALISE VARIABLES
    let emailRE = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    // CHECK FOR EMAIL INPUT
    if (!email) return reject({ status: "failed", content: "email is required" });
    // CHECK FOR VALID EMAIL
    if (!emailRE.test(String(email).toLowerCase())) return reject({ status: "failed", content: "invalid email" });
    // CHECK IF EMAIL EXIST
    let account;
    try {
      account = await this.findOne({ email });
    } catch (error) {
      return reject({ status: "error", content: error });
    }
    if (exist) {
      // CHECK IF EMAIL DOES NOT EXIST
      if (!account) return reject({ status: "failed", content: "email is not registered" });
    } else {
      // CHECK IF EMAIL ALREADY EXIST
      if (account) return reject({ status: "failed", content: "email is registered" });
    }
    // SUCCESS HANDLER
    return resolve(account);
  });
}

// @FUNC  validatePassword
// @TYPE  STATICS - PROMISE - ASYNC
// @DESC  Validates an password input
AccountSchema.statics.validatePassword = function (password = "") {
  return new Promise(async (resolve, reject) => {
    // CHECK FOR PASSWORD INPUT
    if (!password) return reject({ status: "failed", content: "password is required" });
    // CHECK IF PASSWORD HAS VALID STRENGTH
    // calculate score
    let score = 0;
    // Award every unique letter until 5 repetitions
    let letters = new Object();
    for (let i = 0; i < password.length; i++) {
      letters[password[i]] = (letters[password[i]] || 0) + 1;
      score += 5.0 / letters[password[i]];
    }
    // Bonus points for mixing it up
    let variations = {
      digits: /\d/.test(password),
      lower: /[a-z]/.test(password),
      upper: /[A-Z]/.test(password),
      nonWords: /\W/.test(password)
    }
    variationCount = 0;
    for (let check in variations) {
      variationCount += (variations[check] == true) ? 1 : 0;
    }
    score += (variationCount - 1) * 10;
    if (score <= 40) return reject({ status: "failed", content: "password is too weak" });
    // SUCCESS HANDLER
    return resolve();
  });
}

/* ========================================================================================
METHODS
======================================================================================== */

// @FUNC  login
// @TYPE  STATICS - PROMISE - ASYNC
// @DESC  Verifies the account
// @ARGU  
AccountSchema.methods.login = function (password) {
  return new Promise(async (resolve, reject) => {
    let match;
    try {
      match = await bcrypt.compare(password, this.password);
    } catch (error) {
      return reject(error);
    }
    // IF MATCH IS SUCCESSFUL, UPDATE THE LAST VISITED DATE
    if (match) {
      const now = moment().tz("Pacific/Auckland").format();
      this.date.lastVisited = now;
      try {
        await this.save();
      } catch (error) {
        return reject(error);
      }
    }
    return resolve(match);
  })
};

/* ----------------------------------------------------------------------------------------
UPDATE
---------------------------------------------------------------------------------------- */

// @FUNC  updateEmail
// @TYPE  METHODS - NORMAL
// @DESC  
// @ARGU  
AccountSchema.methods.updateEmail = function (email) {
  // UPDATE
  this.email = email;
  this.verification.code = Math.floor(100000 + Math.random() * 900000);
  this.verification.status = false;
  // RETURN SUCCESS;
  return;
}

/* ----------------------------------------------------------------------------------------
VALIDATE
---------------------------------------------------------------------------------------- */

// @FUNC  validatePassword
// @TYPE  STATICS - PROMISE - ASYNC
// @DESC  Verifies the account
// @ARGU  
AccountSchema.methods.validatePassword = function (password) {
  return new Promise(async (resolve, reject) => {
    // CHECK IF PASSWORD MATCH
    let match;
    try {
      match = await bcrypt.compare(password, this.password);
    } catch (error) {
      return reject(error);
    }
    if (!match) return resolve("incorrect password");
    return resolve("password match");
  })
}

/*=========================================================================================
FUNCTIONS
=========================================================================================*/

const template = (account, customer) => {
  return new Promise(async (resolve, reject) => {
    // Create the Subject
    const subject = `Account Verification`;
    // Create the Text
    const text = ``;
    // Create the HTML
    const html = `
    <div id="body">
        <div id="main">
            <div id="content">
                <h1>Hi ${customer.displayName}</h1>
                <h2>Verify your CreateBase account</h2>
                <p id="caption">Click the button below to verify your account</p>
    
                <a href="${process.env.SITE_PREFIX}account-verification/${account.email}/${account.verification.code}
                "id="verify-btn"><span>VERIFY</span></a>
    
                <div id="divider">
                    <div class="horizontal-line"></div>
                    <span>or</span>
                    <div class="horizontal-line"></div>
                </div>
    
                <h3>Enter the verification code <a href="${process.env.SITE_PREFIX}verification">here</a></h3>
    
                <ul>
                    <li>${account.verification.code[0]}</li> 
                    <li>${account.verification.code[1]}</li>
                    <li>${account.verification.code[2]}</li>
                    <li>${account.verification.code[3]}</li>
                    <li>${account.verification.code[4]}</li>
                    <li>${account.verification.code[5]}</li>
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
  })
};

/*=========================================================================================
EXPORT ACCOUNT MODEL
=========================================================================================*/

module.exports = Account = mongoose.model("accounts", AccountSchema);

/*=========================================================================================
END
=========================================================================================*/
