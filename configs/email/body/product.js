// VARIABLES ================================================

if (process.env.NODE_ENV !== "production") require("dotenv").config();
let product = {
	construct: undefined,
};

// FUNCTIONS ================================================

product.construct = function (object = {}) {
	return product[object.tag](object);
};

// EXPORT ===================================================

module.exports = product;

// END ======================================================
