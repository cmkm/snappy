'use strict';

var projects = require('../controllers/projects');

module.exports = function(Projects, app, auth) {

  app.route('/projects/create')
      .post(projects.create);

    app.route('/projects/:id')
        .get(projects.projectById)
        .post(projects.update)
        .delete(projects.delete);

  app.route('/projects/:id/name')
        .get(projects.project, projects.name);
};
