/*=========================================================================================
REQUIRED MODULES
=========================================================================================*/

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const helmet = require("helmet");

/*=========================================================================================
VARIABLES
=========================================================================================*/

if (process.env.NODE_ENV !== "production") require("dotenv").config();
const app = express();

/*=========================================================================================
SETUP DATABASE
=========================================================================================*/

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});

/*=========================================================================================
SETUP SERVER
=========================================================================================*/

app.listen(process.env.PORT, () => console.log(`Server is running at port ${process.env.PORT}`));

/*=========================================================================================
GENERAL MIDDLEWARE
=========================================================================================*/

// Express Middleware: Serve Static Files (HTML, CSS, JS, Images)
app.use(express.static(__dirname));
// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// Parse application/json
app.use(bodyParser.json());
// Security
app.use(helmet({ contentSecurityPolicy: false }));
app.disable('x-powered-by');
// X-XSS Header
app.use((req, res, next) => {
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  res.setHeader("X-Content-Type-Options", "nosniff");
  next();
});

/*=========================================================================================
ROUTES
=========================================================================================*/

const generalRouter = require("./routes/general.js");
const fileRouter = require("./routes/file.js");
const notificationRouter = require("./routes/notification.js");
const contactUsRouter = require("./routes/contact-us.js");
app.use(generalRouter);
app.use(fileRouter);
app.use(notificationRouter);
app.use(contactUsRouter);

/*-----------------------------------------------------------------------------------------
ERROR PAGE
-----------------------------------------------------------------------------------------*/

const errorRouter = require("./routes/error.js");
app.use(errorRouter);

/*=========================================================================================
END
=========================================================================================*/

