// VARIABLES ================================================

if (process.env.NODE_ENV !== "production") require("dotenv").config();
let createbase = {
	construct: undefined,
	inqNotif: undefined,
	newOrgNotif: undefined,
	errorNotif: undefined,
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
		`${object.orgName} from ${object.orgLocation} just joined CreateBase!`,
		`${object.userName} registered ${object.orgName} on our platform!

Amazing job team! Looking forward to more amazing news!`,
	];
};

createbase.errorNotif = function (object = {}) {
	return [`A user encountered an error!`, `Our user (${object.email}) encountered an error of ${object.type} type in the ${object.route} route.`];
};

// EXPORT ===================================================

module.exports = createbase;

// END ======================================================
