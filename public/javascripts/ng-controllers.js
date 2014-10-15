"use strict";

var TweetControllers = angular.module('tweetvis.Controllers', []);

TweetControllers.controller('ListAllTweetsController', ['$scope', 'Tweet', function($scope, Tweet) {
    $scope.tweets = Tweet.query();
}]);

TweetControllers.controller('ListOneTweetController', ['$scope', '$routeParams', 'Tweet', function($scope, $routeParams, Tweet) {
    $scope.tweet = Tweet.get({ tweetId: $routeParams.tweetId });
}]);
