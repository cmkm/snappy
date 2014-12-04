'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Indexes = mongoose.model('Indexes');
  //,
  //async = require('async'),
  //config = require('meanio').loadConfig(),
  //crypto = require('crypto'),
  //nodemailer = require('nodemailer'),
  //templates = require('../template');

/**
 * Logout
 */
exports.signout = function(req, res) {
  req.logout();
  res.redirect('/');
};

/**
 * Session
 */
exports.session = function(req, res) {
  res.redirect('/');
};

/**
 * Create user
 */
exports.create = function(req, res, next) {

  req.assert('username', 'You must enter a name').notEmpty();
  req.assert('email', 'You must enter a valid email address').isEmail();

  var errors = req.validationErrors();
  if (errors) {
    return res.status(400).send(errors);
  }


  Indexes.findOneAndUpdate({name: 'users'}, {$inc: {index: 1}}, {upsert: true}, function (err, doc) {
    var user = new User( {id: doc.index, username: req.body.username, email: req.body.email} );
    user.save(function(err) {
      if (err) {
        switch (err.code) {
          case 11000:
          case 11001:
            res.status(400).send([{
              msg: 'Username already taken',
              param: 'username'
            }]);
            break;
          default:
            var modelErrors = [];

            if (err.errors) {

              for (var x in err.errors) {
                modelErrors.push({
                  param: x,
                  msg: err.errors[x].message,
                  value: err.errors[x].value
                });
              }


            }  res.status(400).send(modelErrors);
        }

        return res.status(400);
      }
      req.logIn(user, function(err) {
        if (err) return next(err);
        return res.redirect('/');
      });
      res.status(200);
    });
  });
};

/**
 * Send User
 */
exports.me = function(req, res) {
  req.profile = req.user;
  res.json(req.user || null);
};

exports.myInfo = function(req, res, next) {
  req.profile = req.user;
  next();
};

/**
 * Find user by id
 */
exports.userById = function(req, res) {
  User
    .findOne({
    id: req.params.id
  }).exec(function(err, user) {
        req.profile = user;
        res.json(user || null);
      });
};

exports.user = function(req, res, next){
  User
      .findOne({
        id: req.params.id
      }).exec(function(err, user) {
        if (err) return next(err);
        if (!user) return next(new Error('Failed to load User ' + req.params.id));
        req.profile = user;
        next();
      });
};

/**
 *  Get the current users email only
 */
exports.email = function(req, res){
  if(req.profile)
    res.json(req.profile.email || null);
  else
    res.json(null);
};

/**
 *  Get the current users name only
 */
exports.username = function(req, res){
  if(req.profile)
    res.json(req.profile.username || null);
  else
    res.json(null);
};

/**
 *  Get the current users _id only
 */
exports.obj = function(req, res) {
  if(req.profile)
    res.json(req.profile._id || null);
  else
    res.json(null);
};