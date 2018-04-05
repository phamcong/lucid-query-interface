(function(angular) {
    'use strict';

    angular.module( "vaquero").factory( 'vaqueroFactories',
        [ '$rootScope'
         ,'$injector'
         ,'$q'
         ,'$http'
         ,'$timeout'
         ,'config'
         ,'logger' 
         ,'message' 
         ,factory]);

    function factory($injector, $rootScope, $q, $http, $timeout, config, logger, message) {
    	
    	
        return {
            // bundle these so util clients don't have to get them
            $q      : $q,
            $timeout: $timeout,
            $http: $http,
            config: config,
            logger: logger,
            message: message
        };
    }

})(this.angular);
