// VARIABLES ================================================

if (process.env.NODE_ENV !== "production") require("dotenv").config();
let newsletter = {
	construct: undefined,
	newSubscriber: undefined,
	globalLaunch: undefined,
};

// FUNCTIONS ================================================

newsletter.construct = function (object = {}) {
	return newsletter[object.tag](object);
};

newsletter.newSubscriber = function () {
	return [
		"Thank you for signing up for our newsletter!",
		`<b>Welcome to CreateBase</b>! We are excited to have you be a part of our journey! We will celebrate with you whenever we
<ul><li>release <b>new features</b>,</li><li>release <b>new projects</b>, and</li><li>achieve <b>new milestones</b>.</li></ul>We will also let you know when we are running <b>events</b> and <b>promotions</b>!


Are you a teacher? <b><a href='${process.env.PREFIX_APP}/auth/signup'>Sign up for a FREE account</a></b> and try out our platform! We have some fun projects for you and your students:
<ul><li><b>MagneBot</b> - control a robotic arm using flow-based programming to clean up items of rubbish,</li><li><b>Send It</b> - automate a jumping game by creating a simple artificial intelligence (AI).</li><li><b>Line Following</b> (<i>coming soon</i>) - write an algorithm to control a line following robot in a warehouse; enabling it to find and put out fires.</li></ul>Even if you are not a teacher, you can still try our fun and challenging projects! Head over to ${process.env.PREFIX_APP} and continue as a guest.

Want to know more about CreateBase? Head over to ${process.env.PREFIX_WEBSITE} or check out any of our social media.


We are aiming to inspire the next generation of creators, and we need your help! Share our story with schools, teachers and students, and together we will build the future of education!`,
	];
};

newsletter.globalLaunch = function () {
	return ["We have launched!", "No contents yet!"];
};

// EXPORT ===================================================

module.exports = newsletter;

// END ======================================================
