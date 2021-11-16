// VARIABLES ================================================

if (process.env.NODE_ENV !== "production") require("dotenv").config();
let cold = {
	construct: undefined,
	segment1NzTest1: undefined,
	segment1NzTest2: undefined,
	segment1NzTest3: undefined,
	segment1NzTest4: undefined,
};

// FUNCTIONS ================================================

cold.construct = function (object = {}) {
	return cold[object.tag](object);
};

cold.segment1NzTest1 = function (object = {}) {
	return ["Cold Email Group 1 Email 1", "I'm just testing our cold email system!"];
};

cold.segment1NzTest2 = function (object = {}) {
	return ["Cold Email Group 1/2 Email 2", "I'm just testing our cold email system!"];
};

cold.segment1NzTest3 = function (object = {}) {
	return ["Cold Email Group 1/2 Email 3", "I'm just testing our cold email system!"];
};

cold.segment1NzTest4 = function (object = {}) {
	return ["Cold Email Group 2 Email 1", "I'm just testing our cold email system!"];
};

// EXPORT ===================================================

module.exports = cold;

// END ======================================================
