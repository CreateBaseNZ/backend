/*=========================================================================================
REQUIRED MODULES
=========================================================================================*/

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
const passport = require("passport");

/*=========================================================================================
VARIABLES
=========================================================================================*/

const app = express();
const port = process.env.PORT || 80;
const mongoAtlasURI = require("./config/database.js").mongoAtlasURI;
const keys = require("./config/keys.js");

/*=========================================================================================
SETUP DATABASE
=========================================================================================*/

mongoose.connect(mongoAtlasURI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});

/*=========================================================================================
SETUP SERVER
=========================================================================================*/

app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});

/*=========================================================================================
GENERAL MIDDLEWARE
=========================================================================================*/

// Express Middleware: Serve Static Files (HTML, CSS, JS, Images)
app.use(express.static(path.join(__dirname, "/public")));
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
  cookieSession({ maxAge: 1000 * 60 * 60 * 24 * 365, keys: [keys.cookieKey] })
);
app.use(passport.initialize());
app.use(passport.session());
require("./config/passport.js");

/*=========================================================================================
ROUTES
=========================================================================================*/

const generalRouter = require("./routes/general.js");
const fileRouter = require("./routes/file.js");
const errorRouter = require("./routes/error.js");
app.use(generalRouter);
app.use(fileRouter);
app.use(errorRouter);

/*=========================================================================================
END
=========================================================================================*/
