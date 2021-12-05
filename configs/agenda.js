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

agenda.start();
agenda.on("ready", function () {
	agenda.every("1 minute", "update-data");
});

// EXPORT ===================================================

module.exports = agenda;

// END ======================================================
