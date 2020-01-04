/*=========================================================================================
REQUIRED MODULES
=========================================================================================*/

const express = require("express");
const path = require("path");

/*=========================================================================================
VARIABLES
=========================================================================================*/

const app = express();
const port = process.env.PORT || 80;

/*=========================================================================================
SETUP SERVER
=========================================================================================*/

app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});

/*=========================================================================================
MIDDLEWARE
=========================================================================================*/

// Express Middleware: Serve Static Files (HTML, CSS, JS, Images)
app.use(express.static(path.join(__dirname, "/public")));

/*=========================================================================================
ROUTES
=========================================================================================*/

require("./routes/general.js")(app);
require("./routes/error.js")(app);

/*=========================================================================================
END
=========================================================================================*/
