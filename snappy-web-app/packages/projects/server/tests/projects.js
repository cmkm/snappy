'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  Project = mongoose.model('Project'),
  Indexes = mongoose.model('Indexes');

/**
 * Globals
 */
var mProject;
var pRepo;
var fProject;

/**
 * Test Suites
 */
describe('<Unit Test>', function() {
  describe('Model Project:', function () {
    beforeEach(function (done) {

      mProject = {
        name: 'Project 1'
      };

      pRepo = {
        name: 'Project 2',
        repo: 'http://blah.com/repo.git'
      };

      fProject = {
        name: 'Project 3',
        repo: 'http://blah.com/repo.git',
        webhook: 'blah blah blah'
      };
      done();
    });

    describe('Method Save', function () {
      it('should be able to save a minimal project without problems', function (done) {
        Indexes.findOneAndUpdate({name: 'projects'}, {$inc: {index: 1}}, {upsert: true}, function (err, doc) {
          var minimalProject = new Project({id: doc.index, name: mProject.name });
          minimalProject.save(function (err) {
            should.not.exist(err);

            //minimalProject tests from save
            minimalProject.name.should.equal('Project 1');
            should.exist(minimalProject.id);
            should.not.exist(minimalProject.repo);
            should.not.exist(minimalProject.webhook);
            done();
          });
        });
      });

      it('should be able to save a repo project without problems', function (done) {
        Indexes.findOneAndUpdate({name: 'projects'}, {$inc: {index: 1}}, {upsert: true}, function (err, doc) {
          var projectWithRepo = new Project({id: doc.index, name: pRepo.name, repo: pRepo.repo});
          projectWithRepo.save(function (err) {
            should.not.exist(err);

            //projectWithRepo
            projectWithRepo.name.should.equal('Project 2');
            should.exist(projectWithRepo.id);
            projectWithRepo.repo.should.equal('http://blah.com/repo.git');
            should.not.exist(projectWithRepo.webhook);

            done();
          });
        });
      });

      it('should be able to save a project with all options without problems', function (done) {
        Indexes.findOneAndUpdate({name: 'projects'}, {$inc: {index: 1}}, {upsert: true}, function (err, doc) {
          var fullProject = new Project({id: doc.index, name: fProject.name, repo: fProject.repo, webhook: fProject.webhook});
          fullProject.save(function (err) {
            should.not.exist(err);

            //fullProject
            fullProject.name.should.equal('Project 3');
            should.exist(fullProject.id);
            fullProject.repo.should.equal('http://blah.com/repo.git');
            fullProject.webhook.should.equal('blah blah blah');

            done();
          });
        });
      });

      after(function (done) {

        done();
      });
    });
  });
});
