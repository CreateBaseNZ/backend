// MODULES ==================================================

const express = require("express");
const path = require("path");

// VARIABLES ================================================

const router = new express.Router();
const viewsOption = { root: path.join(__dirname, "../views") };

// ROUTES ===================================================

router.get("*", (req, res) => res.status(404).sendFile("error-404.html", viewsOption));

// EXPORT ===================================================

module.exports = router;

// END ======================================================
