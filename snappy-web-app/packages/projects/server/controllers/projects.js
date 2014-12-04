'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Project = mongoose.model('Project'),
  Indexes = mongoose.model('Indexes');

/**
 * Find a project by id for middleware usage.
 */
exports.project = function(req, res, next) {
  Project.findOne({
    id: req.params.id
  }).exec(function(err, project) {
    if (err) return next(err);
    if (!project) return next(new Error('Failed to load Project ' + req.params.id));
    req.profile = project;
    next();
  });
};

/**
 * Find project by id
 */
exports.projectById = function(req, res) {
  Project.findOne({
    id: req.params.id
  }).exec(function(err, project) {
    req.profile = project;
    res.json(project || null);
  });
};

/**
 * Create a project, and return the json object
 */
exports.create = function(req, res) {

  Indexes.findOneAndUpdate({name: 'projects'}, {$inc: {index: 1}}, {upsert: true}, function (err, doc) {
    var project = new Project({id: doc.index, name: req.body.name, repo: req.body.repo, webhook: req.body.webhook});
    console.log(req.body.name);
    project.save(function(err){
      if (err) {
        return res.json(500, {
          error: 'Cannot create the project'
        });
      }
      project.repo = req.repo;
      project.webhook = req.webhook;
      res.json(project);
    });
  });
};

/**
 * Update a project.
 * Handles one update at a time
 */
exports.update = function(req, res) {

  Project.findOneAndUpdate(
      {id: req.params.id},
      {$push: {updates: req.body.update}},
      {upsert: false},
      function(err, doc) {
        if (err) {
          console.log(err);
          return res.json(500, {
            error: 'Cannot update the project'
          });
        }
        res.json(doc);
      }

  );



};

/**
 * Delete a project
 */
exports.delete = function(req, res) {

  Project.findOne({
    id: req.params.id
  }).exec(function(err, project) {
    if (err) console.log(err);
    if (!project) return console.log(new Error('Failed to load Project ' + req.params.id));
    project.remove(function(err) {

      if (err) {
        return res.json(500, {
          error: 'Cannot delete the project'
        });
      }

      res.json(project);

    });

  });

};

/**
 * Gets the name of the project
 */
exports.name = function(req, res) {
  if(req.profile)
    res.json(req.profile.name || null);
  else
    res.json(null);
};

/**
 * updates the name of the project
 */
exports.updateName = function(req, res) {
  var project = req.profile;

  project.findOne(
      {id: req.params.id},
      function(err, project) {
        if (err) {
          console.log(err);
          return res.json(500, {
            error: 'Cannot update the project name'
          });
        } else {
          project.name = req.name;
        }
      });
  res.json(project);
};