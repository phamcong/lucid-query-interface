(function( angular  ) {

    angular.module( "vaquero").factory('appStart',['$rootScope',factory]);

    function factory ($rootScope){
        var appStart = {
            start: start
        };
        
        return appStart;

        function start ( ) {
            console.log("appStart::start: vaquero is loaded and running");
        }
    }
})( this.angular );