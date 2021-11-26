// VARIABLES ================================================

if (process.env.NODE_ENV !== "production") require("dotenv").config();
let general = {
	construct: undefined,
	inquiry: undefined,
	accountVerification: undefined,
	passwordReset: undefined,
	organisationCreated: undefined,
	educatorJoin: undefined,
	inviteEducator: undefined,
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

general.organisationCreated = function (object) {
	return [
		`${object.group} x CreateBase`,
		`Let me be the first to welcome you to the CreateBase platform ${object.group}. We’re looking forward to working for you. 

Here are some next steps to help you get up and running as soon as possible.

<b>Projects Unlocked</b>
Check out the projects you’ve unlocked by registering your school

<b>Spread the word</b>
Lets make the platform feel less empty. Add some colleagues to your group.`,
	];
};

general.educatorJoin = function (object = {}) {
	return [
		`${object.inviter} is requesting to join you at ${object.orgName}`,
		`${object.inviter} requested to join you and your team at ${object.orgName}!

Click <b><a href='${process.env.APP_PREFIX}/invite/educator/${object.url}'>this link</a></b> to accept this request!`,
	];
};

general.inviteEducator = function (object = {}) {
	return [
		`${object.joiner} invited you to join ${object.orgName} on the CreateBase platform!`,
		`${object.joiner} invited you to join ${object.orgName} on the CreateBase platform!

Click <b><a href='${process.env.APP_PREFIX}/invite/educator/${object.url}'>this link</a></b> to join!`,
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
