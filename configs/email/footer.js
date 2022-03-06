// VARIABLES ================================================

let footer = {
	construct: undefined,
};

// FUNCTIONS ================================================

footer.construct = function (object = {}) {
	const site = `
	
Want to know more? Visit our <b><a href='${process.env.PREFIX_WEBSITE}'>website</a></b> and our <b><a href='${process.env.PREFIX_APP}'>application</a></b>.`;
	const help = `
	
Join our exclusive <b><a href='https://www.facebook.com/groups/createbaseteacherscommunity'>Facebook group</a></b> for teachers and receive quick responses to your questions. Check if we have answered your questions in our <b><a href='${process.env.PREFIX_APP}/faq'>FAQ page</a></b>.`;
	const social = `
	
Follow our social media and stay up-to-date with the latest news: <b><a href='https://www.facebook.com/CreateBaseNZ'>Facebook</a></b>, <b><a href='https://twitter.com/CreateBaseNZ'>Twitter</a></b>, <b><a href='https://www.instagram.com/createbasenz/'>Instagram</a></b> and <b><a href='https://www.youtube.com/channel/UClLBwFvHpGrRpxyRg1IOB0g'>YouTube</a></b>.`;
	const unsubscribe = `
	
Click <b><a href='${process.env.PREFIX_BACKEND}/mail/unsubscribe-newsletter/${object.recipient}'>here</a></b> to unsubscribe from our newsletters.`;
	const unsubscribeCold = `
	
Click <b><a href='${process.env.PREFIX_BACKEND}/mail/unsubscribe-cold/${object.recipient}'>here</a></b> to unsubscribe from our mailing list.`;
	let message = "";
	if (object.site) {
		message += site;
	}
	if (object.help) {
		message += help;
	}
	if (object.social) {
		message += social;
	}
	if (object.unsubscribe) {
		message += unsubscribe;
	}
	if (object.unsubscribeCold) {
		message += unsubscribeCold;
	}
	return `<i>${message}</i>`;
};

// EXPORT ===================================================

module.exports = footer;

// END ======================================================
