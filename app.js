/*=========================================================================================
REQUIRED MODULES
=========================================================================================*/

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
const expressSession = require("express-session");
const passport = require("passport");

/*=========================================================================================
VARIABLES
=========================================================================================*/

const app = express();
const maintenance = require("./config/maintenance.js");

/*=========================================================================================
SETUP DATABASE
=========================================================================================*/

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

/*=========================================================================================
SETUP SERVER
=========================================================================================*/

app.listen(process.env.PORT, () => {
  console.log(`Server is running at port ${process.env.PORT}`);
  maintenance();
});

/*=========================================================================================
GENERAL MIDDLEWARE
=========================================================================================*/

// Express Middleware: Serve Static Files (HTML, CSS, JS, Images)
app.use(express.static(__dirname));
// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// Parse application/json
app.use(bodyParser.json());
// Parse Cookie header and populate req.cookies
app.use(cookieParser());

/*=========================================================================================
SETUP AUTHENTICATION (PASSPORT JS)
=========================================================================================*/

app.use(expressSession({
  secret: process.env.COOKIES_SECRET_KEY, saveUninitialized: true,
  resave: true, rolling: true, sameSite: "none"
}));

app.use(passport.initialize());
app.use(passport.session());
require("./config/passport.js");

/*=========================================================================================
ROUTES
=========================================================================================*/

const generalRouter = require("./routes/general.js");
const accountRouter = require("./routes/account.js");
const fileRouter = require("./routes/file.js");
const validationRouter = require("./routes/validation.js");
const makeRouter = require("./routes/make.js");
const notificationRouter = require("./routes/notification.js");
const checkoutRouter = require("./routes/checkout.js");
const sessionRouter = require("./routes/session.js");
const changePasswordRouter = require("./routes/change-password.js");
app.use(generalRouter);
app.use(accountRouter);
app.use(fileRouter);
app.use(validationRouter);
app.use(makeRouter);
app.use(notificationRouter);
app.use(checkoutRouter);
app.use(sessionRouter);
app.use(changePasswordRouter);

/* ----------------------------------------------------------------------------------------
PROFILE
---------------------------------------------------------------------------------------- */

const profileRouter = require("./routes/profile.js");
const projectRouter = require("./routes/profile/project.js");
const ordersRouter = require("./routes/profile/orders.js");
const settingsRouter = require("./routes/profile/settings.js");
app.use(profileRouter);
app.use(projectRouter);
app.use(ordersRouter);
app.use(settingsRouter);

/*-----------------------------------------------------------------------------------------
ERROR PAGE
-----------------------------------------------------------------------------------------*/

const errorRouter = require("./routes/error.js");
app.use(errorRouter);

/*=========================================================================================
END
=========================================================================================*/

