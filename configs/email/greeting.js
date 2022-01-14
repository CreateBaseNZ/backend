// VARIABLES ================================================

let greeting = {
	construct: undefined,
};

// FUNCTIONS ================================================

greeting.construct = function (object = {}) {
	if (object.greeting) {
		return object.name ? `${object.greeting} ${object.name},` : `${object.greeting},`;
	} else {
		const selectionWithName = ["Hi", "Hello"];
		const selectionWithoutName = ["Hi there,", "Hello,"];
		const index = getRandomInt(2);
		return object.name ? `${selectionWithName[index]} ${object.name},` : selectionWithoutName[index];
	}
};

// HELPERS ==================================================

function getRandomInt(max) {
	return Math.floor(Math.random() * max);
}

// EXPORT ===================================================

module.exports = greeting;

// END ======================================================
