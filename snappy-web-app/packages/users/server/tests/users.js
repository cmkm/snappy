'use strict';

var crypto = require('crypto');


/**
 * Create a random hex string of specific length and
 * @todo consider taking out to a common unit testing javascript helper
 * @return string
 */
function getRandomString(len) {
  if (!len)
    len = 16;

  return crypto.randomBytes(Math.ceil(len / 2)).toString('hex');
}

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Indexes = mongoose.model('Indexes');
/**
 * Globals
 */
var user1, user2;

/**
 * Test Suites
 */
describe('<Unit Test>', function() {
  describe('Model User:', function() {

    before(function(done) {
      user1 = {
        username: 'Fullname',
        email: 'test' + getRandomString() + '@test.com',
      };

      user2 = {
        username: 'Fullname2',
        email: 'test' + getRandomString() + '@test.com',
      };

      done();
    });

    describe('Method Save', function() {
      it('should begin without the test user', function(done) {
        User.find({
          email: user1.email
        }, function(err, users) {
          users.should.have.length(0);

          User.find({
            email: user2.email
          }, function(err, users) {
            users.should.have.length(0);
            done();
          });

        });
      });

      it('should be able to save without problems', function(done) {
        Indexes.findOneAndUpdate({name: 'users'}, {$inc: {index: 1}}, {upsert: true}, function (err, doc) {
          var _user = new User({id: doc.index, username: user1.username, email: user1.email});
          _user.save(function (err) {
            should.not.exist(err);
            _user.remove();
            done();
          });
        });
      });

      it('should be able to create user and save user for updates without problems', function(done) {
        Indexes.findOneAndUpdate({name: 'users'}, {$inc: {index: 1}}, {upsert: true}, function (err, doc) {
          var _user = new User(user1);
          _user.id = doc.index;
          _user.save(function(err) {
            should.not.exist(err);

            _user.name = 'Full name2';
            _user.save(function(err) {
              should.not.exist(err);
              _user.name.should.equal('Full name2');
              _user.remove(function() {
                done();
              });
            });

          });
        });
      });

      it('should show an error when try to save without name', function(done) {
        Indexes.findOneAndUpdate({name: 'users'}, {$inc: {index: 1}}, {upsert: true}, function (err, doc) {
          var _user = new User(user1);
          _user.id = doc.index;
          _user.name = '';

          return _user.save(function (err) {
            should.exist(err);
            done();
          });
        });
      });
    });

    //// source: http://en.wikipedia.org/wiki/Email_address
    //describe('Test Email Validations', function() {
    //  it('Shouldnt allow invalid emails #1', function(done) {
    //    var _user = new User(user1);
    //    _user.email = 'Abc.example.com';
    //    _user.save(function(err) {
    //      if (!err) {
    //        _user.remove(function() {
    //          should.exist(err);
    //          done();
    //        });
    //      } else {
    //        should.exist(err);
    //        done();
    //      }
    //    });
    //  });
    //
    //  it('Shouldnt allow invalid emails #2', function(done) {
    //    var _user = new User(user1);
    //    _user.email = 'A@b@c@example.com';
    //    _user.save(function(err) {
    //      if (err) {
    //        should.exist(err);
    //        done();
    //      } else {
    //        _user.remove(function(err2) {
    //          should.exist(err);
    //          done();
    //        });
    //      }
    //    });
    //  });
    //
    //  it('Shouldnt allow invalid emails #3', function(done) {
    //    var _user = new User(user1);
    //    _user.email = 'a"b(c)d,e:f;g<h>i[j\\k]l@example.com';
    //    _user.save(function(err) {
    //      if (!err) {
    //        _user.remove(function() {
    //          should.exist(err);
    //          done();
    //        });
    //      } else {
    //        should.exist(err);
    //        done();
    //      }
    //    });
    //  });
    //
    //  it('Shouldnt allow invalid emails #4', function(done) {
    //    var _user = new User(user1);
    //    _user.email = 'just"not"right@example.com';
    //    _user.save(function(err) {
    //      if (!err) {
    //        _user.remove(function() {
    //          should.exist(err);
    //          done();
    //        });
    //      } else {
    //        should.exist(err);
    //        done();
    //      }
    //    });
    //  });
    //
    //  it('Shouldnt allow invalid emails #5', function(done) {
    //    var _user = new User(user1);
    //    _user.email = 'this is"not\\allowed@example.com';
    //    _user.save(function(err) {
    //      if (!err) {
    //        _user.remove(function() {
    //          should.exist(err);
    //          done();
    //        });
    //      } else {
    //        should.exist(err);
    //        done();
    //      }
    //    });
    //  });
    //
    //  it('Shouldnt allow invalid emails #6', function(done) {
    //    var _user = new User(user1);
    //    _user.email = 'this\\ still\\"not\\allowed@example.com';
    //    _user.save(function(err) {
    //      if (!err) {
    //        _user.remove(function() {
    //          should.exist(err);
    //          done();
    //        });
    //      } else {
    //        should.exist(err);
    //        done();
    //      }
    //    });
    //  });
    //
    //  it('Shouldnt allow invalid emails #7', function(done) {
    //    var _user = new User(user1);
    //    _user.email = 'john..doe@example.com';
    //    _user.save(function(err) {
    //      if (!err) {
    //        _user.remove(function() {
    //          should.exist(err);
    //          done();
    //        });
    //      } else {
    //        should.exist(err);
    //        done();
    //      }
    //    });
    //  });
    //
    //  it('Shouldnt allow invalid emails #8', function(done) {
    //    var _user = new User(user1);
    //    _user.email = 'john.doe@example..com';
    //    _user.save(function(err) {
    //      if (!err) {
    //        _user.remove(function() {
    //          should.exist(err);
    //          done();
    //        });
    //      } else {
    //        should.exist(err);
    //        done();
    //      }
    //    });
    //  });
    //
    //  it('Should save with valid email #1', function(done) {
    //    var _user = new User(user1);
    //    _user.email = 'john.doe@example.com';
    //    _user.save(function(err) {
    //      if (!err) {
    //        _user.remove(function() {
    //          should.not.exist(err);
    //          done();
    //        });
    //      } else {
    //        should.not.exist(err);
    //        done();
    //      }
    //    });
    //  });
    //
    //  it('Should save with valid email #2', function(done) {
    //    var _user = new User(user1);
    //    _user.email = 'disposable.style.email.with+symbol@example.com';
    //    _user.save(function(err) {
    //      if (!err) {
    //        _user.remove(function() {
    //          should.not.exist(err);
    //          done();
    //        });
    //      } else {
    //        should.not.exist(err);
    //        done();
    //      }
    //    });
    //  });
    //
    //  it('Should save with valid email #3', function(done) {
    //    var _user = new User(user1);
    //    _user.email = 'other.email-with-dash@example.com';
    //    _user.save(function(err) {
    //      if (!err) {
    //        _user.remove(function() {
    //          should.not.exist(err);
    //          done();
    //        });
    //      } else {
    //        should.not.exist(err);
    //        done();
    //      }
    //    });
    //  });
    //
    //});

    after(function(done) {

      /** Clean up user objects
       * un-necessary as they are cleaned up in each test but kept here
       * for educational purposes
       *
       *  var _user1 = new User(user1);
       *  var _user2 = new User(user2);
       *
       *  _user1.remove();
       *  _user2.remove();
       */

      done();
    });
  });
});
