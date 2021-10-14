// VARIABLES ================================================

if (process.env.NODE_ENV !== "production") require("dotenv").config();
let general = {
	construct: undefined,
	inquiry: undefined,
	accountVerification: undefined,
	passwordReset: undefined,
	educatorJoin: undefined,
	inviteEducator: undefined,
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

<b><a href="${process.env.APP_PREFIX}/verify/${object.email}__${object.code}">Click this link</a></b> to verify your account.

Or, you can enter your verification code <b><a href="${process.env.APP_PREFIX}/user/my-account/verification">here</a></b>.`,
	];
};

general.passwordReset = function (object = {}) {
	return [`Your Password Reset Code: ${object.code}`, `Click <b><a href='${process.env.APP_PREFIX}/auth/forgot-password/${object.email}/${object.code}'>this link</a></b> to change your password.`];
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

// EXPORT ===================================================

module.exports = general;

// END ======================================================
