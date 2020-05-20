/*=========================================================================================
REQUIRED MODULES
=========================================================================================*/

const passport = require("passport");
const LocalStrategy = require("passport-local");

/*=========================================================================================
MODELS
=========================================================================================*/

const Account = require("./../model/Account.js");
const Customer = require("./../model/Customer.js");
const Make = require("./../model/Make.js");
const Order = require("./../model/Order.js");

/*=========================================================================================
SESSIONS
=========================================================================================*/

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  Account.findById(id, (err, user) => {
    done(err, user);
  });
});

/*=========================================================================================
PASSPORT - LOCAL STRATEGY - CUSTOMER SIGNUP
=========================================================================================*/

const LocalCustomerSignup = new LocalStrategy(
  {
    // By default, local strategy uses username and password, we will override with email
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true // Allows us to pass back the entire request to the callback
  }, (req, email, password, done) => {
    process.nextTick(async () => {
      // DECLARE AND INITIALISE VARIABLES
      const sessionId = req.sessionID;
      const displayName = req.body.displayName;
      // VALIDATION
      if (!sessionId) {
        return done("no session id provided");
      }
      try {
        await Customer.validateDisplayName(displayName);
      } catch (error) {
        return done(error, false);
      }
      // CREATE AN ACCOUNT INSTANCE
      let account;
      try {
        account = await Account.create("customer", email, password);
      } catch (error) {
        return done(error, false);
      }
      // CREATE A CUSTOMER INSTANCE
      try {
        await Customer.create(account._id, email, displayName);
      } catch (error) {
        // TO DO.....
        // Delete the newly created account instance
        // TO DO.....
        return done(error, false);
      }
      // ASSIGN MAKES ASSOCIATED WITH THE SESSION
      try {
        await Make.merge(account._id, sessionId);
      } catch (error) {
        // TO DO.....
        // Delete the newly created account and customer instances
        // TO DO.....
        return done(error, false);
      }
      try {
        await Order.merge(account._id, sessionId);
      } catch (error) {
        // TO DO.....
        // Delete the newly created account and customer instances
        // AND demerge makes
        // TO DO.....
        return done(error, false);
      }
      // SUCCESS HANDLER
      return done(null, account);
    });
  }
);
// Enable use of the local strategy
passport.use("local-customer-signup", LocalCustomerSignup);

/*=========================================================================================
PASSPORT - LOCAL STRATEGY - CUSTOMER LOGIN
=========================================================================================*/

const LocalCustomerLogin = new LocalStrategy(
  {
    // By default, local strategy uses username and password, we will override with email
    usernameField: "email",
    passwordField: "password"
  },
  (email, password, done) => {
    // Find the user that is signing in
    Account.findOne({ email }, async (err, user) => {
      // Check if there is an error found when fetching user
      if (err) return done(err);
      // Check if no user was found
      if (!user) return done(null, false);
      // Validate the password of the user
      let isMatch;
      try {
        isMatch = await user.comparePassword(password);
      } catch (error) {
        return done(error);
      }
      if (!isMatch) return done(null, false);
      // Return the user if all is successful
      return done(null, user);
    });
  }
);
// Enable use of the local strategy
passport.use("local-customer-login", LocalCustomerLogin);

/*=========================================================================================
END
=========================================================================================*/
