'use strict';

// User routes use users controller
var users = require('../controllers/users'),
    config = require('meanio').loadConfig();

module.exports = function(MeanUser, app, auth, database, passport) {

  app.route('/logout')
    .get(users.signout);

  app.route('/users/me')
    .get(users.me);

  app.route('/users/me/email')
      .get(users.myInfo)
      .get(users.email);

  app.route('/users/me/username')
      .get(users.myInfo)
      .get(users.username);

  app.route('/users/me/obj')
      .get(users.myInfo)
      .get(users.obj);

  // Setting up the users api
  app.route('/register')
    .post(users.create);

  app.route('/users/:id')
      .get(users.userById);

  app.route('/users/:id/username')
      .get(users.user)
      .get(users.username);

  app.route('/users/:id/email')
      .get(users.user)
      .get(users.email);

  app.route('/users/:id/obj')
      .get(users.user)
      .get(users.obj);

  // AngularJS route to check for authentication
  app.route('/loggedin')
    .get(function(req, res) {
      res.send(req.isAuthenticated() ? req.user : '0');
    });

  // Setting the local strategy route
  app.route('/login')
    .post(passport.authenticate('local', {
      failureFlash: true
    }), function(req, res) {
      res.send({
        user: req.user,
        redirect: (req.user.roles.indexOf('admin') !== -1) ? req.get('referer') : false
      });
    });

  // AngularJS route to get config of social buttons
  app.route('/get-config')
    .get(function (req, res) {
      res.send(config);
    });

  //// Setting the github oauth routes
  //app.route('/auth/github')
  //  .get(passport.authenticate('github', {
  //    failureRedirect: '#!/login'
  //  }), users.signin);
  //
  //app.route('/auth/github/callback')
  //  .get(passport.authenticate('github', {
  //    failureRedirect: '#!/login'
  //  }), users.authCallback);

};
