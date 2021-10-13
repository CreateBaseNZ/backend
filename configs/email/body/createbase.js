// VARIABLES ================================================

if (process.env.NODE_ENV !== "production") require("dotenv").config();
let createbase = {
	construct: undefined,
	inqNotif: undefined,
	newOrgNotif: undefined,
};

// FUNCTIONS ================================================

createbase.construct = function (object = {}) {
	return createbase[object.tag](object);
};

createbase.inqNotif = function (object = {}) {
	return [
		`New inquiry from ${object.userName}`,
		`We have a new inquiry!

From: ${object.userName} (${object.userEmail})

Subject: ${object.subject}

Message: ${object.message}`,
	];
};

createbase.newOrgNotif = function (object = {}) {
	return [
		`${object.orgName} just joined CreateBase!`,
		`${object.userName} from ${object.orgName} just registered their organisation on our platform!

	Amazing job team! Looking forward to more amazing news!`,
	];
};

// EXPORT ===================================================

module.exports = createbase;

// END ======================================================
