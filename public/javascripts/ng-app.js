"use strict";

var tweetvis = angular.module('tweetvis', ['ngRoute', 'ngResource', 
  'tweetvis.Controllers', 'tweetvis.Services', 'ui.bootstrap', 'google-maps'.ns()]);

tweetvis.config(['GoogleMapApiProvider'.ns(), function (GoogleMapApi) {
  GoogleMapApi.configure({
//    key: 'your api key',
    key: 'AIzaSyDCdwlKea2jiNxYLXVlpS9GwGUrUBJPCT4',
    v: '3.17',
    libraries: 'places'
  });
}]);

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
  when('/real_time_streaming', {
    templateUrl: 'partials/real_time_streaming.htm',
    controller: 'RealTimeStreamingController'
  }).
  otherwise({
    redirectTo: '/'
  });
}]);

tweetvis.run(['$templateCache', function ($templateCache) {
  $templateCache.put('searchbox.tpl.html', '<input id="pac-input" class="pac-controls" type="text" placeholder="Search Box">');
}]);

tweetvis.filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
});

tweetvis.filter('reverse', function() {
  return function(items) {
    return (items != null ? items.slice().reverse() : []);
  };
});



