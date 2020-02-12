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
  useUnifiedTopology: true
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
  cookieSession({
    maxAge: 1000 * 60 * 60 * 24 * 365,
    keys: [process.env.COOKIES_SECRET_KEY]
  })
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
const validationRouter = require("./routes/validation.js");
const paymentRouter = require("./routes/payment.js");
const orderRouter = require("./routes/order.js");
app.use(generalRouter);
app.use(fileRouter);
app.use(errorRouter);
app.use(validationRouter);
app.use(paymentRouter);
app.use(orderRouter);

/*=========================================================================================
END
=========================================================================================*/

/*=========================================================================================
TEMPORARY DEVELOPMENT AREA
=========================================================================================*/

/*=========================================================================================
END OF THE DEVELOPMENT AREA
=========================================================================================*/
