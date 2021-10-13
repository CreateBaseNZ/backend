// VARIABLES ================================================

if (process.env.NODE_ENV !== "production") require("dotenv").config();
let cold = {
	construct: undefined,
};

// FUNCTIONS ================================================

cold.construct = function (object = {}) {
	return cold[object.tag](object);
};

// EXPORT ===================================================

module.exports = cold;

// END ======================================================
