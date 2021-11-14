// MODULES ==================================================

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const cors = require("cors");
const agenda = require("./configs/agenda.js");

// VARIABLES ================================================

if (process.env.NODE_ENV !== "production") require("dotenv").config();
const app = express();

// DATABASE =================================================

mongoose.connect(process.env.MONGODB_URL);

// AGENDA ===================================================

// agenda.on("ready", () => {
// 	const date = new Date();
// 	console.log(`Current Date: ${date}`);
// 	const jobDate = new Date(date.setMinutes(new Date().getMinutes() + 3));
// 	console.log(`Job Date: ${jobDate}`);
// 	agenda.schedule(date, "say hello");
// });

// SERVER ===================================================

app.listen(process.env.PORT, () => console.log(`Server is running at port ${process.env.PORT}`));

// MIDDLEWARE ===============================================

// Express Middleware: Serve Static Files (HTML, CSS, JS, Images)
app.use(express.static(__dirname));
// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// Parse application/json
app.use(bodyParser.json());
// Security
app.use(helmet({ contentSecurityPolicy: false }));
// X-XSS Header
app.use((req, res, next) => {
	res.setHeader("X-XSS-Protection", "1; mode=block");
	res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
	res.setHeader("X-Content-Type-Options", "nosniff");
	res.removeHeader("X-Powered-By");
	res.removeHeader("Server");
	next();
});
app.use(cors());

// ROUTES ===================================================

const authRouter = require("./routes/auth.js");
const classRouter = require("./routes/class.js");
const contactRouter = require("./routes/contact.js");
const errorRouter = require("./routes/error.js");
const generalRouter = require("./routes/general.js");
const groupRouter = require("./routes/group.js");
const licenseRouter = require("./routes/license.js");
const mailRouter = require("./routes/mail.js");
const profileRouter = require("./routes/profile.js");
app.use(authRouter);
app.use(classRouter);
app.use(contactRouter);
app.use(generalRouter);
app.use(groupRouter);
app.use(licenseRouter);
app.use(mailRouter);
app.use(profileRouter);

app.use(errorRouter);

// END ======================================================
