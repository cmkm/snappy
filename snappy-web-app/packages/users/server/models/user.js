'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Indexes Schema
 * This is how we keep track of the user id index
 */
var IndexesSchema = new Schema({
      name: {
        type: String,
        unique: true,
        required: true
      },
      index: {
        type: Number,
        required: true
      }
});

/**
 * Retruns the id from userSchema. Used to override default id getter
 * @returns {*}
 */
var getId = function () {
  return this.id;
};

/**
 * Sets the id from userschema. Used to override default id setter
 */
var setId = function (id) {
  return id;
};

/**
 * User Schema
 */

var UserSchema = new Schema({

  id: {
    type: Number,
    unique: true,
    required: true,
    get: getId,
    set: setId
  },
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    // Regexp to validate emails with more strict rules as added in tests/users.js which also conforms mostly with RFC2822 guide lines
    match: [/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please enter a valid email']
  }

});

mongoose.model('User', UserSchema);
mongoose.model('Indexes', IndexesSchema);