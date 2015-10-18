/*
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Indigen-Solution
 * See the AUTHORS file for details.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

(function () {
    "use strict";

    var Service = function ($route, $location) {

        this.name = function () {
            if (! $route.current ||
                ! $route.current.$$route ||
                !angular.isDefined($route.current.$$route.name)) {
                return;
            }
            return $route.current.$$route.name;
        };

        this.params = function () {
            if ($route.current && $route.current.params) {
                return $route.current.params;
            }
            return {};
        };

        this.path = function () {
            return $location.path();
        };
    };

    var Provider = function ($routeProvider) {
        var pageCount = 1;
        var provider = {};

        provider.when = function (path, route) {

            //Generate a name if none given
            if ( ! route.name ) {
                route.name = "" + pageCount++;
            }

            $routeProvider.when(path, route)
        };

        provider.otherwise = angular.bind($routeProvider, $routeProvider.otherwise);

        provider.$get = ['$route', '$location', function ($route, $location) {
            return new Service($route, $location);
        }];

        return provider;
    };

    angular.module('__MODULE_NAME__').provider('indiRoute', [ '$routeProvider', Provider ]);

})();