// VARIABLES ================================================

if (process.env.NODE_ENV !== "production") require("dotenv").config();
let cold = {
	construct: undefined,
	hodNzEmail1: undefined,
	hodNzEmail2: undefined,
	hodSgEmail1: undefined,
	hodUkEmail1: undefined,
	hodAuEmail1: undefined,
	teacherNzEmail1: undefined,
	teacherNzEmail2: undefined,
	teacherSgEmail1: undefined,
	teacherUkEmail1: undefined,
	teacherAuEmail1: undefined,
	adminNzEmail1: undefined,
	adminSgEmail1: undefined,
	adminUkEmail1: undefined,
	adminAuEmail1: undefined,
};

// FUNCTIONS ================================================

cold.construct = function (object = {}) {
	return cold[object.tag](object);
};

cold.hodNzEmail1 = function (object = {}) {
	const school = { upper: object.school ? object.school : "Your school", lower: object.school ? object.school : "your school" };
	return [
		`${school.upper} deserves more from digital technologies`,
		`Have you ever considered buying <u>Lego Mindstorms, Makeblocks, Spheros or other educational robots</u> for ${school.lower} but couldn’t because they were <b>outside your budget</b>?

Even if you did, have you run into problems due to the fact that you <b>do not have enough robots for your students</b>?

Are you perhaps using <u>digital education tools</u>, but have noticed these tools <b>don’t have the same authentic and real experience</b> that you find in physical education tools?

If any of these resonate with you, we have a solution!


At CreateBase, we have developed <u>a solution that merges the benefits of physical and digital learning tools</u>.

Our solution enables you and your students to <b>create authentic solutions</b> to <b>real world problems</b> by programming <b>digital robots</b>.

With <b>affordable subscriptions</b>, you and your students can access our growing collection of robots and projects <b>anywhere at anytime</b>!


If you are interested in how we do it and how it can improve your students learning experience, check out <b><a href='https://youtu.be/0y_RbuoMMno'>this video</a></b>.

And then, learn more about us and what other teachers are saying <u><b><a href='${process.env.SITE_PREFIX}/landing'>here</a></b></u>.`,
	];
};

cold.hodNzEmail2 = function (object = {}) {
	const school = { upper: object.school ? object.school : "Your school", lower: object.school ? object.school : "your school" };
	return [
		`CreateBase has launched our new and improved platform! Try it now!`,
		`We have launched the new and improved CreateBase platform! But, before you get started, let us first ask you a few questions to ensure that our platform is for you!


Have you ever considered buying <u>Lego Mindstorms, Makeblocks, Spheros or other educational robots</u> for ${school.lower} but couldn’t because they were <b>outside your budget</b>?

Even if you did, have you run into problems due to the fact that you <b>do not have enough robots for your students</b>?

Are you perhaps using <u>digital education tools</u>, but have noticed these tools <b>don’t have the same authentic and real experience</b> that you find in physical education tools?

If any of these resonate with you, we have a solution!


At CreateBase, we have developed <u>a solution that merges the benefits of physical and digital learning tools</u>.

Our solution enables you and your students to <b>create authentic solutions</b> to <b>real world problems</b> by programming <b>digital robots</b>.

With <b>affordable subscriptions</b>, you and your students can access our growing collection of robots and projects <b>anywhere at anytime</b>!


If you are interested in how we do it and how it can improve your students learning experience, check out <b><a href='https://youtu.be/0y_RbuoMMno'>this video</a></b>.

And then, learn more about us and what other teachers are saying <u><b><a href='${process.env.SITE_PREFIX}/landing'>here</a></b></u>.`,
	];
};

cold.hodSgEmail1 = function (object = {}) {
	const school = { upper: object.school ? object.school : "Your school", lower: object.school ? object.school : "your school" };
	return [
		`${school.upper} deserves more from digital technologies`,
		`Have you ever considered buying <u>Lego Mindstorms, Makeblocks, Spheros or other educational robots</u> for ${school.lower} but couldn’t because they were <b>outside your budget</b>?

Even if you did, have you run into problems due to the fact that you <b>do not have enough robots for your students</b>?

Are you perhaps using <u>digital education tools</u>, but have noticed these tools <b>don’t have the same authentic and real experience</b> that you find in physical education tools?

If any of these resonate with you, we have a solution!


At CreateBase, we have developed <u>a solution that merges the benefits of physical and digital learning tools</u>.

Our solution enables you and your students to <b>create authentic solutions</b> to <b>real world problems</b> by programming <b>digital robots</b>.

With <b>affordable subscriptions</b>, you and your students can access our growing collection of robots and projects <b>anywhere at anytime</b>!


If you are interested in how we do it and how it can improve your students learning experience, check out <b><a href='https://youtu.be/0y_RbuoMMno'>this video</a></b>.

And then, learn more about us and what other teachers are saying <u><b><a href='${process.env.SITE_PREFIX}/landing'>here</a></b></u>.`,
	];
};

cold.hodUkEmail1 = function (object = {}) {
	const school = { upper: object.school ? object.school : "Your school", lower: object.school ? object.school : "your school" };
	return [
		`${school.upper} deserves more from digital technologies`,
		`Have you ever considered buying <u>Lego Mindstorms, Makeblocks, Spheros or other educational robots</u> for ${school.lower} but couldn’t because they were <b>outside your budget</b>?

Even if you did, have you run into problems due to the fact that you <b>do not have enough robots for your students</b>?

Are you perhaps using <u>digital education tools</u>, but have noticed these tools <b>don’t have the same authentic and real experience</b> that you find in physical education tools?

If any of these resonate with you, we have a solution!


At CreateBase, we have developed <u>a solution that merges the benefits of physical and digital learning tools</u>.

Our solution enables you and your students to <b>create authentic solutions</b> to <b>real world problems</b> by programming <b>digital robots</b>.

With <b>affordable subscriptions</b>, you and your students can access our growing collection of robots and projects <b>anywhere at anytime</b>!


If you are interested in how we do it and how it can improve your students learning experience, check out <b><a href='https://youtu.be/0y_RbuoMMno'>this video</a></b>.

And then, learn more about us and what other teachers are saying <u><b><a href='${process.env.SITE_PREFIX}/landing'>here</a></b></u>.`,
	];
};

cold.hodAuEmail1 = function (object = {}) {
	const school = { upper: object.school ? object.school : "Your school", lower: object.school ? object.school : "your school" };
	return [
		`${school.upper} deserves more from digital technologies`,
		`Have you ever considered buying <u>Lego Mindstorms, Makeblocks, Spheros or other educational robots</u> for ${school.lower} but couldn’t because they were <b>outside your budget</b>?

Even if you did, have you run into problems due to the fact that you <b>do not have enough robots for your students</b>?

Are you perhaps using <u>digital education tools</u>, but have noticed these tools <b>don’t have the same authentic and real experience</b> that you find in physical education tools?

If any of these resonate with you, we have a solution!


At CreateBase, we have developed <u>a solution that merges the benefits of physical and digital learning tools</u>.

Our solution enables you and your students to <b>create authentic solutions</b> to <b>real world problems</b> by programming <b>digital robots</b>.

With <b>affordable subscriptions</b>, you and your students can access our growing collection of robots and projects <b>anywhere at anytime</b>!


If you are interested in how we do it and how it can improve your students learning experience, check out <b><a href='https://youtu.be/0y_RbuoMMno'>this video</a></b>.

And then, learn more about us and what other teachers are saying <u><b><a href='${process.env.SITE_PREFIX}/landing'>here</a></b></u>.`,
	];
};

cold.teacherNzEmail1 = function (object = {}) {
	const school = { upper: object.school ? object.school : "Your school", lower: object.school ? object.school : "your school" };
	return [
		"Experience physical robotics in our digital world!",
		`Has ${school.lower} ever considered buying <u>Lego Mindstorms, Makeblocks, Spheros or other educational robots</u> but couldn’t because they were <b>outside your budget</b>?

Even if you did, have you run into problems due to the fact that you <b>do not have enough robots for your students</b>?

Are you perhaps using <u>digital education tools</u>, but have noticed these tools <b>don’t have the same authentic and real experience</b> that you find in physical education tools?

If any of these resonate with you, we have a solution!


At CreateBase, we have developed <u>a solution that merges the benefits of physical and digital learning tools</u>.

Our solution enables you and your students to <b>create authentic solutions</b> to <b>real world problems</b> by programming <b>digital robots</b>.

With <b>affordable subscriptions</b>, you and your students can access our growing collection of robots and projects <b>anywhere at anytime</b>!


If you are interested in how we do it and how it can improve your students learning experience, check out <b><a href='https://youtu.be/0y_RbuoMMno'>this video</a></b>.

And then, learn more about us and what other teachers are saying <u><b><a href='${process.env.SITE_PREFIX}/landing'>here</a></b></u>.`,
	];
};

cold.teacherNzEmail2 = function (object = {}) {
	const school = { upper: object.school ? object.school : "Your school", lower: object.school ? object.school : "your school" };
	return [
		"CreateBase has launched our new and improved platform! Try it now!",
		`We have launched the new and improved CreateBase platform! But, before you get started, let us first ask you a few questions to ensure that our platform is for you!


Has ${school.lower} ever considered buying <u>Lego Mindstorms, Makeblocks, Spheros or other educational robots</u> but couldn’t because they were <b>outside your budget</b>?

Even if you did, have you run into problems due to the fact that you <b>do not have enough robots for your students</b>?

Are you perhaps using <u>digital education tools</u>, but have noticed these tools <b>don’t have the same authentic and real experience</b> that you find in physical education tools?

If any of these resonate with you, we have a solution!


At CreateBase, we have developed <u>a solution that merges the benefits of physical and digital learning tools</u>.

Our solution enables you and your students to <b>create authentic solutions</b> to <b>real world problems</b> by programming <b>digital robots</b>.

With <b>affordable subscriptions</b>, you and your students can access our growing collection of robots and projects <b>anywhere at anytime</b>!


If you are interested in how we do it and how it can improve your students learning experience, check out <b><a href='https://youtu.be/0y_RbuoMMno'>this video</a></b>.

And then, learn more about us and what other teachers are saying <u><b><a href='${process.env.SITE_PREFIX}/landing'>here</a></b></u>.`,
	];
};

cold.teacherSgEmail1 = function (object = {}) {
	const school = { upper: object.school ? object.school : "Your school", lower: object.school ? object.school : "your school" };
	return [
		"Experience physical robotics in our digital world!",
		`Has ${school.lower} ever considered buying <u>Lego Mindstorms, Makeblocks, Spheros or other educational robots</u> but couldn’t because they were <b>outside your budget</b>?

Even if you did, have you run into problems due to the fact that you <b>do not have enough robots for your students</b>?

Are you perhaps using <u>digital education tools</u>, but have noticed these tools <b>don’t have the same authentic and real experience</b> that you find in physical education tools?

If any of these resonate with you, we have a solution!


At CreateBase, we have developed <u>a solution that merges the benefits of physical and digital learning tools</u>.

Our solution enables you and your students to <b>create authentic solutions</b> to <b>real world problems</b> by programming <b>digital robots</b>.

With <b>affordable subscriptions</b>, you and your students can access our growing collection of robots and projects <b>anywhere at anytime</b>!


If you are interested in how we do it and how it can improve your students learning experience, check out <b><a href='https://youtu.be/0y_RbuoMMno'>this video</a></b>.

And then, learn more about us and what other teachers are saying <u><b><a href='${process.env.SITE_PREFIX}/landing'>here</a></b></u>.`,
	];
};

cold.teacherUkEmail1 = function (object = {}) {
	const school = { upper: object.school ? object.school : "Your school", lower: object.school ? object.school : "your school" };
	return [
		"Experience physical robotics in our digital world!",
		`Has ${school.lower} ever considered buying <u>Lego Mindstorms, Makeblocks, Spheros or other educational robots</u> but couldn’t because they were <b>outside your budget</b>?

Even if you did, have you run into problems due to the fact that you <b>do not have enough robots for your students</b>?

Are you perhaps using <u>digital education tools</u>, but have noticed these tools <b>don’t have the same authentic and real experience</b> that you find in physical education tools?

If any of these resonate with you, we have a solution!


At CreateBase, we have developed <u>a solution that merges the benefits of physical and digital learning tools</u>.

Our solution enables you and your students to <b>create authentic solutions</b> to <b>real world problems</b> by programming <b>digital robots</b>.

With <b>affordable subscriptions</b>, you and your students can access our growing collection of robots and projects <b>anywhere at anytime</b>!


If you are interested in how we do it and how it can improve your students learning experience, check out <b><a href='https://youtu.be/0y_RbuoMMno'>this video</a></b>.

And then, learn more about us and what other teachers are saying <u><b><a href='${process.env.SITE_PREFIX}/landing'>here</a></b></u>.`,
	];
};

cold.teacherAuEmail1 = function (object = {}) {
	const school = { upper: object.school ? object.school : "Your school", lower: object.school ? object.school : "your school" };
	return [
		"Experience physical robotics in our digital world!",
		`Has ${school.lower} ever considered buying <u>Lego Mindstorms, Makeblocks, Spheros or other educational robots</u> but couldn’t because they were <b>outside your budget</b>?

Even if you did, have you run into problems due to the fact that you <b>do not have enough robots for your students</b>?

Are you perhaps using <u>digital education tools</u>, but have noticed these tools <b>don’t have the same authentic and real experience</b> that you find in physical education tools?

If any of these resonate with you, we have a solution!


At CreateBase, we have developed <u>a solution that merges the benefits of physical and digital learning tools</u>.

Our solution enables you and your students to <b>create authentic solutions</b> to <b>real world problems</b> by programming <b>digital robots</b>.

With <b>affordable subscriptions</b>, you and your students can access our growing collection of robots and projects <b>anywhere at anytime</b>!


If you are interested in how we do it and how it can improve your students learning experience, check out <b><a href='https://youtu.be/0y_RbuoMMno'>this video</a></b>.

And then, learn more about us and what other teachers are saying <u><b><a href='${process.env.SITE_PREFIX}/landing'>here</a></b></u>.`,
	];
};

cold.adminNzEmail1 = function (object = {}) {
	const school = { upper: object.school ? object.school : "Your school", lower: object.school ? object.school : "your school" };
	return [
		"An engaging solution for your in-person & remote digital tech classes! Try it for FREE!",
		`We know you’re swamped, so we’ll be brief! We are trying to get in touch with your STEM or digital technologies teachers. 

We understand the <b>challenges caused by remote learning situations</b>! We have heard stories where teachers are having <b>difficulties keeping students engaged</b>.

We have created <u>a solution that works well in both remote and in-person learning situations</u>! And, if ${school.lower} <b>registers on our platform before 1 January 2022</b>, you will have access to our platform for <b>FREE until 1 June 2022</b>!

If you think your STEM or digital technologies teachers might benefit from our solution, we would appreciate it if you could forward this email to them! Thank you!


"Hi there,


Has ${school.lower} ever considered buying <u>Lego Mindstorms, Makeblocks, Spheros or other educational robots</u> but couldn’t because they were <b>outside your budget</b>?

Even if you did, have you run into problems due to the fact that you <b>do not have enough robots for your students</b>?

Are you perhaps using <u>digital education tools</u>, but have noticed these tools <b>don’t have the same authentic and real experience</b> that you find in physical education tools?

If any of these resonate with you, we have a solution!


At CreateBase, we have developed <u>a solution that merges the benefits of physical and digital learning tools</u>.

Our solution enables you and your students to <b>create authentic solutions</b> to <b>real world problems</b> by programming <b>digital robots</b>.

With <b>affordable subscriptions</b>, you and your students can access our growing collection of robots and projects <b>anywhere at anytime</b>!


If you are interested in how we do it and how it can improve your students learning experience, check out <b><a href='https://youtu.be/0y_RbuoMMno'>this video</a></b>.

And then, learn more about us and what other teachers are saying <u><b><a href='${process.env.SITE_PREFIX}/landing'>here</a></b></u>."`,
	];
};

cold.adminSgEmail1 = function (object = {}) {
	const school = { upper: object.school ? object.school : "Your school", lower: object.school ? object.school : "your school" };
	return [
		"An engaging solution for your in-person & remote digital tech classes! Try it for FREE!",
		`We know you’re swamped, so we’ll be brief! We are trying to get in touch with your STEM or digital technologies teachers. 

We understand the <b>challenges caused by remote learning situations</b>! We have heard stories where teachers are having <b>difficulties keeping students engaged</b>.

We have created <u>a solution that works well in both remote and in-person learning situations</u>! And, if ${school.lower} <b>registers on our platform before 1 January 2022</b>, you will have access to our platform for <b>FREE until 1 June 2022</b>!

If you think your STEM or digital technologies teachers might benefit from our solution, we would appreciate it if you could forward this email to them! Thank you!


"Hi there,


Has ${school.lower} ever considered buying <u>Lego Mindstorms, Makeblocks, Spheros or other educational robots</u> but couldn’t because they were <b>outside your budget</b>?

Even if you did, have you run into problems due to the fact that you <b>do not have enough robots for your students</b>?

Are you perhaps using <u>digital education tools</u>, but have noticed these tools <b>don’t have the same authentic and real experience</b> that you find in physical education tools?

If any of these resonate with you, we have a solution!


At CreateBase, we have developed <u>a solution that merges the benefits of physical and digital learning tools</u>.

Our solution enables you and your students to <b>create authentic solutions</b> to <b>real world problems</b> by programming <b>digital robots</b>.

With <b>affordable subscriptions</b>, you and your students can access our growing collection of robots and projects <b>anywhere at anytime</b>!


If you are interested in how we do it and how it can improve your students learning experience, check out <b><a href='https://youtu.be/0y_RbuoMMno'>this video</a></b>.

And then, learn more about us and what other teachers are saying <u><b><a href='${process.env.SITE_PREFIX}/landing'>here</a></b></u>."`,
	];
};

cold.adminUkEmail1 = function (object = {}) {
	const school = { upper: object.school ? object.school : "Your school", lower: object.school ? object.school : "your school" };
	return [
		"An engaging solution for your in-person & remote digital tech classes! Try it for FREE!",
		`We know you’re swamped, so we’ll be brief! We are trying to get in touch with your STEM or digital technologies teachers. 

We understand the <b>challenges caused by remote learning situations</b>! We have heard stories where teachers are having <b>difficulties keeping students engaged</b>.

We have created <u>a solution that works well in both remote and in-person learning situations</u>! And, if ${school.lower} <b>registers on our platform before 1 January 2022</b>, you will have access to our platform for <b>FREE until 1 June 2022</b>!

If you think your STEM or digital technologies teachers might benefit from our solution, we would appreciate it if you could forward this email to them! Thank you!


"Hi there,


Has ${school.lower} ever considered buying <u>Lego Mindstorms, Makeblocks, Spheros or other educational robots</u> but couldn’t because they were <b>outside your budget</b>?

Even if you did, have you run into problems due to the fact that you <b>do not have enough robots for your students</b>?

Are you perhaps using <u>digital education tools</u>, but have noticed these tools <b>don’t have the same authentic and real experience</b> that you find in physical education tools?

If any of these resonate with you, we have a solution!


At CreateBase, we have developed <u>a solution that merges the benefits of physical and digital learning tools</u>.

Our solution enables you and your students to <b>create authentic solutions</b> to <b>real world problems</b> by programming <b>digital robots</b>.

With <b>affordable subscriptions</b>, you and your students can access our growing collection of robots and projects <b>anywhere at anytime</b>!


If you are interested in how we do it and how it can improve your students learning experience, check out <b><a href='https://youtu.be/0y_RbuoMMno'>this video</a></b>.

And then, learn more about us and what other teachers are saying <u><b><a href='${process.env.SITE_PREFIX}/landing'>here</a></b></u>."`,
	];
};

cold.adminAuEmail1 = function (object = {}) {
	const school = { upper: object.school ? object.school : "Your school", lower: object.school ? object.school : "your school" };
	return [
		"An engaging solution for your in-person & remote digital tech classes! Try it for FREE!",
		`We know you’re swamped, so we’ll be brief! We are trying to get in touch with your STEM or digital technologies teachers. 

We understand the <b>challenges caused by remote learning situations</b>! We have heard stories where teachers are having <b>difficulties keeping students engaged</b>.

We have created <u>a solution that works well in both remote and in-person learning situations</u>! And, if ${school.lower} <b>registers on our platform before 1 January 2022</b>, you will have access to our platform for <b>FREE until 1 June 2022</b>!

If you think your STEM or digital technologies teachers might benefit from our solution, we would appreciate it if you could forward this email to them! Thank you!


"Hi there,


Has ${school.lower} ever considered buying <u>Lego Mindstorms, Makeblocks, Spheros or other educational robots</u> but couldn’t because they were <b>outside your budget</b>?

Even if you did, have you run into problems due to the fact that you <b>do not have enough robots for your students</b>?

Are you perhaps using <u>digital education tools</u>, but have noticed these tools <b>don’t have the same authentic and real experience</b> that you find in physical education tools?

If any of these resonate with you, we have a solution!


At CreateBase, we have developed <u>a solution that merges the benefits of physical and digital learning tools</u>.

Our solution enables you and your students to <b>create authentic solutions</b> to <b>real world problems</b> by programming <b>digital robots</b>.

With <b>affordable subscriptions</b>, you and your students can access our growing collection of robots and projects <b>anywhere at anytime</b>!


If you are interested in how we do it and how it can improve your students learning experience, check out <b><a href='https://youtu.be/0y_RbuoMMno'>this video</a></b>.

And then, learn more about us and what other teachers are saying <u><b><a href='${process.env.SITE_PREFIX}/landing'>here</a></b></u>."`,
	];
};

// EXPORT ===================================================

module.exports = cold;

// END ======================================================
