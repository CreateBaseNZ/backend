// VARIABLES ================================================

if (process.env.NODE_ENV !== "production") require("dotenv").config();
let product = {
	construct: undefined,
	versionRelease1_1: undefined,
	versionRelease1_2: undefined,
};

// FUNCTIONS ================================================

product.construct = function (object = {}) {
	return product[object.tag](object);
};

product.versionRelease1_1 = function () {
	return [
		`New Exciting Features! Version 1.1 Release!`,
		`Our team is constantly working hard to provide teachers and students with better teaching and learning experiences!

What’s new with the CreateBase platform?

<b>Google Authentication</b>

Teachers and students can now sign up and log in on our platform with their Google accounts.

<b>Save Flow Code 2.0</b>

Saving your flow code is now specific to the task that you are currently working on. Go back to your previous tasks and load your answers to review your solutions!

Check out the full release notes <u><b><a href="${process.env.BACKEND_PREFIX}/release-notes">here</a></b></u>.`,
	];
};

product.versionRelease1_2 = function () {
	return [
		`New Release: Complete Projects with Text Coding! 🎉`,
		`We are constantly working hard to provide teachers and students with better teaching and learning experiences!

<b>What’s new in CreateBase?</b>

<b>Text-based Coding Tool 🧑‍💻</b>
You can now complete our projects with text coding! We currently only support JavaScript but Python will be coming soon!

<b>New Learning Resources for Text Coding 📖</b>
We updated our lesson plans and project contents to support text coding! You won’t need to spend additional time creating resources to deliver our projects with text coding!

<b>Console Tab Indicator 🚦</b>
Your console tab will now blink when you encounter errors (red), warnings (yellow) and logs/messages (grey).

For more info, watch our <u><b><a href="https://youtu.be/mnpfHKO-CSc">What's New video</a></b></u> or check out our <u><b><a href="${process.env.BACKEND_PREFIX}/release-notes">release notes</a></b></u>!`,
	];
};

// EXPORT ===================================================

module.exports = product;

// END ======================================================
