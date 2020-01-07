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
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true
  },
  (req, email, password, done) => {
    process.nextTick(() => {
      Account.findOne({ email }, (err, user) => {
        if (err) return done(null, err);

        if (user) return done(null, false);

        let newUser = new Account({
          type: "customer",
          email,
          password
        });

        newUser.save((err, user) => {
          if (err) return done(null, err);

          let newCustomer = new Customer({
            accountId: user._id,
            displayName: req.body.displayName
          });

          newCustomer.save((err, customer) => {
            if (err) return done(null, err);

            return done(null, user);
          });
        });
      });
    });
  }
);

passport.use("local-customer-signup", LocalCustomerSignup);

/*=========================================================================================
PASSPORT - LOCAL STRATEGY - CUSTOMER LOGIN
=========================================================================================*/

const LocalCustomerLogin = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password"
  },
  (email, password, done) => {
    Account.findOne({ email }, (err, user) => {
      if (err) return done(null, err);

      if (!user) return done(null, false);

      if (!user.validatePassword(password)) return done(null, false);

      return done(null, user);
    });
  }
);

passport.use("local-customer-login", LocalCustomerLogin);

/*=========================================================================================
END
=========================================================================================*/
