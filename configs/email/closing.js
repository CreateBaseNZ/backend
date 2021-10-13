// VARIABLES ================================================

let closing = {
	construct: undefined,
};

// FUNCTIONS ================================================

closing.construct = function (object = {}) {
	const selection = {
		formal: ["Regards,", "Sincerely,", "Best wishes,"],
		friendly: ["Cheers,", "Best,", "As ever,"],
		gratitude: ["Thanks in advance,", "Thanks,", "We appreciate your time,"],
	};
	const index = getRandomInt(3);
	const tone = object.tone ? object.tone : "formal";
	const sender = object.sender ? object.sender : "The CreateBase team";
	let message = `<br>${selection[tone][index]}
	
${sender}`;
	if (object.noSpace) {
		message = `${selection[tone][index]}
	
${sender}`;
	}
	return message;
};

// HELPERS ==================================================

function getRandomInt(max) {
	return Math.floor(Math.random() * max);
}

// EXPORT ===================================================

module.exports = closing;

// END ======================================================
