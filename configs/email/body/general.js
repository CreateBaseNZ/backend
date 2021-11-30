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

Or, you can enter your verification code <b><a href="${process.env.APP_PREFIX}/auth/verify">here</a></b>.`,
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
	return [
		"We have a big announcement! Lots of new features to improve your class experience!",
		`First off, I would like to thank you for being one of our early users! It means a lot for our team to see teachers and students get value from our solution.


After months of iteratively getting feedback from teachers and improving our solution, we are ready to officially launch the CreateBase platform! Next week, on the <b>6th of December</b>, our <u>new and improved platform</u> will be live on https://app.createbase.co.nz/! We have added new features such as:
<ul><li><b>My Classes</b> - Admins and teachers can create and add their students to multiple classes on our platform</li><li><b>Progress Tracking</b> - Classes enable teachers to track the progress of their students throughout each Project</li><li><b>Global Support</b> - You can now register and join schools on our platform from anywhere in the world</li></ul>and much more. See the complete list of features <u><b><a href="https://createbase.co.nz/release-notes">here</a></b></u>. We will also release a new project called AimBot, which brings together programming and trigonometry to solve a problem with disease-spreading mosquitos!


We’ll be resetting our database on the day of launch, which will, unfortunately, <b>delete any existing accounts on our platform</b>. This means that you and your students will have to create new accounts to use our new platform once it has launched. You will also have to <u>re-register your school on our platform</u>. We apologise for this inconvenience but believe that the new and upcoming features enabled by this reset will be worth the trouble!


We will let you know once we have launched the new platform! If you are not interested and do not wish to be notified, let us know by replying to this email.`,
	];
};

general.test = function () {
	return ["Test", `Just testing.`];
};

// EXPORT ===================================================

module.exports = general;

// END ======================================================
