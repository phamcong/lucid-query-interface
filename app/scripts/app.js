/**
 * Setup of main AngularJS application, with Restangular being defined as a dependency.
 *
 * @see controllers
 * @see services
 */
(function( angular  ) {
    var vaquero = angular.module( "vaquero", ["ui.router","ui.tree","rzModule","ui.bootstrap","dndLists","ngGrid", "ngAnimate"]);

    vaquero.run( ['appStart', function ( appStart ) {
        appStart.start();
    }]);
})( this.angular );