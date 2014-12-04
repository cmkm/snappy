(function() {

    var SnappyVMController = function($scope, snappyFactory, $routeParams, $location) {

        $scope.serviceCategories = [];
        $scope.services = {};
        
        $scope.vm = {};
      
        function init() {
          
            $scope.submitCreateProjectForm = function() {
              
              snappyFactory.postCreateProject($scope.projectName, $scope.projectDescription)
                .success(function(dataFromServer, status, headers, config) {
                  console.log(dataFromServer);
                  $scope.vm = dataFromServer;
                  $location.path('/projects/'+dataFromServer.id);
                
                  
                });
              
            };
          
          
            // Load service categories into serviceCategories array
            snappyFactory.getServiceCategories()
                .success(function(items) {
                    $scope.serviceCategories = items;
                })
                .error(function(data, status, headers, config) {
                    console.error("Failed to retrieve service categories: "+status+" "+data);
                });
          
            // Load services into services dictionary by catId
            snappyFactory.getServices()
                .success(function(items) {

                    for(var i=0; i < items.length; i++) {
                        if(!$scope.services[items[i].catId]) {
                           $scope.services[items[i].catId] = [];
                        }
                      
                        $scope.services[items[i].catId].push(items[i]);
                    }

                })
                .error(function(data, status, headers, config) {
                    console.error("Failed to retrieve services: "+status+" "+data);
                });
        }

        init();

    };

    // Parameter injection to avoid trouble from minification
    SnappyVMController.$inject = ['$scope', 'snappyFactory', '$routeParams', '$location'];

    angular.module('snappyVMApp')
        .controller('SnappyVMController', SnappyVMController);

}());
