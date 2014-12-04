'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

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
 * Project Schema
 */
var ProjectSchema = new Schema({
  id: {
    type: Number,
    unique: true,
    required: true,
    get:getId,
    set:setId
  },
  name: {
    type: String,
    required: true
  },
  repo: {
    type: String
  },
  webhook: {
    type: String
  },
  updates: {
    type: [String]
  }
});

//ProjectSchema.path('name').validate(function (v) {
//  return v.length > 0;
//}, 'Your group name must be at least 1 character long');

mongoose.model('Project', ProjectSchema);
