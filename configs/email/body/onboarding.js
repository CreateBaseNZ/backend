// VARIABLES ================================================

if (process.env.NODE_ENV !== "production") require("dotenv").config();
let onboarding = {
	construct: undefined,
	welcome: undefined,
	organisationDetail: undefined,
	educatorAccept: undefined,
};

// FUNCTIONS ================================================

onboarding.construct = function (object = {}) {
	return onboarding[object.tag](object);
};

onboarding.welcome = function (object = {}) {
	return [
		`Welcome to CreateBase, ${object.name}!`,
		`Welcome to CreateBase! Here is your second task!

School accounts are a key part of the CreateBase platform that we call Organisation accounts. To teach with the platform you are required to be associated with an organisation account.

<b><a href='${process.env.APP_PREFIX}/user/my-account/org'>Create or join</a></b> an organisation.


<b>Create an Organisation</b>

To create an account you will need:
<ul><li>The ID of your school</li><li>The name of your school</li></ul>You can find this information <b><a href='https://www.educationcounts.govt.nz/directories/list-of-nz-schools'>here</a></b>.

<b><a href='https://youtu.be/6QTpDvfDZ9s'>Here is a video</a></b> on how to register your organisation.


<b>Join an Organisation</b>

If your school already exists on the CreateBase platform, you will need to join it using the code emailed to the teacher who registered your organisation on our platform.

If your school already exists on the CreateBase platform, you will need to join instead. Here are the different ways you can join the organisation:
<ul><li>Get the invitation link from the teacher who registered your organisation to automatically join the organisation.</li><li>Get the code for educators from the teacher who registered your organisation, and manually join the organisation.</li></ul><b><a href='https://youtu.be/AQ6acGxQZwE'>Here is a video</a></b> on how to join an organisation.`,
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
