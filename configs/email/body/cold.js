// VARIABLES ================================================

if (process.env.NODE_ENV !== "production") require("dotenv").config();
let cold = {
	construct: undefined,
	hodNzEmail1: undefined,
	hodSgEmail1: undefined,
	hodUkEmail1: undefined,
	teacherNzEmail1: undefined,
	teacherSgEmail1: undefined,
	teacherUkEmail1: undefined,
};

// FUNCTIONS ================================================

cold.construct = function (object = {}) {
	return cold[object.tag](object);
};

cold.hodNzEmail1 = function (object = {}) {
	return [
		`${object.school} deserves more from digital tech`,
		`Have you ever considered buying <u>Lego Mindstorms, Makeblocks or Spheros</u> for ${object.school} but couldn’t because they were <b>outside your budget</b>?

Even if you did, have you run into problems due to the fact that you <b>do not have enough robots for your students</b>?

Are you perhaps using <u>digital education tools</u>, but have noticed these tools <b>don’t have the same authentic and real experience</b> that you find in physical education tools?

If any of these resonate with you, we have a solution!


At CreateBase, we have developed <u>a solution that merges the benefits of physical and digital learning tools</u>.

Our solution enables you and your students to <b>create authentic solutions</b> to <b>real world problems</b> by programming <b>digital robots</b>.

With <b>affordable subscriptions</b>, you and your students can access our growing collection of robots and projects <b>anywhere at anytime</b>!


If you are interested in how we do it and how it can improve your students learning experience, check out <b><a href='https://youtu.be/0y_RbuoMMno'>this video</a></b>.

And then, learn more about us and what other teachers are saying <b><a href='https://createbase.co.nz/'>here.</a></b>`,
	];
};

cold.hodSgEmail1 = function (object = {}) {
	return [
		`${object.school} deserves more from digital tech`,
		`Have you ever considered buying <u>Lego Mindstorms, Makeblocks or Spheros</u> for ${object.school} but couldn’t because they were <b>outside your budget</b>?

Even if you did, have you run into problems due to the fact that you <b>do not have enough robots for your students</b>?

Are you perhaps using <u>digital education tools</u>, but have noticed these tools <b>don’t have the same authentic and real experience</b> that you find in physical education tools?

If any of these resonate with you, we have a solution!


At CreateBase, we have developed <u>a solution that merges the benefits of physical and digital learning tools</u>.

Our solution enables you and your students to <b>create authentic solutions</b> to <b>real world problems</b> by programming <b>digital robots</b>.

With <b>affordable subscriptions</b>, you and your students can access our growing collection of robots and projects <b>anywhere at anytime</b>!


If you are interested in how we do it and how it can improve your students learning experience, check out <b><a href='https://youtu.be/0y_RbuoMMno'>this video</a></b>.

And then, learn more about us and what other teachers are saying <b><a href='https://createbase.co.nz/'>here.</a></b>`,
	];
};

cold.hodUkEmail1 = function (object = {}) {
	return [
		`${object.school} deserves more from digital tech`,
		`Have you ever considered buying <u>Lego Mindstorms, Makeblocks or Spheros</u> for ${object.school} but couldn’t because they were <b>outside your budget</b>?

Even if you did, have you run into problems due to the fact that you <b>do not have enough robots for your students</b>?

Are you perhaps using <u>digital education tools</u>, but have noticed these tools <b>don’t have the same authentic and real experience</b> that you find in physical education tools?

If any of these resonate with you, we have a solution!


At CreateBase, we have developed <u>a solution that merges the benefits of physical and digital learning tools</u>.

Our solution enables you and your students to <b>create authentic solutions</b> to <b>real world problems</b> by programming <b>digital robots</b>.

With <b>affordable subscriptions</b>, you and your students can access our growing collection of robots and projects <b>anywhere at anytime</b>!


If you are interested in how we do it and how it can improve your students learning experience, check out <b><a href='https://youtu.be/0y_RbuoMMno'>this video</a></b>.

And then, learn more about us and what other teachers are saying <b><a href='https://createbase.co.nz/'>here.</a></b>`,
	];
};

cold.teacherNzEmail1 = function (object = {}) {
	return [
		"It's time to move on... from physical robotics",
		`Has ${object.school} ever considered buying <u>Lego Mindstorms, Makeblocks or Spheros</u> but couldn’t because they were <b>outside your budget</b>?

Even if you did, have you run into problems due to the fact that you <b>do not have enough robots for your students</b>?

Are you perhaps using <u>digital education tools</u>, but have noticed these tools <b>don’t have the same authentic and real experience</b> that you find in physical education tools?

If any of these resonate with you, we have a solution!


At CreateBase, we have developed <u>a solution that merges the benefits of physical and digital learning tools</u>.

Our solution enables you and your students to <b>create authentic solutions</b> to <b>real world problems</b> by programming <b>digital robots</b>.

With <b>affordable subscriptions</b>, you and your students can access our growing collection of robots and projects <b>anywhere at anytime</b>!


If you are interested in how we do it and how it can improve your students learning experience, check out <b><a href='https://youtu.be/0y_RbuoMMno'>this video</a></b>.

And then, learn more about us and what other teachers are saying <b><a href='https://createbase.co.nz/'>here.</a></b>.`,
	];
};

cold.teacherSgEmail1 = function (object = {}) {
	return [
		"It's time to move on... from physical robotics",
		`Has ${object.school} ever considered buying <u>Lego Mindstorms, Makeblocks or Spheros</u> but couldn’t because they were <b>outside your budget</b>?

Even if you did, have you run into problems due to the fact that you <b>do not have enough robots for your students</b>?

Are you perhaps using <u>digital education tools</u>, but have noticed these tools <b>don’t have the same authentic and real experience</b> that you find in physical education tools?

If any of these resonate with you, we have a solution!


At CreateBase, we have developed <u>a solution that merges the benefits of physical and digital learning tools</u>.

Our solution enables you and your students to <b>create authentic solutions</b> to <b>real world problems</b> by programming <b>digital robots</b>.

With <b>affordable subscriptions</b>, you and your students can access our growing collection of robots and projects <b>anywhere at anytime</b>!


If you are interested in how we do it and how it can improve your students learning experience, check out <b><a href='https://youtu.be/0y_RbuoMMno'>this video</a></b>.

And then, learn more about us and what other teachers are saying <b><a href='https://createbase.co.nz/'>here.</a></b>.`,
	];
};

cold.teacherUkEmail1 = function (object = {}) {
	return [
		"It's time to move on... from physical robotics",
		`Has ${object.school} ever considered buying <u>Lego Mindstorms, Makeblocks or Spheros</u> but couldn’t because they were <b>outside your budget</b>?

Even if you did, have you run into problems due to the fact that you <b>do not have enough robots for your students</b>?

Are you perhaps using <u>digital education tools</u>, but have noticed these tools <b>don’t have the same authentic and real experience</b> that you find in physical education tools?

If any of these resonate with you, we have a solution!


At CreateBase, we have developed <u>a solution that merges the benefits of physical and digital learning tools</u>.

Our solution enables you and your students to <b>create authentic solutions</b> to <b>real world problems</b> by programming <b>digital robots</b>.

With <b>affordable subscriptions</b>, you and your students can access our growing collection of robots and projects <b>anywhere at anytime</b>!


If you are interested in how we do it and how it can improve your students learning experience, check out <b><a href='https://youtu.be/0y_RbuoMMno'>this video</a></b>.

And then, learn more about us and what other teachers are saying <b><a href='https://createbase.co.nz/'>here.</a></b>.`,
	];
};

// EXPORT ===================================================

module.exports = cold;

// END ======================================================
