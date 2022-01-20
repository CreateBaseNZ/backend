// VARIABLES ================================================

if (process.env.NODE_ENV !== "production") require("dotenv").config();
let product = {
	construct: undefined,
	versionRelease1_1: undefined,
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

Check out the full release notes <u><b><a href="https://createbase.co.nz/release-notes">here</a></b></u>.`,
	];
};

// EXPORT ===================================================

module.exports = product;

// END ======================================================
