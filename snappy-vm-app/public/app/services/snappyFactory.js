

(function() {

    var snappyFactory = function($http) {

        var factory = {};

        factory.postCreateProject = function(name, desc) {
          return $http.post('/createProject', {projectName: name, projectDesc: desc}, {});    
        };
      
        factory.getServiceCategories = function() {
            return $http.get('/serviceCategories');
        };

        factory.getServiceCategory = function(catId) {
            return $http.get('/serviceCategories/'+catId);
        };
        
        factory.getServices = function() {
            return $http.get('/services');
        };

        factory.getServicesByCategory = function(catId) {
            return $http.get('/services/'+catId);
        };
      
        factory.getProjectVM = function(projID) {
            return $http.get('/projects/'+projID);
        };
        
        return factory;
    }

    snappyFactory.$inject = ['$http'];

    angular.module('snappyVMApp')
        .factory('snappyFactory', snappyFactory);

}());

