// VARIABLES ================================================

let greeting = {
	construct: undefined,
};

// FUNCTIONS ================================================

greeting.construct = function (object = {}) {
	const selectionWithName = ["Hi", "Hello"];
	const selectionWithoutName = ["Hi there,", "Hello,"];
	const index = getRandomInt(2);
	return object.name ? `${selectionWithName[index]} ${object.name},` : selectionWithoutName[index];
};

// HELPERS ==================================================

function getRandomInt(max) {
	return Math.floor(Math.random() * max);
}

// EXPORT ===================================================

module.exports = greeting;

// END ======================================================
