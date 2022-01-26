// VARIABLES ================================================

if (process.env.NODE_ENV !== "production") require("dotenv").config();
let cold = {
	construct: undefined,
	hodNzIntro: undefined,
	hodNzBack: undefined,
	teacherNzIntro: undefined,
	teacherNzBack: undefined,
	adminNzIntro: undefined,
};

// FUNCTIONS ================================================

cold.construct = function (object = {}) {
	return cold[object.tag](object);
};

cold.hodNzIntro = function (object = {}) {
	const school = { upper: object.school ? object.school : "Your school", lower: object.school ? object.school : "your school" };
	return [
		`Keep all your students engaged with digital robots, anytime, anywhere!`,
		`Have you ever <b>considered buying Lego Mindstorms, Makeblocks, Spheros or other educational robots</b> for ${school.lower} but couldn’t because they were <b>outside your budget</b>? But even if you did, have you run into problems where
<ul><li>there are <b>not enough robots for every student</b>,</li><li>they <b>break easily</b>,</li><li>they <b>go out-of-date</b>,</li><li>they are a <b>hassle and costly to maintain</b>, and</li><li>you <b>can’t use them for remote learning situations</b>.</li></ul>Are you perhaps using <b>digital education tools</b>, but have noticed that these tools <b>don’t have the same authentic and engaging experiences</b> that you find in physical education tools?

If you have any of these problems, we have a solution - <u><b><a href="https://youtu.be/boq1q0Pxu5I">the CreateBase platform</a></b></u>! The CreateBase platform was <u>created by Kiwis who want to propel Aotearoa’s STEAM and digital technologies education</u>.

At CreateBase, teachers and students complete <b>projects, building authentic solutions to real-world problems by programming digital robots</b>. We assist teachers by providing them with our <b>curriculum-aligned lesson plans</b>. Each project follows our <b>design thinking process, developing our learners’ creative, critical and computational thinking skills</b>.

Our solution is suitable for your <b>year 7 to 10 STEAM and Digital Technologies classes</b>.

With an <b>affordable subscription</b> of <u>$7.99 per user per full-year</u> or <u>$4.49 per user per half-year</u>, you, your fellow teachers and your students can <b>access our growing collection of projects and robots anytime anywhere</b>.

If you are interested, <u><b><a href="https://createbase.co.nz/landing">learn more about us and what other teachers are saying here</a></b></u>. Signup for an account and register your school now to get <u><b>FREE access until June 2022</b></u>!`,
	];
};

cold.hodNzBack = function () {
	return [
		`Start your students’ year right by solving authentic problems with digital robotics!`,
		`How’s the start of your school year?! Hopefully, you, your family, and your school are staying safe during this Omicron disturbance. Let us help you navigate this turbulent time!

As outlined in my previous email, we have developed <b>resources to supercharge your year 7 to 10 STEAM and Digital Technologies classes</b>. These resources were developed in collaboration with teachers to ensure
<ul><li><b>fitness for remote AND in-person use</b>,</li><li><b>alignment with the NZ Technology Curriculum</b>, and</li><li><b>focus on design thinking and authentic learning</b>.</li></ul>I won’t bore you with the details, but if you are interested, <u><b><a href="https://createbase.co.nz/landing">learn more about us and what other teachers are saying here</a></b></u>. Signup for an account and register your school now to get <u><b>FREE access until June 2022</b></u>!`,
	];
};

cold.teacherNzIntro = function (object = {}) {
	const school = { upper: object.school ? object.school : "Your school", lower: object.school ? object.school : "your school" };
	return [
		`Keep all your students engaged with digital robots, anytime, anywhere!`,
		`Have you ever <b>considered buying Lego Mindstorms, Makeblocks, Spheros or other educational robots</b> for ${school.lower} but couldn’t because they were <b>outside your budget</b>? But even if you did, have you run into problems where
<ul><li>there are <b>not enough robots for every student</b>,</li><li>they <b>break easily</b>,</li><li>they <b>go out-of-date</b>,</li><li>they are a <b>hassle and costly to maintain</b>, and</li><li>you <b>can’t use them for remote learning situations</b>.</li></ul>Are you perhaps using <b>digital education tools</b>, but have noticed that these tools <b>don’t have the same authentic and engaging experiences</b> that you find in physical education tools?

If you have any of these problems, we have a solution - <u><b><a href="https://youtu.be/boq1q0Pxu5I">the CreateBase platform</a></b></u>! The CreateBase platform was <u>created by Kiwis who want to propel Aotearoa’s STEAM and digital technologies education</u>.

At CreateBase, teachers and students complete <b>projects, building authentic solutions to real-world problems by programming digital robots</b>. We assist teachers by providing them with our <b>curriculum-aligned lesson plans</b>. Each project follows our <b>design thinking process, developing our learners’ creative, critical and computational thinking skills</b>.

Our solution is suitable for your <b>year 7 to 10 STEAM and Digital Technologies classes</b>.

With an <b>affordable subscription</b> of <u>$7.99 per user per full-year</u> or <u>$4.49 per user per half-year</u>, you, your fellow teachers and your students can <b>access our growing collection of projects and robots anytime anywhere</b>.

If you are interested, <u><b><a href="https://createbase.co.nz/landing">learn more about us and what other teachers are saying here</a></b></u>. Signup for an account and register your school now to get <u><b>FREE access until June 2022</b></u>!`,
	];
};

cold.teacherNzBack = function () {
	return [
		`Start your students’ year right by solving authentic problems with digital robotics!`,
		`How’s the start of your school year?! Hopefully, you, your family, and your school are staying safe during this Omicron disturbance. Let us help you navigate this turbulent time!

As outlined in my previous email, we have developed <b>resources to supercharge your year 7 to 10 STEAM and Digital Technologies classes</b>. These resources were developed in collaboration with teachers to ensure
<ul><li><b>fitness for remote AND in-person use</b>,</li><li><b>alignment with the NZ Technology Curriculum</b>, and</li><li><b>focus on design thinking and authentic learning</b>.</li></ul>I won’t bore you with the details, but if you are interested, <u><b><a href="https://createbase.co.nz/landing">learn more about us and what other teachers are saying here</a></b></u>. Signup for an account and register your school now to get <u><b>FREE access until June 2022</b></u>!`,
	];
};

cold.adminNzIntro = function (object = {}) {
	const school = { upper: object.school ? object.school : "Your school", lower: object.school ? object.school : "your school" };
	return [
		`Keep all your students engaged with digital robots, anytime, anywhere!`,
		`We know you’re swamped, so we’ll be brief! We are trying to get in touch with your <b>STEAM or Digital Technologies teachers</b>.

We understand the <b>challenges caused by remote learning situations</b>! We have heard stories where teachers struggled to keep students engaged.

We have created a <u>solution that works well in both remote and in-person learning situations</u>! See the details below!

If you think your STEAM or Digital technologies Teachers might benefit from our solution, we would appreciate it if you could <b>forward this email to them</b>! Thank you!


"Kia ora,


Have you ever <b>considered buying Lego Mindstorms, Makeblocks, Spheros or other educational robots</b> for ${school.lower} but couldn’t because they were <b>outside your budget</b>? But even if you did, have you run into problems where
<ul><li>there are <b>not enough robots for every student</b>,</li><li>they <b>break easily</b>,</li><li>they <b>go out-of-date</b>,</li><li>they are a <b>hassle and costly to maintain</b>, and</li><li>you <b>can’t use them for remote learning situations</b>.</li></ul>Are you perhaps using <b>digital education tools</b>, but have noticed that these tools <b>don’t have the same authentic and engaging experiences</b> that you find in physical education tools?

If you have any of these problems, we have a solution - <u><b><a href="https://youtu.be/boq1q0Pxu5I">the CreateBase platform</a></b></u>! The CreateBase platform was <u>created by Kiwis who want to propel Aotearoa’s STEAM and digital technologies education</u>.

At CreateBase, teachers and students complete <b>projects, building authentic solutions to real-world problems by programming digital robots</b>. We assist teachers by providing them with our <b>curriculum-aligned lesson plans</b>. Each project follows our <b>design thinking process, developing our learners’ creative, critical and computational thinking skills</b>.

Our solution is suitable for your <b>year 7 to 10 STEAM and Digital Technologies classes</b>.

With an <b>affordable subscription</b> of <u>$7.99 per user per full-year</u> or <u>$4.49 per user per half-year</u>, you, your fellow teachers and your students can <b>access our growing collection of projects and robots anytime anywhere</b>.

If you are interested, <u><b><a href="https://createbase.co.nz/landing">learn more about us and what other teachers are saying here</a></b></u>. Signup for an account and register your school now to get <u><b>FREE access until June 2022</b></u>!"`,
	];
};

// EXPORT ===================================================

module.exports = cold;

// END ======================================================
