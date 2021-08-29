/* ==========================================================
MODULES
========================================================== */

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const moment = require("moment-timezone");
const inlineCSS = require("inline-css");

/* ==========================================================
VARIABLES
========================================================== */

const Schema = mongoose.Schema;
const email = require("../configs/email.js");

/* ==========================================================
OTHER MODELS
========================================================== */

const User = require("./User.js");
const Mail = require("./Mail.js");

/* ==========================================================
MODEL
========================================================== */

const AccountSchema = new Schema({
  type: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  verification: {
    status: { type: Boolean, default: false },
    code: { type: String, default: "" }
  },
  changePassword: {
    status: { type: Boolean, default: false },
    code: { type: String, default: "" }
  },
  date: {
    created: { type: String, required: true },
    visited: { type: String, required: true }
  },
  deactivated: {
    status: { type: Boolean, default: true },
    code: { type: String, default: "" }
  }
});

/* ==========================================================
MIDDLEWARE
========================================================== */

AccountSchema.pre("save", async function (next) {
  // Check if password has been modified
  if (this.isModified("password")) {
    // Hash the new password and update password
    this.password = await bcrypt.hash(this.password, 8);
  }
  // Exit the middleware
  return next();
});

/* ==========================================================
STATICS
========================================================== */

// @func  build
// @type  STATICS - PROMISE - ASYNC
// @desc  This function creates the base of the account document
AccountSchema.statics.build = function (object = {}, save = true) {
  return new Promise(async (resolve, reject) => {
    // Validate Inputs
    // Type Validation
    try {
      await this.validateType(object.type);
    } catch (data) {
      return reject(data);
    }
    // Email Validation
    try {
      await this.validateEmail(object.email, false);
    } catch (data) {
      return reject(data);
    }
    // Password Validation
    try {
      await this.validatePassword(object.password);
    } catch (data) {
      return reject(data);
    }
    // Create required variables
    // Date
    const date = moment().tz("Pacific/Auckland").format();
    object.date = { created: date, visited: date };
    // Create the Account Instance
    const account = new this(object);
    // Build the User Instance
    const userObject = { owner: account._id, name: object.name, displayName: object.name };
    let user;
    try {
      user = await User.build(userObject, false);
    } catch (data) {
      return reject(data);
    }
    if (save) {
      const promises = [account.save(), user.save()];
      try {
        await Promise.all(promises);
      } catch (error) {
        return reject({ status: "error", content: error });
      }
    }
    // Success handler
    resolve(account);
    // Send Verification Email
    try {
      await this.sendVerificationEmail(account.email);
    } catch (data) {
      return console.log(data);
    }
    // Exit function
    return;
  });
};

// @func  reform
// @type  STATICS - PROMISE - ASYNC
// @desc
AccountSchema.statics.reform = function (object = {}, save = true) {
  return new Promise (async (resolve, reject) => {
    // Fetch account
    let account;
    try {
      account = await this.fineOne({_id: object.id});
    } catch (error) {
      return reject({status: "error", content: error});
    }
    // Validate if account is found
    if (!account) return reject({status: "error", content: "There is no account found with the provided id"});
    // Update account
    for (const property in object.update) {
      account[property] = object.update[property];
    }
    // Save account
    if (save) {
      try {
        await account.save();
      } catch (error) {
        return reject({status: "error", content: error});
      }
    }
    // Success handler
    return resolve(account);
  });
}

// @func  welcomeNotification
// @type  STATICS - PROMISE - ASYNC
// @desc
AccountSchema.statics.welcomeNotification = function (object = {}) {
  return new Promise(async (resolve, reject) => {
    // Create notification
    const notification = {
      owner: object.id,
      type: "standard",
      title: "Welcome to CreateBase",
      messange: "Hello World",
      date: { inboxed: moment().tz("Pacific/Auckland").format() },
      opened: false,
      status: "inbox"
    }
    // Build notification
    try {
      await Notification.build(notification);
    } catch (data) {
      return reject(data);
    }
    // Success handler
    return resolve();
  });
}

// @func  welcomeEmail
// @type  STATICS - PROMISE - ASYNC
// @desc
AccountSchema.statics.welcomeEmail = function (object = {}) {
  return new Promise(async (resolve, reject) => {
    // Draft the email
    let emailObject;
    try {
      emailObject = await this.draftWelcomeEmail(object);
    } catch (data) {
      return reject(data);
    }
    // Send the email
    try {
      await email.send(emailObject);
    } catch (data) {
      return reject(data);
    }
    // Success handler
    return resolve();
  });
}

// @func  draftWelcomeEmail
// @type  STATICS - PROMISE - ASYNC
// @desc
AccountSchema.statics.draftWelcomeEmail = function (object = {}) {
  return new Promise(async (resolve, reject) => {
    // Fetch user
    let user;
    try {
      user = await User.findOne({ owner: object.id });
    } catch (error) {
      return reject({ status: "error", content: error });
    }
    // Create the Subject
    const subject = `Welcome to CreateBase ${user.name}`;
    // Create the Text
    const text = ``;
    // Create the HTML
    const html = `<div>Hello</div>`;
    // Create the CSS Styling
    const css = `<style>div{font-size: 14px;color: #322D41;}</style>`;
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
    return resolve({ email: object.email, subject, text, html: inline });
  });
}

/* ----------------------------------------------------------
VALIDATION
---------------------------------------------------------- */

// @func  validateType
// @type  STATICS - PROMISE
// @desc  
AccountSchema.statics.validateType = function (type = "") {
  return new Promise((resolve, reject) => {
    // Define the account types
    const types = ["admin", "user"];
    // Check for type input
    if (!type) return reject({ status: "failed", content: "Please provide the type of the account" });
    // Check if input is valid
    if ((types.indexOf(type)) == -1) return reject({ status: "failed", content: "This type is not valid" });
    // Success handler
    return resolve();
  });
};

// @func  validateEmail
// @type  STATICS - PROMISE - ASYNC
// @desc  
AccountSchema.statics.validateEmail = function (email = "", exist = true) {
  return new Promise(async (resolve, reject) => {
    let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!email) return reject({ status: "failed", content: "Please enter your email address" });
    if (!regex.test(String(email).toLowerCase())) return reject({ status: "failed", content: "Please enter your email address in format: yourname@example.com" });
    let account;
    try {
      account = await this.findOne({ email });
    } catch (error) {
      return reject({ status: "error", content: error });
    }
    if (exist) {
      // Check if email doesn't exist
      if (!account) return reject({ status: "failed", content: "This email address is not registered" });
    } else {
      // Check if email is already in use
      if (account) return reject({ status: "failed", content: "This email address is already registered" });
    }
    // Success handler
    return resolve(account);
  });
};

// @func  validatePassword
// @type  STATICS - PROMISE - ASYNC
// @desc  
AccountSchema.statics.validatePassword = function (password = "") {
  return new Promise(async (resolve, reject) => {
    // CHECK FOR PASSWORD INPUT
    if (!password) return reject({ status: "failed", content: "Please enter your password" });
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
    if (score <= 40) return reject({ status: "failed", content: "This password is too weak" });
    // SUCCESS HANDLER
    return resolve();
  });
};

/* ----------------------------------------------------------
PASSWORD
---------------------------------------------------------- */

// @func  initialiseChangePassword
// @type  STATICS - PROMISE - ASYNC
// @desc
AccountSchema.statics.initialiseChangePassword = function (account = {}) {
  return new Promise(async (resolve, reject) => {
    // Prepare the change password code and status
    account.changePassword.code = this.generateCode();
    account.changePassword.status = true;
    // Save the changes in account
    try {
      await account.save();
    } catch (error) {
      return reject({ status: "error", content: error });
    }
    // Draft the email that will be sent to the user
    let emailObject;
    try {
      emailObject = await this.draftChangePasswordEmail(account);
    } catch (data) {
      return reject(data);
    }
    emailObject.email = account.email;
    // Send the drafted email
    try {
      await email.send(emailObject);
    } catch (data) {
      return reject(data);
    }
    // Success handler
    return resolve();
  });
}

// @func  draftChangePasswordEmail
// @type  STATICS - PROMISE - ASYNC
// @desc
AccountSchema.statics.draftChangePasswordEmail = function (account = {}) {
  return new Promise(async (resolve, reject) => {
    // Fetch user
    let user;
    try {
      user = await User.findOne({ owner: account._id });
    } catch (error) {
      return reject({ status: "error", content: error });
    }
    // Create the Subject
    const subject = `Change Password (Code: ${account.changePassword.code})`;
    // Create the Text
    const text = ``;
    // Create the HTML
    const html = `
<div id="body">
    <div id="main">
        <div id="content">
            <h1>Hi ${user.name}</h1>
            <h2>Change your CreateBase account password</h2>
            <p id="caption">Click the button below to change your account password</p>

            <a href="${process.env.SITE_PREFIX}change-password/${account.changePassword.code}
            "id="verify-btn"><span>Change</span></a>

            <div id="divider">
                <div class="horizontal-line"></div>
                <span>or</span>
                <div class="horizontal-line"></div>
            </div>

            <h3>Enter the change password code <a href="${process.env.SITE_PREFIX}change-password">here</a></h3>

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

// @func  changePassword
// @type  STATICS - PROMISE - ASYNC
// @desc
AccountSchema.statics.changePassword = function (object = {}, save = true) {
  return new Promise(async (resolve, reject) => {
    // VALIDATION
    // Validate email
    let account;
    try {
      account = await this.validateEmail(object.email);
    } catch (data) {
      return reject(data);
    }
    // Validate password
    try {
      await this.validatePassword(object.password);
    } catch (data) {
      return reject(data);
    }
    // Validate code
    const match = account.changePassword.code === object.code;
    if (!match) return reject({ status: "failed", content: "This code is incorrect" });
    if (!account.changePassword.status) return reject({ status: "failed", content: "This code has expried. Please send a new change password request" });
    // UPDATE
    account.password = object.password;
    account.changePassword.status = false;
    // Save
    if (save) {
      try {
        await account.save();
      } catch (error) {
        return reject({ status: "error", content: error });
      }
    }
    // SUCCESS
    return resolve();
  });
}

/* ----------------------------------------------------------
VERIFICATION
---------------------------------------------------------- */

// @func  sendVerificationEmail
// @type  STATICS - PROMISE - ASYNC
// @desc
AccountSchema.statics.sendVerificationEmail = function (emailAddress = "") {
  return new Promise(async (resolve, reject) => {
    // Validate the email, and fetch the associated account
    let account;
    try {
      account = await this.validateEmail(emailAddress);
    } catch (data) {
      return reject(data);
    }
    // Fetch the user associated with the account
    let user;
    try {
      user = await User.findOne({ owner: account._id });
    } catch (error) {
      return reject({ status: "error", content: error });
    }
    // Generate a new verification code
    account.verification.code = this.generateCode();
    // Update the account with the new verification code
    try {
      await account.save();
    } catch (error) {
      return reject({ status: "error", content: error });
    }
    // Create the verification email
    let emailObject;
    try {
      emailObject = await this.draftVerificationEmail(account, user);
    } catch (data) {
      return reject(data);
    }
    // Send the user the email
    try {
      await email.send(emailObject);
    } catch (data) {
      return reject(data);
    }
    // Success handler
    return resolve();
  });
}

// @func  draftVerificationEmail
// @type  STATICS - PROMISE - ASYNC
// @desc
AccountSchema.statics.draftVerificationEmail = function (account = {}, user = {}) {
  return new Promise(async (resolve, reject) => {
    // Create the Subject
    const subject = `Account Verification (Code: ${account.verification.code})`;
    // Create the Text
    const text = ``;
    // Create the HTML
    const html = `
    <div id="body">
        <div id="main">
            <div id="content">
                <h1>Hi ${user.name}</h1>
                <h2>Verify your CreateBase account</h2>
                <p id="caption">Click the button below to verify your account</p>

                <a href="${process.env.SITE_PREFIX}verification/${account.email}/${account.verification.code}
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
    return resolve({ email: account.email, subject, text, html: inline });
  });
}

// @func  verify
// @type  STATICS - PROMISE - ASYNC
// @desc
AccountSchema.statics.verify = function (object = {}, save = true) {
  return new Promise(async (resolve, reject) => {
    // Validate inputs
    // TO DO: Validate code (Regex)
    // Validate email
    let account;
    try {
      account = await this.validateEmail(object.email);
    } catch (data) {
      return reject(data);
    }
    // Validate code
    if (account.verification.status) return reject({ status: "failed", content: "This account is already verified" });
    const match = account.verification.code === object.code;
    if (!match) return reject({ status: "failed", content: "This code is incorrect" });
    // UPDATE
    account.verification.status = true;
    // Save
    if (save) {
      try {
        await account.save();
      } catch (error) {
        return reject({ status: "error", content: error });
      }
    }
    // SUCCESS
    resolve();
    // Subscribe users to the newsletter
    try {
      await Mail.subscribe({ email: account.email, owner: account._id });
    } catch (data) {
      console.log(data);
    }
    // Create the welcome notification
    try {
      await this.welcomeNotification({ id: account._id });
    } catch (data) {
      console.log(data);
    }
    // Send a welcome email
    try {
      await this.welcomeEmail({ id: account._id, email: account.email });
    } catch (data) {
      console.log(data);
    }
    // Exit function
    return;
  });
}

/* ----------------------------------------------------------
OTHER
---------------------------------------------------------- */

// @func  generateCode
// @type  STATICS
// @desc
AccountSchema.statics.generateCode = function () {
  return String(Math.floor(100000 + Math.random() * 900000));
}

/* ==========================================================
METHODS
========================================================== */

AccountSchema.methods.validatePassword = function (password = "") {
  return new Promise(async (resolve, reject) => {
    let match;
    try {
      match = await bcrypt.compare(password, this.password);
    } catch (error) {
      return reject({ status: "error", content: error });
    }
    // Success handler
    return resolve(match);
  });
}

/* ==========================================================
EXPORT
========================================================== */

module.exports = Account = mongoose.model("accounts", AccountSchema);

/* ==========================================================
END
========================================================== */