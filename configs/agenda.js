// MODULES ==================================================

const Agenda = require("agenda");

// VARIABLES ================================================

if (process.env.NODE_ENV !== "production") require("dotenv").config();
const agenda = new Agenda({
	db: { address: process.env.MONGODB_URL, collection: "agendaJobs" },
});

// DEFINE ===================================================

require("../jobs/main.js")(agenda);

// START ====================================================

(async function () {
	await agenda.start();

	await agenda.every("1 minute", "update-data");

	await agenda.now("delete-us");
})();

// EXPORT ===================================================

module.exports = agenda;

// END ======================================================
