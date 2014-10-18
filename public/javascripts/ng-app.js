"use strict";

var tweetvis = angular.module('tweetvis', ['ngRoute', 'ngResource', 
  'tweetvis.Controllers', 'tweetvis.Services', 'ui.bootstrap', 'google-maps'.ns()]);

tweetvis.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
  // show all valid tweets
  when('/all_tweets', {
    templateUrl: 'partials/list_all_tweets.htm',
    controller: 'ListAllTweetsController'
  }).
  when('/tweet/:tweetId', {
    templateUrl: 'partials/list_one_tweet.htm',
    controller: 'ListOneTweetController'
  }).
  when('/googlemap', {
    templateUrl: 'partials/googlemap.htm',
    controller: 'GoogleMapController'
  }).
  otherwise({
    redirectTo: '/all_tweets'
  });
}]);


