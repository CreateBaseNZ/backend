// VARIABLES ================================================

if (process.env.NODE_ENV !== "production") require("dotenv").config();
let cold = {
	construct: undefined,
	testNzSecondary: undefined,
};

// FUNCTIONS ================================================

cold.construct = function (object = {}) {
	return cold[object.tag](object);
};

cold.testNzSecondary = function (object = {}) {
	return ["Cold Email System", "I'm just testing our cold email system!"];
};

// EXPORT ===================================================

module.exports = cold;

// END ======================================================
