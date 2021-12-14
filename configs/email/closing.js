// VARIABLES ================================================

let closing = {
	construct: undefined,
	signatures: {
		carl: `Carl Velasco
CEO
CreateBase Limited`,
		brydon: `Brydon Burnett
General Manager
CreateBase Limited`,
		todd: `Todd Broadhurst
General Manager
CreateBase Limited`,
	},
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
	let sender = object.sender ? object.sender : "The CreateBase team";
	if (object.alias) {
		const alias = object.alias.toLowerCase();
		sender = closing.signatures[alias] ? closing.signatures[alias] : `${alias.charAt(0).toUpperCase() + alias.slice(1)} and the CreateBase team`;
	}
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
