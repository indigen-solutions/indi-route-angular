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

    angular.module('__MODULE_NAME__').directive('indiRouteClass', [ '$timeout', 'indiRoute', function ($timeout, indiRoute) {
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