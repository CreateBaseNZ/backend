// VARIABLES ================================================

if (process.env.NODE_ENV !== "production") require("dotenv").config();
let onboarding = {
	construct: undefined,
	welcome: undefined,
	defaultOnboardingCompleted: undefined,
	organisationCreated: undefined,
	organisationDetail: undefined,
	educatorAccept: undefined,
};

// FUNCTIONS ================================================

onboarding.construct = function (object = {}) {
	return onboarding[object.tag](object);
};

onboarding.welcome = function () {
	return [
		`Next Steps`,
		`Success! Your account has been verified.

Your journey with CreateBase is just beginning, to get you started here are some next steps we recommend for you:

<b>Complete Onboarding tasks</b>
If you’re not sure what to do check the Onboarding tab for tasks that will help you use CreateBase like a pro.

<b>Learn with Guest Access</b>
Use Guest Access for hands on experience learning about how we solve your problems.

<b>Discover a Project</b>
Have a look at what your students complete on our platform.`,
	];
};

onboarding.defaultOnboardingCompleted = function () {
	return [
		`Great Work!`,
		`Congratulations! You completed our Guest Onboarding. 


We’re stoked that you’ve taken some precious time to learn about our platform, and we hope we can be valuable to you.

If you have any feedback we would love to hear from you. Simply reply to this email with anything you want to share.`,
	];
};

onboarding.organisationCreated = function (object) {
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

onboarding.organisationDetail = function (object = {}) {
	let orgName = "";
	for (let i = 0; i < object.orgName.length; i++) {
		const character = object.orgName[i];
		if (character === " ") {
			orgName = orgName + "-";
		} else {
			orgName = orgName + character;
		}
	}
	return [
		`Hooray! ${object.orgName} is now registered on the CreateBase platform.`,
		`Congratulations! Your organisation is now established on our platform. Each school only has one organisation account and you have all the codes. This is important info so make sure you note the organisation information below, as it's needed to add teachers and students to your organisation.


<b>Organisation Information</b>
<ul><li>Organisation ID: <b>${object.orgId}</b></li><li>Organisation Name: <b>${object.orgName}</b></li><li>Code for Educators: <b>${object.eduCode}</b></li><li>Code for Learners: <b>${object.lerCode}</b></li></ul>
<b>Invite Your Fellow Teachers and Your Students</b>

It is more fun when there are more people in your organisation! So, invite your fellow teachers and your students to the organisation. <b><a href='https://youtu.be/nb0zARtCCK0'>Here is a video</a></b> on how to invite your fellow teachers and your students.

Here are the invitation links that you can send to your fellow educators and your students.
<ul><li>Educator link - ${process.env.APP_PREFIX}/invite/educator/${object.orgId}__${orgName}__${object.eduCode}</li><li>Learner link - ${process.env.APP_PREFIX}/invite/learner/${object.orgId}__${orgName}__${object.lerCode}</li></ul>`,
	];
};

onboarding.educatorAccept = function (object = {}) {
	let orgName = "";
	for (let i = 0; i < object.orgName.length; i++) {
		const character = object.orgName[i];
		if (character === " ") {
			orgName = orgName + "-";
		} else {
			orgName = orgName + character;
		}
	}
	return [
		`You are now a part of ${object.orgName}`,
		`Amazing news! You are now a part of ${object.orgName}!

Each school only has one organisation account and you have all the codes. This is important info so make sure you note the organisation information below, as it's needed to add teachers and students to your organisation.
		

<b>Organisation Information</b>
<ul><li>Organisation ID: <b>${object.orgId}</b></li><li>Organisation Name: <b>${object.orgName}</b></li><li>Code for Educators: <b>${object.eduCode}</b></li><li>Code for Learners: <b>${object.lerCode}</b></li></ul>
<b>Invite Your Fellow Teachers and Your Students</b>

It is more fun when there are more people in your organisation! So, invite your fellow teachers and your students to the organisation. <b><a href='https://youtu.be/nb0zARtCCK0'>Here is a video</a></b> on how to invite your fellow teachers and your students.

Here are the invitation links that you can send to your fellow educators and your students.
<ul><li>Educator link - ${process.env.APP_PREFIX}/invite/educator/${object.orgId}__${orgName}__${object.eduCode}</li><li>Learner link - ${process.env.APP_PREFIX}/invite/learner/${object.orgId}__${orgName}__${object.lerCode}</li></ul>`,
	];
};

// EXPORT ===================================================

module.exports = onboarding;

// END ======================================================
