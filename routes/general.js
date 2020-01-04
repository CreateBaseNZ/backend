/*=========================================================================================
REQUIRED MODULES
=========================================================================================*/

const path = require("path");

/*=========================================================================================
VARIABLES
=========================================================================================*/

const customerRouteOptions = {
  root: path.join(__dirname, "../views/public")
};

module.exports = app => {
  /*=======================================================================================
  ROUTES
  =======================================================================================*/

  // @route     Get /
  // @desc      Homepage
  // @access    Public
  app.get("/", (req, res) => {
    res.sendFile("homepage.html", customerRouteOptions);
  });

  // @route     Get /login
  // @desc      Login Page
  // @access    Public
  app.get("/login", (req, res) => {
    res.sendFile("login.html", customerRouteOptions);
  });

  // @route     Get /signup
  // @desc      Signup Page
  // @access    Public
  app.get("/signup", (req, res) => {
    res.sendFile("signup.html", customerRouteOptions);
  });

  /*=======================================================================================
  END
  =======================================================================================*/
};
