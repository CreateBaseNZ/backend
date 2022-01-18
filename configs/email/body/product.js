// VARIABLES ================================================

if (process.env.NODE_ENV !== "production") require("dotenv").config();
let product = {
	construct: undefined,
	test: undefined,
};

// FUNCTIONS ================================================

product.construct = function (object = {}) {
	return product[object.tag](object);
};

product.test = function () {
	return [`Testing Product Email System`, `Hello World!`];
};

// EXPORT ===================================================

module.exports = product;

// END ======================================================
