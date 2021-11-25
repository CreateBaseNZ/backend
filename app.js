// MODULES ==================================================

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const cors = require("cors");

// VARIABLES ================================================

if (process.env.NODE_ENV !== "production") require("dotenv").config();
const app = express();

// DATABASE =================================================

mongoose.connect(process.env.MONGODB_URL);

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
app.use(authRouter);
const classRouter = require("./routes/class.js");
app.use(classRouter);
const contactRouter = require("./routes/contact.js");
app.use(contactRouter);
const generalRouter = require("./routes/general.js");
app.use(generalRouter);
const groupRouter = require("./routes/group.js");
app.use(groupRouter);
const licenseRouter = require("./routes/license.js");
app.use(licenseRouter);
const mailRouter = require("./routes/mail.js");
app.use(mailRouter);
const profileRouter = require("./routes/profile.js");
app.use(profileRouter);
const tempRouter = require("./routes/temp.js");
app.use(tempRouter);

const errorRouter = require("./routes/error.js");
app.use(errorRouter);

// END ======================================================
