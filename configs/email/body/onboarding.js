// VARIABLES ================================================

if (process.env.NODE_ENV !== "production") require("dotenv").config();
let onboarding = {
	construct: undefined,
	welcome: undefined,
	baseTasksCompleted: undefined,
	allTasksCompleted: undefined,
};

// FUNCTIONS ================================================

onboarding.construct = function (object = {}) {
	return onboarding[object.tag](object);
};

onboarding.welcome = function () {
	return [
		`Welcome to the CreateBase Community!`,
		`Your journey with CreateBase is just beginning! 

Here are some next steps we recommend for you.


<b>Complete Onboarding tasks</b>

Check the Onboarding tab for tasks that will help you use CreateBase like a pro.

<u><b><a href="${process.env.PREFIX_APP}/onboarding">Get started ></a></b></u>


<b>Register or join a school</b>

To access our Projects and other platform features, you need to register a new (or join an existing) school group.

<u><b><a href="${process.env.PREFIX_APP}/my-groups">Manage your groups ></a></b></u>


<b>Discover a Project</b>

Are you interested in your students experience on our platform, or are you a student who wants to jump into a project yourself? Simply choose a project and click continue.

<u><b><a href="${process.env.PREFIX_APP}/browse">Find a project ></a></b></u>`,
	];
};

onboarding.baseTasksCompleted = function () {
	return [
		`Great work!`,
		`We’re stoked that you’ve taken some precious time to learn about our platform. We hope it wil be valuable to you!

If you have any feedback we would love to hear from you. Send a message on social media or email us anytime.`,
	];
};

onboarding.allTasksCompleted = function () {
	return [
		`ready... set... CREATE`,
		`Now we can really celebrate!


You’re ready to teach on the CreateBase platform! 

If you need any help our Support tab has your back.


Time flies and the fun is just beginning. Flick us a message on social media to tell us all about it!  We love to to hear about how our platform is improving the experiences of both teachers and students!`,
	];
};

// EXPORT ===================================================

module.exports = onboarding;

// END ======================================================
