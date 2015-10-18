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

    var module = angular.module('indiRoute', ['ngRoute']);

    module.run(['indiHistory', function(indiHistory) {}]);
})();
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

    function getAnimationDuration(view) {

        if ( !view || view.length == 0 )
            return 0;
        var duration = parseFloat(view.css("animation-duration")) + parseFloat(view.css("transition-duration"));
        var delay = parseFloat(view.css("animation-delay")) + parseFloat(view.css("transition-delay"));

        return (duration + delay) * 1000;
    }

    function getDuration() {
        var views = jQuery("[ng-view], ng-view, .ng-view");
        var max = 0;

        views.each(function () {
            max = Math.max(max, getAnimationDuration($(this)));
        });
        return max;
    }

    angular.module('indiRoute').directive('indiRouteClass', [ '$timeout', 'indiRoute', function ($timeout, indiRoute) {
        return {
            restrict: 'A',
            link: function (scope, $element) {
                var oldPageName;
                var newPageName;
                var animation;

                //When a new indi-view is loaded
                scope.$on('IndiView::loaded', function () {

                    //If a previous animation was running clear everything.
                    if (animation) {
                        animation.cancel();

                        $element.removeClass('page-' + oldPageName);
                        oldPageName = newPageName;
                        animation = null;
                    }

                    //Add the new page class
                    newPageName = indiRoute.name();
                    $element.addClass('page-' + newPageName);

                    //If it is not the first indi-view loaded we start the animation.
                    if (oldPageName) {
                        animation = startAnimation(oldPageName, newPageName);
                        animation.then(function () {
                            $element.removeClass('page-' + oldPageName);
                            oldPageName = newPageName;
                            animation = null;
                        });
                    } else {
                        oldPageName = newPageName;
                    }
                });

                function startAnimation(from, to) {
                    var t1, t2, t3;

                    function clear() {
                        $element
                            .removeClass('page-' + to + '-enter')
                            .removeClass('page-' + to + '-enter-active')
                            .removeClass('page-' + from + '-leave')
                            .removeClass('page-' + from + '-leave-active');
                    }

                    $element.addClass('page-' + to + '-enter');
                    $element.addClass('page-' + from + '-leave');
                    t1 = $timeout().then(function () {
                        $element.addClass('page-' + to + '-enter-active');
                        $element.addClass('page-' + from + '-leave-active');
                        t2 = $timeout().then(function () {
                            t3 = $timeout(clear, getDuration() + 300);
                            return t3;
                        });
                        return t2;
                    });

                    t1.cancel = function () {
                        $timeout.cancel(t1);
                        $timeout.cancel(t2);
                        $timeout.cancel(t3);
                        clear();
                    };
                    return t1;
                }
            }
        }
    }]);
})();
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

    angular.module('indiRoute').directive('indiView', [ 'indiRoute', function (indiRoute) {
        return {
            restrict: 'A',
            priority: 399, // Priority of ng-view - 1
            link: function (scope, $element) {
                $element.addClass('page-' + indiRoute.name());
                scope.$emit('IndiView::loaded');
            }
        }
    }]);
})();
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

    angular.module('indiRoute').factory('indiHistory', ['$rootScope', 'indiRoute', function ($rootScope, indiRoute) {
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

    angular.module('indiRoute').provider('indiRoute', [ '$routeProvider', Provider ]);

})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIiwiZGlyZWN0aXZlcy9pbmRpLXJvdXRlLWNsYXNzLmpzIiwiZGlyZWN0aXZlcy9pbmRpLXZpZXcuanMiLCJzZXJ2aWNlcy9pbmRpLWhpc3RvcnkuanMiLCJzZXJ2aWNlcy9pbmRpLXJvdXRlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJpbmRpLXJvdXRlLWFuZ3VsYXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICpcbiAqIFRoZSBNSVQgTGljZW5zZSAoTUlUKVxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxNSBJbmRpZ2VuLVNvbHV0aW9uXG4gKiBTZWUgdGhlIEFVVEhPUlMgZmlsZSBmb3IgZGV0YWlscy5cbiAqXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gKiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4gKiBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4gKiB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4gKiBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbiAqIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbiAqIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiAqIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuICogRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gKiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gKiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuICogT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuICogVEhFIFNPRlRXQVJFLlxuICovXG5cbihmdW5jdGlvbiAoKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgbW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ2luZGlSb3V0ZScsIFsnbmdSb3V0ZSddKTtcblxuICAgIG1vZHVsZS5ydW4oWydpbmRpSGlzdG9yeScsIGZ1bmN0aW9uKGluZGlIaXN0b3J5KSB7fV0pO1xufSkoKTsiLCIvKlxuICpcbiAqIFRoZSBNSVQgTGljZW5zZSAoTUlUKVxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxNSBJbmRpZ2VuLVNvbHV0aW9uXG4gKiBTZWUgdGhlIEFVVEhPUlMgZmlsZSBmb3IgZGV0YWlscy5cbiAqXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gKiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4gKiBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4gKiB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4gKiBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbiAqIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbiAqIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiAqIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuICogRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gKiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gKiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuICogT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuICogVEhFIFNPRlRXQVJFLlxuICovXG5cbihmdW5jdGlvbiAoKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBmdW5jdGlvbiBnZXRBbmltYXRpb25EdXJhdGlvbih2aWV3KSB7XG5cbiAgICAgICAgaWYgKCAhdmlldyB8fCB2aWV3Lmxlbmd0aCA9PSAwIClcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB2YXIgZHVyYXRpb24gPSBwYXJzZUZsb2F0KHZpZXcuY3NzKFwiYW5pbWF0aW9uLWR1cmF0aW9uXCIpKSArIHBhcnNlRmxvYXQodmlldy5jc3MoXCJ0cmFuc2l0aW9uLWR1cmF0aW9uXCIpKTtcbiAgICAgICAgdmFyIGRlbGF5ID0gcGFyc2VGbG9hdCh2aWV3LmNzcyhcImFuaW1hdGlvbi1kZWxheVwiKSkgKyBwYXJzZUZsb2F0KHZpZXcuY3NzKFwidHJhbnNpdGlvbi1kZWxheVwiKSk7XG5cbiAgICAgICAgcmV0dXJuIChkdXJhdGlvbiArIGRlbGF5KSAqIDEwMDA7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0RHVyYXRpb24oKSB7XG4gICAgICAgIHZhciB2aWV3cyA9IGpRdWVyeShcIltuZy12aWV3XSwgbmctdmlldywgLm5nLXZpZXdcIik7XG4gICAgICAgIHZhciBtYXggPSAwO1xuXG4gICAgICAgIHZpZXdzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgbWF4ID0gTWF0aC5tYXgobWF4LCBnZXRBbmltYXRpb25EdXJhdGlvbigkKHRoaXMpKSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gbWF4O1xuICAgIH1cblxuICAgIGFuZ3VsYXIubW9kdWxlKCdpbmRpUm91dGUnKS5kaXJlY3RpdmUoJ2luZGlSb3V0ZUNsYXNzJywgWyAnJHRpbWVvdXQnLCAnaW5kaVJvdXRlJywgZnVuY3Rpb24gKCR0aW1lb3V0LCBpbmRpUm91dGUpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnQScsXG4gICAgICAgICAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsICRlbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgdmFyIG9sZFBhZ2VOYW1lO1xuICAgICAgICAgICAgICAgIHZhciBuZXdQYWdlTmFtZTtcbiAgICAgICAgICAgICAgICB2YXIgYW5pbWF0aW9uO1xuXG4gICAgICAgICAgICAgICAgLy9XaGVuIGEgbmV3IGluZGktdmlldyBpcyBsb2FkZWRcbiAgICAgICAgICAgICAgICBzY29wZS4kb24oJ0luZGlWaWV3Ojpsb2FkZWQnLCBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgLy9JZiBhIHByZXZpb3VzIGFuaW1hdGlvbiB3YXMgcnVubmluZyBjbGVhciBldmVyeXRoaW5nLlxuICAgICAgICAgICAgICAgICAgICBpZiAoYW5pbWF0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhbmltYXRpb24uY2FuY2VsKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICRlbGVtZW50LnJlbW92ZUNsYXNzKCdwYWdlLScgKyBvbGRQYWdlTmFtZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBvbGRQYWdlTmFtZSA9IG5ld1BhZ2VOYW1lO1xuICAgICAgICAgICAgICAgICAgICAgICAgYW5pbWF0aW9uID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vQWRkIHRoZSBuZXcgcGFnZSBjbGFzc1xuICAgICAgICAgICAgICAgICAgICBuZXdQYWdlTmFtZSA9IGluZGlSb3V0ZS5uYW1lKCk7XG4gICAgICAgICAgICAgICAgICAgICRlbGVtZW50LmFkZENsYXNzKCdwYWdlLScgKyBuZXdQYWdlTmFtZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy9JZiBpdCBpcyBub3QgdGhlIGZpcnN0IGluZGktdmlldyBsb2FkZWQgd2Ugc3RhcnQgdGhlIGFuaW1hdGlvbi5cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9sZFBhZ2VOYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhbmltYXRpb24gPSBzdGFydEFuaW1hdGlvbihvbGRQYWdlTmFtZSwgbmV3UGFnZU5hbWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYW5pbWF0aW9uLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRlbGVtZW50LnJlbW92ZUNsYXNzKCdwYWdlLScgKyBvbGRQYWdlTmFtZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2xkUGFnZU5hbWUgPSBuZXdQYWdlTmFtZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmltYXRpb24gPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvbGRQYWdlTmFtZSA9IG5ld1BhZ2VOYW1lO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBzdGFydEFuaW1hdGlvbihmcm9tLCB0bykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdDEsIHQyLCB0MztcblxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBjbGVhcigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRlbGVtZW50XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdwYWdlLScgKyB0byArICctZW50ZXInKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZW1vdmVDbGFzcygncGFnZS0nICsgdG8gKyAnLWVudGVyLWFjdGl2ZScpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdwYWdlLScgKyBmcm9tICsgJy1sZWF2ZScpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdwYWdlLScgKyBmcm9tICsgJy1sZWF2ZS1hY3RpdmUnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICRlbGVtZW50LmFkZENsYXNzKCdwYWdlLScgKyB0byArICctZW50ZXInKTtcbiAgICAgICAgICAgICAgICAgICAgJGVsZW1lbnQuYWRkQ2xhc3MoJ3BhZ2UtJyArIGZyb20gKyAnLWxlYXZlJyk7XG4gICAgICAgICAgICAgICAgICAgIHQxID0gJHRpbWVvdXQoKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRlbGVtZW50LmFkZENsYXNzKCdwYWdlLScgKyB0byArICctZW50ZXItYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkZWxlbWVudC5hZGRDbGFzcygncGFnZS0nICsgZnJvbSArICctbGVhdmUtYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0MiA9ICR0aW1lb3V0KCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdDMgPSAkdGltZW91dChjbGVhciwgZ2V0RHVyYXRpb24oKSArIDMwMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHQzO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdDI7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIHQxLmNhbmNlbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICR0aW1lb3V0LmNhbmNlbCh0MSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkdGltZW91dC5jYW5jZWwodDIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJHRpbWVvdXQuY2FuY2VsKHQzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFyKCk7XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0MTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XSk7XG59KSgpOyIsIi8qXG4gKlxuICogVGhlIE1JVCBMaWNlbnNlIChNSVQpXG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE1IEluZGlnZW4tU29sdXRpb25cbiAqIFNlZSB0aGUgQVVUSE9SUyBmaWxlIGZvciBkZXRhaWxzLlxuICpcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiAqIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbiAqIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbiAqIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbiAqIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuICogZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqXG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuICogYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKlxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuICogSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gKiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiAqIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiAqIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gKiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gKiBUSEUgU09GVFdBUkUuXG4gKi9cblxuKGZ1bmN0aW9uICgpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdpbmRpUm91dGUnKS5kaXJlY3RpdmUoJ2luZGlWaWV3JywgWyAnaW5kaVJvdXRlJywgZnVuY3Rpb24gKGluZGlSb3V0ZSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVzdHJpY3Q6ICdBJyxcbiAgICAgICAgICAgIHByaW9yaXR5OiAzOTksIC8vIFByaW9yaXR5IG9mIG5nLXZpZXcgLSAxXG4gICAgICAgICAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsICRlbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgJGVsZW1lbnQuYWRkQ2xhc3MoJ3BhZ2UtJyArIGluZGlSb3V0ZS5uYW1lKCkpO1xuICAgICAgICAgICAgICAgIHNjb3BlLiRlbWl0KCdJbmRpVmlldzo6bG9hZGVkJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XSk7XG59KSgpOyIsIi8qXG4gKlxuICogVGhlIE1JVCBMaWNlbnNlIChNSVQpXG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE1IEluZGlnZW4tU29sdXRpb25cbiAqIFNlZSB0aGUgQVVUSE9SUyBmaWxlIGZvciBkZXRhaWxzLlxuICpcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiAqIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbiAqIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbiAqIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbiAqIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuICogZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqXG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuICogYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKlxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuICogSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gKiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiAqIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiAqIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gKiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gKiBUSEUgU09GVFdBUkUuXG4gKi9cblxuKGZ1bmN0aW9uICgpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdpbmRpUm91dGUnKS5mYWN0b3J5KCdpbmRpSGlzdG9yeScsIFsnJHJvb3RTY29wZScsICdpbmRpUm91dGUnLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgaW5kaVJvdXRlKSB7XG4gICAgICAgIHZhciBoaXN0b3J5ID0gW107XG4gICAgICAgIHZhciBzZXJ2aWNlID0ge307XG5cbiAgICAgICAgJHJvb3RTY29wZS4kb24oJyRyb3V0ZUNoYW5nZVN1Y2Nlc3MnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciByb3V0ZSA9IHtcbiAgICAgICAgICAgICAgICBuYW1lOiBpbmRpUm91dGUubmFtZSgpLFxuICAgICAgICAgICAgICAgIHBhcmFtczogYW5ndWxhci5jb3B5KGluZGlSb3V0ZS5wYXJhbXMoKSksXG4gICAgICAgICAgICAgICAgcGF0aDogaW5kaVJvdXRlLnBhdGgoKVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGhpc3RvcnkucHVzaChyb3V0ZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHNlcnZpY2UuZ2V0ID0gZnVuY3Rpb24oaW5kZXgpIHtcbiAgICAgICAgICAgIGlmIChfLmlzVW5kZWZpbmVkKGluZGV4KSApXG4gICAgICAgICAgICAgICAgaW5kZXggPSAxO1xuXG4gICAgICAgICAgICByZXR1cm4gXy5nZXQoaGlzdG9yeSwgaGlzdG9yeS5sZW5ndGggLSAxIC0gaW5kZXgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHNlcnZpY2UubGFzdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZpY2UuZ2V0KCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIHNlcnZpY2U7XG4gICAgfV0pO1xufSkoKTsiLCIvKlxuICpcbiAqIFRoZSBNSVQgTGljZW5zZSAoTUlUKVxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxNSBJbmRpZ2VuLVNvbHV0aW9uXG4gKiBTZWUgdGhlIEFVVEhPUlMgZmlsZSBmb3IgZGV0YWlscy5cbiAqXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gKiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4gKiBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4gKiB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4gKiBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbiAqIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbiAqIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiAqIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuICogRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gKiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gKiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuICogT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuICogVEhFIFNPRlRXQVJFLlxuICovXG5cbihmdW5jdGlvbiAoKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgU2VydmljZSA9IGZ1bmN0aW9uICgkcm91dGUsICRsb2NhdGlvbikge1xuXG4gICAgICAgIHRoaXMubmFtZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICghICRyb3V0ZS5jdXJyZW50IHx8XG4gICAgICAgICAgICAgICAgISAkcm91dGUuY3VycmVudC4kJHJvdXRlIHx8XG4gICAgICAgICAgICAgICAgIWFuZ3VsYXIuaXNEZWZpbmVkKCRyb3V0ZS5jdXJyZW50LiQkcm91dGUubmFtZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gJHJvdXRlLmN1cnJlbnQuJCRyb3V0ZS5uYW1lO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMucGFyYW1zID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKCRyb3V0ZS5jdXJyZW50ICYmICRyb3V0ZS5jdXJyZW50LnBhcmFtcykge1xuICAgICAgICAgICAgICAgIHJldHVybiAkcm91dGUuY3VycmVudC5wYXJhbXM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4ge307XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5wYXRoID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuICRsb2NhdGlvbi5wYXRoKCk7XG4gICAgICAgIH07XG4gICAgfTtcblxuICAgIHZhciBQcm92aWRlciA9IGZ1bmN0aW9uICgkcm91dGVQcm92aWRlcikge1xuICAgICAgICB2YXIgcGFnZUNvdW50ID0gMTtcbiAgICAgICAgdmFyIHByb3ZpZGVyID0ge307XG5cbiAgICAgICAgcHJvdmlkZXIud2hlbiA9IGZ1bmN0aW9uIChwYXRoLCByb3V0ZSkge1xuXG4gICAgICAgICAgICAvL0dlbmVyYXRlIGEgbmFtZSBpZiBub25lIGdpdmVuXG4gICAgICAgICAgICBpZiAoICEgcm91dGUubmFtZSApIHtcbiAgICAgICAgICAgICAgICByb3V0ZS5uYW1lID0gXCJcIiArIHBhZ2VDb3VudCsrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkcm91dGVQcm92aWRlci53aGVuKHBhdGgsIHJvdXRlKVxuICAgICAgICB9O1xuXG4gICAgICAgIHByb3ZpZGVyLm90aGVyd2lzZSA9IGFuZ3VsYXIuYmluZCgkcm91dGVQcm92aWRlciwgJHJvdXRlUHJvdmlkZXIub3RoZXJ3aXNlKTtcblxuICAgICAgICBwcm92aWRlci4kZ2V0ID0gWyckcm91dGUnLCAnJGxvY2F0aW9uJywgZnVuY3Rpb24gKCRyb3V0ZSwgJGxvY2F0aW9uKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFNlcnZpY2UoJHJvdXRlLCAkbG9jYXRpb24pO1xuICAgICAgICB9XTtcblxuICAgICAgICByZXR1cm4gcHJvdmlkZXI7XG4gICAgfTtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdpbmRpUm91dGUnKS5wcm92aWRlcignaW5kaVJvdXRlJywgWyAnJHJvdXRlUHJvdmlkZXInLCBQcm92aWRlciBdKTtcblxufSkoKTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
