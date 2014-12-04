


angular.module('jimhubApp')

.directive('slideMe', function() {
    return function(scope, element, attrs) {
        scope.$watch(attrs.slideMe, function(val) {

            TweenLite.to(element, 0.2, {left: val});
            
        });
    }
});