(function() {

    var SnappyVMController = function($scope, snappyFactory, $routeParams) {

        $scope.serviceCategories = [];
        $scope.services = {};
        
        function init() {
          
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
    SnappyVMController.$inject = ['$scope', 'snappyFactory', '$routeParams'];

    angular.module('snappyVMApp')
        .controller('SnappyVMController', SnappyVMController);

}());
