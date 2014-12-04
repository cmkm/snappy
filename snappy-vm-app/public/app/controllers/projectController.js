(function() {

    var ProjectController = function($scope, snappyFactory, $routeParams, $interval) {

        $scope.vm = {};
        var updateInterval;
      
        function init() {
          
          updateInterval = $interval(function() {
            //console.log("checking for updated status...");
            
            snappyFactory.getProjectVM($routeParams.projID)
            .success(function(vm) {
              $scope.vm = vm;
              
              if(vm.status === "Ready") {
                $scope.stopUpdate(); 
              }
            })
            .error(function(data, status, headers, config) {
                    console.error("Failed to retrieve project VM info: "+status+" "+data);
            });

          }, 1000);
          
          $scope.stopUpdate = function() {
            if(angular.isDefined(updateInterval)) {
              $interval.cancel(updateInterval);  
            }
            
            updateInterval = undefined;
          }
          
          $scope.$on('$destroy', function() {
            // Make sure that the interval is destroyed too
            $scope.stopUpdate();
          });
        }
      
        init();

    };

    // Parameter injection to avoid trouble from minification
    ProjectController.$inject = ['$scope', 'snappyFactory', '$routeParams', '$interval'];

    angular.module('snappyVMApp')
        .controller('ProjectController', ProjectController);

}());