

angular.module('jimhubApp').animation('.sliderAnim', function() {
  return {
    enter : function(element, done) {
      element.css({
        color:'#FF0000'
      });

      //node the done method here as the 2nd param
      element.animate({
        color:'#0000FF'
      }, done);

      return function(cancelled) {
        /* this (optional) function is called when the animation is complete
           or when the animation has been cancelled (which is when
           another animation is started on the same element while the
           current animation is still in progress). */
        if(cancelled) {
          element.stop();
        }
      }
    },

    leave : function(element, done) { done(); },
    move : function(element, done) { done(); },

    beforeAddClass : function(element, className, done) { done(); },
    addClass : function(element, className, done) { done(); },

    beforeRemoveClass : function(element, className, done) { done(); },
    removeClass : function(element, className, done) { done(); },

    allowCancel : function(element, event, className) {}
  };
});
