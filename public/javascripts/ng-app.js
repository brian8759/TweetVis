"use strict";

var tweetvis = angular.module('tweetvis', ['ngRoute', 'TweetControllers', 'TweetServices']);

tweetvis.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
  // show all valid tweets
  when('/all_tweets', {
    templateUrl: 'partials/list_all_tweets.html',
    controller: 'ListAllTweetsController'
  }).
  when('/tweet/:tweetId', {
    templateUrl: 'partials/list_one_tweet.html',
    controller: 'ListOneTweetController'
  }).
  otherwise({
    redirectTo: '/all_tweets'
  });
}]);