/*=========================================================================================
REQUIRED MODULES
=========================================================================================*/

const express = require("express");

/*=========================================================================================
VARIABLES
=========================================================================================*/

if (process.env.NODE_ENV !== "production") require("dotenv").config();
const router = new express.Router();
const email = require("../configs/email.js");

/*=========================================================================================
MODELS
=========================================================================================*/

const Mail = require("../model/Mail.js");

/*=========================================================================================
ROUTES
=========================================================================================*/

// @route     POST /notification/subscribe-email
// @desc
// @access    Public
router.post("/notification/subscribe-email", async (req, res) => {
	const email = req.body.email;
	// CREATE MAIL
	let mail;
	try {
		mail = await Mail.subscribe({ email });
	} catch (data) {
		return res.send(data);
	}
	// SEND SUCCESS
	return res.send({ status: "succeeded", content: "Subscription successful!" });
});

// @route     POST /notification/unsubscribe-email
// @desc
// @access    Public
router.post("/notification/unsubscribe-email", async (req, res) => {
	const object = { email: req.body.email };
	// DELETE MAIL
	try {
		await Mail.demolish(object);
	} catch (data) {
		return res.send(data);
	}
	// SEND SUCCESS
	res.send({ status: "succeeded", content: "You are now unsubscribed!" });
});

// @route     POST /mail/admin/send-newsletter
// @desc
// @access    Public
router.post("/mail/admin/send-newsletter", async (req, res) => {
	// Validate if the PRIVATE_API_KEY match
	if (req.body.PRIVATE_API_KEY !== process.env.PRIVATE_API_KEY) {
		return res.send({ status: "critical error", content: "" });
	}
	// Validate if the ADMIN_API_KEY match
	if (req.body.ADMIN_API_KEY !== process.env.ADMIN_API_KEY) {
		return res.send({ status: "critical error", content: "" });
	}
	// Fetch all emails from the subscriber list
	let mails;
	try {
		mails = await Mail.find();
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	// Process each emails
	for (let i = 0; i < mails.length; i++) {
		let mail = mails[i];
		// Check if the newsletter has already been sent

		// Send the email if it has been sent

		// Update the mail to add the newsletter to the list
	}
	// Create the list of emails
	const emails = mails.map((mail) => mail.email);
	// Send the newsletter;
	let promises1 = [];
	for (let i = 0; i < emails.length; i++) {
		const emailAddress = emails[i];
		const object = { email: emailAddress, subject: req.body.input.subject, text: req.body.input.text, html: req.body.input.html };
		const promise = new Promise((resolve, reject) => {
			setTimeout(async function () {
				let mail;
				try {
					mail = await email.create(object, "newsletter-raw");
				} catch (data) {
					return reject(data);
				}
				try {
					await email.send(mail);
				} catch (data) {
					return reject(data);
				}
				return resolve();
			}, 12.5 * i);
		});
		promises1.push(promise);
	}
	try {
		await Promise.all(promises1);
	} catch (data) {
		return res.send(data);
	}
	// Update the status of each mail to add the group

	// Success handler
	return res.send({ status: "succeeded", content: undefined });
});

/*=========================================================================================
EXPORT ROUTE
=========================================================================================*/

module.exports = router;

/*=========================================================================================
END
=========================================================================================*/
