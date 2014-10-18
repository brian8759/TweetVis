"use strict";

var TweetControllers = angular.module('tweetvis.Controllers', []);

TweetControllers.controller('ListAllTweetsController', function($scope, Tweet, $filter) {
    // async get tweets from DB
    $scope.tweets = Tweet.query();

    //$scope.totalItems = 64;
    $scope.itemsPerPage = 20;
    $scope.currentPage = 1;

/*
    $scope.tweets.$promise.then(function () {
    $scope.totalItems = $scope.tweets.length;
    //$scope.numOfPages = 8;
    $scope.maxSize = 8;
    $scope.$watch('currentPage + itemsPerPage', function() {
      var begin = (($scope.currentPage - 1) * $scope.itemsPerPage),
        end = begin + $scope.itemsPerPage;

      $scope.filteredTweets = $scope.tweets.slice(begin, end);
      console.log("filteredTweets:", $scope.filteredTweets.length);
      console.log("total tweets", $scope.tweets.length);
    });
  });
*/
    $scope.tweets.$promise.then(function () {
    $scope.totalItems = $scope.tweets.length;
    //$scope.numOfPages = 8;
    $scope.maxSize = 8;
    $scope.$watch('query', function (newQuery) {
        $scope.currentPage = 1;
        $scope.filteredTweets = $filter('filter')($scope.tweets, $scope.query);
        $scope.noOfPages = $scope.filteredTweets.length / $scope.itemsPerPage;
        //$scope.$apply();
    });
  });
    /*
    $scope.totalItems = $scope.tweets.length;
    $scope.currentPage = 1;
    $scope.numPerPage = 10;
  
    $scope.paginate = function(value) {
        var begin, end, index;
        begin = ($scope.currentPage - 1) * $scope.numPerPage;
        end = begin + $scope.numPerPage;
        index = $scope.tweets.indexOf(value);
        return (begin <= index && index < end);
    };
    */
});

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