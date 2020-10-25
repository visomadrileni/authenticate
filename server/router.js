const Authentication = require('./controllers/authentication');
const passportService = require('./services/passport');
const passport = require('passport');

//authenticate()'s function signature is standard Connect middleware,which
//makes it convenient to use as route middleware in Express applications.
//also help us specifying which strategy to employ.
const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });


//Routing refers to how an application’s endpoints (URIs) respond to client requests
module.exports = function(app) {
  app.get('/', requireAuth, function(req, res) {
    res.send({ hi: 'there' });
  });
  app.post('/signin', requireSignin, Authentication.signin);
  app.post('/signup', Authentication.signup);
}
