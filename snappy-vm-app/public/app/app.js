
(function () {

    angular.module('snappyVMApp', ['ngRoute', 'ngAnimate'])

        .config(function ($routeProvider) {
            $routeProvider
                .when('/projects/:projID', {
                    controller: 'ProjectController',
                    templateUrl: 'app/views/projectView.html'
                })
                .when('/', {
                    controller: 'SnappyVMController',
                    templateUrl: 'app/views/createProject.html'
                })
                .otherwise( { redirectTo: '/' });
        });


}());
