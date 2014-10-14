"use strict";

var TweetControllers = angular.module('TweetControllers', ['ngAnimate']);

TweetControllers.controller('ListAllTweetsController', ['$scope', 'Tweet', 
  function($scope, Tweet) {
    $scope.tweets = Tweet.query();
}]);

