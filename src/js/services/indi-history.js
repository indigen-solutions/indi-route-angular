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

    angular.module('__MODULE_NAME__').factory('indiHistory', ['$rootScope', 'indiRoute', function ($rootScope, indiRoute) {
        var history = [];
        var service = {};

        $rootScope.$on('$routeChangeSuccess', function() {
            var route = {
                name: indiRoute.name(),
                params: angular.copy(indiRoute.params()),
                path: indiRoute.path()
            };
            history.push(route);
        });

        service.get = function(index) {
            if (_.isUndefined(index) )
                index = 1;

            return _.get(history, history.length - 1 - index);
        };

        service.last = function() {
            return service.get();
        };

        return service;
    }]);
})();