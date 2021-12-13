// MODULES ==================================================

if (process.env.NODE_ENV !== "production") require("dotenv").config();
const express = require("express");
const path = require("path");
const axios = require("axios");
const moment = require("moment");
const { google } = require("googleapis");

// VARIABLES ================================================

const router = new express.Router();
const viewsOption = { root: path.join(__dirname, "../views") };
if (process.env.NODE_ENV !== "production") require("dotenv").config();

// MIDDLEWARE ===============================================

const checkAPIKeys = (public = false, private = false, admin = false) => {
  return (req, res, next) => {
    if (public && req.body.PUBLIC_API_KEY !== process.env.PUBLIC_API_KEY) {
      return res.send({ status: "critical error" });
    }
    if (private && req.body.PRIVATE_API_KEY !== process.env.PRIVATE_API_KEY) {
      return res.send({ status: "critical error" });
    }
    if (admin && req.body.ADMIN_API_KEY !== process.env.ADMIN_API_KEY) {
      return res.send({ status: "critical error" });
    }
    return next();
  };
};

// MODELS ===================================================

const Mail = require("../model/Mail.js");
const Data = require("../model/Data.js");

// ROUTES ===================================================

// @route     Get /
// @desc
// @access    Public
router.get("/", (req, res) => res.sendFile("home.html", viewsOption));

// @route     Get /team
// @desc
// @access    Public
router.get("/team", (req, res) => res.sendFile("team.html", viewsOption));

// @route     Get /about
// @desc
// @access    Public
router.get("/about", (req, res) => res.sendFile("about.html", viewsOption));

// @route     Get /latest
// @desc
// @access    Public
router.get("/latest", (req, res) => res.sendFile("latest.html", viewsOption));

// @route     GET /terms
// @desc
// @access    PUBLIC
router.get("/terms", (req, res) => res.sendFile("terms.html", viewsOption));

// @route     GET /contact
// @desc
// @access    PUBLIC
router.get("/contact", (req, res) => res.sendFile("contact.html", viewsOption));

// @route     GET /privacy
// @desc
// @access    PUBLIC
router.get("/privacy", (req, res) => res.sendFile("privacy.html", viewsOption));

// @route     GET /landing
// @desc
// @access    PUBLIC
router.get("/landing", (req, res) => res.sendFile("landing.html", viewsOption));

// @route     GET /release-notes
// @desc
// @access    PUBLIC
router.get("/release-notes", (req, res) =>
  res.sendFile("release-notes.html", viewsOption)
);

// @route     GET /robots.txt
// @desc
// @access    PUBLIC
router.get("/robots.txt", (req, res) =>
  res.sendFile("robots.txt", viewsOption)
);

// @route     POST /tracking
// @desc
// @access    Public
router.post("/tracking", checkAPIKeys(false, true), async (req, res) => {
  let data;
  try {
    data = (await Data.find())[0];
  } catch (error) {
    return res.send({ status: "error", content: error });
  }
  return res.send({ status: "succeeded", content: data.content });
});

// @route     GET /fetch-release-notes
// @desc
// @access    Public
router.get("/fetch-release-notes", async (req, res) => {
  // Set authentication
  const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });
  // Create client instance for auth
  const client = await auth.getClient();
  // Create instance of Google Sheets API
  const googleSheets = google.sheets({ version: "v4", auth: client });
  const spreadsheetId = "1iopXot5OoZwc1KAsztCCxpiQILCK8tsvxCcHdBCv33Q";
  let i = 0;
  let releaseNotes = [];
  while (true) {
    let releaseNote = { version: undefined, content: [] };
    let result;
    try {
      result = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: i.toString(),
      });
    } catch (error) {
      break;
    }
    let values = result.data.values;
    releaseNote.version = values[0][1];
    values.shift();
    values.shift();
    for (let j = 0; j < values.length; j++) {
      const value = values[j];
      if (value[0] === "image") {
        releaseNote.content.push({ type: value[0], url: value[1] });
      } else {
        releaseNote.content.push({ type: value[0], html: value[1] });
      }
    }
    releaseNotes.push(releaseNote);
    i++;
  }
  return res.send(releaseNotes);
});

// EXPORT ===================================================

module.exports = router;

// END ======================================================
