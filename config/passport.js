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
        return done(null, false);
      }
      // CREATE AN ACCOUNT INSTANCE
      let account;
      try {
        account = await Account.create("customer", email, password);
      } catch (error) {
        return done(null, false);
      }
      // CREATE A CUSTOMER INSTANCE
      try {
        await Customer.create(account._id, displayName);
      } catch (error) {
        // TO DO.....
        // Delete the newly created account instance
        // TO DO.....
        return done(null, false);
      }
      // ASSIGN MAKES ASSOCIATED WITH THE SESSION
      try {
        await Make.merge(account._id, sessionId);
      } catch (error) {
        // TO DO.....
        // Delete the newly created account and customer instances
        // TO DO.....
        return done(null, false);
      }
      try {
        await Order.merge(account._id, sessionId);
      } catch (error) {
        // TO DO.....
        // Delete the newly created account and customer instances
        // AND demerge makes
        // TO DO.....
        return done(null, false);
      }
      // SEND ACCOUNT VERIFICATION
      try {
        await Account.verification(email);
      } catch (error) {
        // TO DO.....
        // Delete the newly created account and customer instances
        // AND demerge makes
        // TO DO.....
        return done(null, false);
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
  }, async (email, password, done) => {
    // FETCH ACCOUNT WHICH THE EMAIL IS ASSOCIATED WITH
    let account;
    try {
      account = await Account.findOne({ email });
    } catch (error) {
      return done(null, false);
    }
    // MATCH THE ENTERED PASSWORD WITH THE ACCOUNTS PASSWORD
    let match;
    try {
      match = await account.login(password);
    } catch (error) {
      return done(null, false);
    }
    if (!match) return done(null, false);
    // UPDATE ACCOUNT LAST VISITED
    // Return the user if all is successful
    return done(null, account);
  }
);
// Enable use of the local strategy
passport.use("local-customer-login", LocalCustomerLogin);

/*=========================================================================================
END
=========================================================================================*/
