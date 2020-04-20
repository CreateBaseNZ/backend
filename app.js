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

app.use(
  expressSession({
    secret: process.env.COOKIES_SECRET_KEY,
    saveUninitialized: true,
    resave: true,
    rolling: true,
  })
);

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
const fileRouter = require("./routes/public/file.js");
const validationRouter = require("./routes/public/validation.js");
const makeRouter = require("./routes/public/make.js");
const checkoutRouter = require("./routes/public/checkout.js");
const profileRouter = require("./routes/public/profile.js");
app.use(generalRouter);
app.use(fileRouter);
app.use(validationRouter);
app.use(makeRouter);
app.use(checkoutRouter);
app.use(profileRouter);

/*-----------------------------------------------------------------------------------------
ADMIN
-----------------------------------------------------------------------------------------*/

const adminGeneralRoute = require("./routes/admin/general.js");
const adminFileRoute = require("./routes/admin/file.js");
app.use(adminGeneralRoute);
app.use(adminFileRoute);

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
DATABASE MAINTENANCE
=========================================================================================*/

/*=========================================================================================
TEMPORARY - END
=========================================================================================*/
