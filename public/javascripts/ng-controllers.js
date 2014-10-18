"use strict";

var TweetControllers = angular.module('tweetvis.Controllers', []);

TweetControllers.controller('ListAllTweetsController', ['$scope', 'Tweet', function($scope, Tweet) {
    $scope.tweets = Tweet.query();
    $scope.totalItems = 64;
    $scope.currentPage = 4;

    $scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
    };

    $scope.pageChanged = function() {
        console.log('Page changed to: ' + $scope.currentPage);
    };

    $scope.maxSize = 5;
    $scope.bigTotalItems = 175;
    $scope.bigCurrentPage = 1;
}]);

TweetControllers.controller('ListOneTweetController', ['$scope', '$routeParams', 'Tweet', function($scope, $routeParams, Tweet) {
    $scope.tweet = Tweet.get({ tweetId: $routeParams.tweetId });
}]);

TweetControllers.controller('GoogleMapController', ['$scope', function($scope) {
	$scope.map = {center: {latitude: 40.1451, longitude: -99.6680 }, zoom: 1, bounds: {}};
        $scope.options = {scrollwheel: false};
        var createRandomMarker = function (i, bounds, idKey) {
            var lat_min = bounds.southwest.latitude,
                lat_range = bounds.northeast.latitude - lat_min,
                lng_min = bounds.southwest.longitude,
                lng_range = bounds.northeast.longitude - lng_min;

            if (idKey == null) {
                idKey = "id";
            }

            var latitude = lat_min + (Math.random() * lat_range);
            var longitude = lng_min + (Math.random() * lng_range);
            var ret = {
                latitude: latitude,
                longitude: longitude,
                title: 'm' + i
            };
            ret[idKey] = i;
            return ret;
        };
        $scope.randomMarkers = [];
        // Get the bounds from the map once it's loaded
        $scope.$watch(function() { return $scope.map.bounds; }, function(nv, ov) {
            // Only need to regenerate once
            if (!ov.southwest && nv.southwest) {
                var markers = [];
                for (var i = 0; i < 50; i++) {
                    markers.push(createRandomMarker(i, $scope.map.bounds))
                }
                $scope.randomMarkers = markers;
            }
        }, true);
}]);