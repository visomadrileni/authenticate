const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

//passport -> is general helper for handling auth in express app
//passport strategy -> helpers foe authenticating with one over specific method(email/password,Google,Facebook)

/*
The local authentication strategy authenticates users using a username and
password.The strategy requires a verify callback,which accepts these 
credentials and calls done providing a user.

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if (!user.verifyPassword(password)) { return done(null, false); }
      return done(null, user);
    });
  }
));
*/


// Create local strategy
const localOptions = { usernameField: 'email' };
const localLogin = new LocalStrategy(localOptions,function(email,password,done) {
  // Verify this email and password, call done with the user
  // if it is the correct email and password
  // otherwise, call done with false
  User.findOne({ email: email }, function(err, user) {
    if (err) { return done(err); }
    if (!user) { return done(null, false); }

    // compare passwords - is `password` equal to user.password?
    user.comparePassword(password, function(err, isMatch) {
      if (err) { return done(err); }
      if (!isMatch) { return done(null, false); }

      return done(null, user);
    });
  });
});

// Setup options for JWT Strategy, ExtractJwt.fromHeader() click on "header"
// in the name type "authorization" and value field paste the received token
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
};

// Create JWT strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
  // See if the user ID in the payload exists in our database
  // If it does,call 'done' with that other otherwise,call done without a user object
  //because we`re querying by _id,we use Model.findById()
  User.findById(payload.sub, function(err, user) {
    if (err) { return done(err, false); }

    if(user){ done(null, user);
    }else{ done(null, false); }
  });
});

// Tell passport to use this strategy,both allows only requests with valid tokens to access some special routes needing authentication
passport.use(jwtLogin);
passport.use(localLogin);
