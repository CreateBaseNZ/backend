// VARIABLES ================================================

if (process.env.NODE_ENV !== "production") require("dotenv").config();
let general = {
	construct: undefined,
	inquiry: undefined,
	accountVerification: undefined,
	passwordReset: undefined,
	organisationVerified: undefined,
	notifyUserBase: undefined,
	test: undefined,
};

// FUNCTIONS ================================================

general.construct = function (object = {}) {
	return general[object.tag](object);
};

general.inquiry = function (object = {}) {
	return [`Thank you for your inquiry (#${object.number}).`, `Thank you for the message, we will get back to you as soon as possible!`];
};

general.accountVerification = function (object = {}) {
	return [
		`Your Verification Code: ${object.code}`,
		`Thank you for creating an account with us! Before we get started, please verify your account.

<b><a href="${process.env.APP_PREFIX}/auth/verify?email=${object.recipient}&code=${object.code}">Click this link</a></b> to verify your account.

Or, you can enter your verification code <b><a href="${process.env.APP_PREFIX}/user/my-account/verification">here</a></b>.`,
	];
};

general.passwordReset = function (object = {}) {
	return [
		`Your Password Reset Code: ${object.code}`,
		`Click <b><a href='${process.env.APP_PREFIX}/auth/forgot-password?email=${object.recipient}&code=${object.code}'>this link</a></b> to change your password.`,
	];
};

general.organisationVerified = function (object) {
	return [
		`${object.group} has been verified!`,
		`Let me be the first to welcome ${object.group} to the CreateBase platform.

We’re looking forward to working with you!


Here are some next steps to help you get up and running.


<b>Projects Unlocked</b>

Check out the projects you’ve unlocked by registering your school.

<u><b><a href="${process.env.APP_PREFIX}/browse">Browse Projects ></a></b></u>


<b>Spread the word</b>

Lets make the platform feel less empty. Add some colleagues or students to your group.

<u><b><a href="${process.env.APP_PREFIX}/manage-group/students">Manage Groups ></a></b></u>`,
	];
};

general.notifyUserBase = function () {
	return ["We have an important announcement!", `No contents yet!`];
};

general.test = function () {
	return ["Test", `Just testing.`];
};

// EXPORT ===================================================

module.exports = general;

// END ======================================================
