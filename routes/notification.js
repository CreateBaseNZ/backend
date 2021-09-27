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
const License = require("../model/License.js");
const Profile = require("../model/Profile.js");
const Account = require("../model/Account.js");

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
	let promises = [];
	for (let i = 0; i < mails.length; i++) {
		let mail = mails[i];
		// Check if the newsletter has already been sent
		if (mail.received.indexOf(req.body.input.group) === -1) {
			// Process: Send the newsletter
			const promise = new Promise((resolve, reject) => {
				setTimeout(async function () {
					// Send the email if it has been sent
					const object = { email: mail.email, subject: req.body.input.subject, body: req.body.input.body };
					let mailObject;
					try {
						mailObject = await email.create(object, "email-newsletter");
					} catch (data) {
						return reject(data);
					}
					try {
						await email.send(mailObject);
					} catch (data) {
						return reject(data);
					}
					// Update the mail to add the newsletter to the list
					mail.received.push(req.body.input.group);
					try {
						await mail.save();
					} catch (error) {
						return reject({ status: "error", content: error });
					}
					// Success handler
					return resolve();
				}, i * 25);
			});
			promises.push(promise);
		}
	}
	// Wait for the emails to be sent
	try {
		await Promise.all(promises);
	} catch (data) {
		return res.send(data);
	}
	// Success handler
	return res.send({ status: "succeeded", content: undefined });
});

// @route     POST /mail/admin/email-educator
// @desc
// @access    Public
router.post("/mail/admin/email-educator", async (req, res) => {
	// Validate if the PRIVATE_API_KEY match
	if (req.body.PRIVATE_API_KEY !== process.env.PRIVATE_API_KEY) {
		return res.send({ status: "critical error", content: "" });
	}
	// Validate if the ADMIN_API_KEY match
	if (req.body.ADMIN_API_KEY !== process.env.ADMIN_API_KEY) {
		return res.send({ status: "critical error", content: "" });
	}
	// Fetch the licenses
	let licenses;
	try {
		licenses = await License.find();
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	// Filter non admin or educator licenses
	const filteredLicenses = licenses.filter((license) => license.access === "educator");
	const profileIds = filteredLicenses.map((license) => license.profile);
	// Fetch the profiles
	let profiles;
	try {
		profiles = await Profile.find({ _id: profileIds });
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	const accountIds = profiles.map((profile) => profile.account.local);
	// Fetch the accounts
	let accounts;
	try {
		accounts = await Account.find({ _id: accountIds });
	} catch (error) {
		return res.send({ status: "error", content: error });
	}
	console.log(accounts);
	// Send the email
	let promises = [];
	let receivers = [];
	for (let i = 0; i < accounts.length; i++) {
		const account = accounts[i];
		// Process: Send the newsletter
		const promise = new Promise((resolve, reject) => {
			setTimeout(async function () {
				// Send the email if it has been sent
				const object = { email: account.email, subject: req.body.input.subject, body: req.body.input.body };
				let mail;
				try {
					mail = await email.create(object, "email-raw");
				} catch (data) {
					return reject(data);
				}
				try {
					await email.send(mail);
				} catch (data) {
					return reject(data);
				}
				receivers.push(account.email);
				// Success handler
				return resolve();
			}, i * 25);
		});
		promises.push(promise);
	}
	// Wait for the emails to be sent
	try {
		await Promise.all(promises);
	} catch (data) {
		return res.send(data);
	}
	// Success handler
	return res.send({ status: "succeeded", content: receivers });
});

/*=========================================================================================
EXPORT ROUTE
=========================================================================================*/

module.exports = router;

/*=========================================================================================
END
=========================================================================================*/
