/*=========================================================================================
REQUIRED MODULES
=========================================================================================*/

const mongoose = require("mongoose");
const moment = require("moment-timezone");

/*=========================================================================================
VARIABLES
=========================================================================================*/

if (process.env.NODE_ENV !== "production") require("dotenv").config();
const Schema = mongoose.Schema;
const email = require("../configs/email.js");
const reject = require("lodash.reject");

/*=========================================================================================
CREATE MAILING MODEL
=========================================================================================*/

const MailSchema = new Schema({
	email: { type: Schema.Types.String, required: true },
	account: { type: Schema.Types.ObjectId },
	received: { type: [Schema.Types.String], default: new Array() },
	notification: {
		newsletter: { type: Schema.Types.Boolean, default: false },
		onboarding: { type: Schema.Types.Boolean, default: false },
		product: { type: Schema.Types.Boolean, default: false },
		cold: { type: Schema.Types.Boolean, default: false },
	},
	metadata: { type: Schema.Types.Mixed, default: new Object() },
});

// STATICS ==================================================

// METHODS ==================================================

MailSchema.methods.sendEmail = function () {
	return new Promise(async (resolve, reject) => {
		return resolve();
	});
};

// EXPORT ===================================================

module.exports = Mail = mongoose.model("mail", MailSchema);

// END ======================================================
