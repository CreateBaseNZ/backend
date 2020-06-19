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

/*-----------------------------------------------------------------------------------------
PUBLIC
-----------------------------------------------------------------------------------------*/

const generalRouter = require("./routes/public/general.js");
const accountRouter = require("./routes/public/account.js");
const fileRouter = require("./routes/public/file.js");
const validationRouter = require("./routes/public/validation.js");
const makeRouter = require("./routes/public/make.js");
const notificationRouter = require("./routes/public/notification.js");
const checkoutRouter = require("./routes/public/checkout.js");
const profileRouter = require("./routes/public/profile.js");
const projectRouter = require("./routes/public/project.js");
const settingsRouter = require("./routes/public/settings.js");
const sessionRouter = require("./routes/public/session.js");
app.use(generalRouter);
app.use(accountRouter);
app.use(fileRouter);
app.use(validationRouter);
app.use(makeRouter);
app.use(notificationRouter);
app.use(checkoutRouter);
app.use(profileRouter);
app.use(projectRouter);
app.use(settingsRouter);
app.use(sessionRouter);

/*-----------------------------------------------------------------------------------------
ADMIN
-----------------------------------------------------------------------------------------*/

const adminGeneralRoute = require("./routes/admin/general.js");
const adminFileRoute = require("./routes/admin/file.js");
const adminMakeRoute = require("./routes/admin/make.js");
const adminDiscountRoute = require("./routes/admin/discount.js");
app.use(adminGeneralRoute);
app.use(adminFileRoute);
app.use(adminMakeRoute);
app.use(adminDiscountRoute);

/*-----------------------------------------------------------------------------------------
ERROR PAGE
-----------------------------------------------------------------------------------------*/

const errorRouter = require("./routes/public/error.js");
app.use(errorRouter);

/*=========================================================================================
END
=========================================================================================*/

/*=========================================================================================
TEMPORARY - START
=========================================================================================*/

/*=========================================================================================
TEMPORARY - END
=========================================================================================*/
