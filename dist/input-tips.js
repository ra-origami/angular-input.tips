(function(window, angular) {

    'use strict';

    var ngInputTips = angular.module('input.tips', ['ng']);

    ngInputTips.directive('tips', ['$interval', '$http', '$compile', function($interval, $http, $compile) {

        return {
            restrict: 'A',
            replace: false,
            scope: false,
            transclude: false,
            link: function($scope, $elm, attrs, ctr) {

                var $street_interval,
                    $on_change_enabled = true;

                var $url = $elm.attr('tips-href');

                if(angular.isUndefined($url) || $url.length == 0){
                    console.warn('need link to data in tips-href');
                    return;
                    }

                $scope.selected_index = -1;
                $scope.tips = {};
                $scope.show_helper = false;

                var helper = angular.element('<div class="tips tips--street" ng-class="show_helper == 1 ? \'open\' : \'\'"><ul><li ng-repeat="(i, street) in tip" ng-click="selStreetTip(street)" ng-class="street_selected_index == i ? \'selected\' : \'\'">{{street}}</li></ul></div>');

                $scope.$applyAsync(function () {
                    $elm.after(helper);
                    $compile(helper.contents())($scope);
                });

                $scope.selStreetTip = function($value) {
                    $elm[0].value = $value;
                    $scope.tips = {};
                    $on_change_enabled = false;
                }

                $scope.$watch('tips', function ($val) {
                    if(Object.keys($val).length > 0)
                        helper.addClass('open');
                    else
                        helper.removeClass('open');
                });

                $elm.bind('blur', function ($event) {

                });

                $elm.bind('input', function ($event) {

                    if($street_interval)
                        $interval.cancel($street_interval);

                    if($elm[0].value == '')
                        $scope.tips = {};

                    if(!$on_change_enabled){
                        $on_change_enabled = true;
                        return;
                    }

                    $scope.tips = {};

                    if(!$elm[0].value || $elm[0].value.length < 2)
                        return;

                    $street_interval = $interval(function () {

                        $http.post($url, {value: $elm[0].value})
                            .success(function ($resp) {

                                $scope.tips = angilar.isObject($resp) ? $resp : {};
                                $scope.selected_index = -1;

                                })
                            .error(function ($err) {
                                $scope.tips = {};
                            });

                    }, 300, 1);

                });

                $elm.bind('keydown', function ($event) {

                    if(Object.keys($scope.tips).length < 1)
                        return;

                    switch ($event.keyCode){

                        case 38: // up

                            if($scope.selected_index > 0)
                                $scope.selected_index--;

                            if($scope.selected_index >= 0)
                                $elm[0].value = $scope.tips[$scope.selected_index];

                            $on_change_enabled = false;
                            $scope.$applyAsync();

                            break;

                        case 40: // down

                            if($scope.selected_index < $scope.tip.length - 1)
                                $scope.selected_index++;

                            $elm[0].value = $scope.tip[$scope.selected_index];
                            $on_change_enabled = false;
                            $scope.$applyAsync();
                            break;

                        case 13: // enter

                            $scope.$applyAsync(function () {
                                $scope.tip = {};
                            });

                            $event.preventDefault();
                            $event.stopPropagation();

                            break;

                        case 32:

                            $scope.tips = {};
                            $scope.selected_index = -1;

                            break;

                    }

                });

            }
        }

    }]);

})(window, window.angular);

