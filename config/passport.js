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
  },
  (req, email, password, done) => {
    process.nextTick(() => {
      Account.findOne({ email }, (err, user) => {
        // Check if there is an error found when fetching user
        if (err) return done(err);
        // Check if a user was found
        if (user) return done(null, false);
        // If there's no error nor existing user with the same email
        // Create a new user
        let newUser = new Account({
          type: "customer",
          email,
          password
        });
        // Save the new user
        newUser.save((err, user) => {
          // Check if there is an error found when saving the new user
          if (err) return done(err);
          // Initiate the new customer detail object and assign values
          let newCustomer = new Customer({
            accountId: user._id,
            displayName: req.body.displayName
          });
          // Save the new customer detail object to the database
          newCustomer.save((err, customer) => {
            // Check if there is an error
            if (err) return done(err);
            // Return the user if signup is successful
            return done(null, user);
          });
        });
      });
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
        isMatch = await user.validatePassword(password);
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
