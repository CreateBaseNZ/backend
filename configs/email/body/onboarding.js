// VARIABLES ================================================

if (process.env.NODE_ENV !== "production") require("dotenv").config();
let onboarding = {
	construct: undefined,
};

// FUNCTIONS ================================================

onboarding.construct = function (object = {}) {
	return onboarding[object.tag](object);
};

// EXPORT ===================================================

module.exports = onboarding;

// END ======================================================
