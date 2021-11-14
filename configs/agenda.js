const Agenda = require("agenda");

if (process.env.NODE_ENV !== "production") require("dotenv").config();

const connectionOpts = {
	db: { address: process.env.MONGODB_URL, collection: "agendaJobs" },
};

const agenda = new Agenda(connectionOpts);

agenda.define("say hello", (job) => {
	const date = new Date();
	console.log(`Execute Date: ${date}`);
	console.log("Hello!");
});

agenda.start();

module.exports = agenda;
