(function () {
    "use strict";

    var module = angular.module('test', ['indiRoute', 'ngAnimate']);

    module.config(function (indiRouteProvider) {
        indiRouteProvider.when('/', {
            name: 'home',
            template: '<h1>Home</h1>'
        });

        indiRouteProvider.when('/:name', {
            name: 'article',
            template: '<h1>Article {{name}}</h1>',
            controller: ['$routeParams', '$scope', function ($routeParams, $scope) {
                $scope.name = $routeParams.name;
            }]
        });
    });

})();