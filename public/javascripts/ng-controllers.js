"use strict";

var TweetControllers = angular.module('tweetvis.Controllers', []);

TweetControllers.controller('ListAllTweetsController', ['$scope', 'Tweet', 'filterFilter', function($scope, Tweet, filterFilter) {
    // async get tweets from DB
    $scope.tweets = Tweet.query();

    //$scope.totalItems = 64;
    $scope.itemsPerPage = 20;
    $scope.currentPage = 1;

    $scope.tweets.$promise.then(function () {
    $scope.totalItems = $scope.tweets.length;
    //$scope.numOfPages = 8;
    $scope.maxSize = 8;
    $scope.$watch('query', function (newQuery, oldQuery) {
        $scope.currentPage = 1;
        //$scope.filteredTweets = $filter('filter')($scope.tweets, $scope.query);
        $scope.filteredTweets = filterFilter($scope.tweets, {user_screen_name: $scope.query});
        $scope.noOfPages = $scope.filteredTweets.length / $scope.itemsPerPage;
        if(newQuery !== oldQuery) {
            $scope.totalItems = $scope.filteredTweets.length;
        }
    });
  });
}]);

TweetControllers.controller('ListOneTweetController', ['$scope', '$routeParams', 'Tweet', function($scope, $routeParams, Tweet) {
    $scope.tweet = Tweet.get({ tweetId: $routeParams.tweetId });
    
    $scope.tweet.$promise.then(function() {
        // set up a map
        $scope.map = {
            center: {latitude: 40.1451, longitude: -99.6680 }, 
            zoom: 3, 
            bounds: {},
            options: {scrollwheel: false},
            marker: [{
                id: 1,
                geometry: $scope.tweet.geo,
                tweetId: $scope.tweet._id
            }]
        };
    });
    
}]);

TweetControllers.controller('GoogleMapController', ['$scope', 'Tweet', function($scope, Tweet) {
    // async get tweet info
    $scope.tweets = Tweet.map();
    // set up a map
	$scope.map = {
        center: {latitude: 40.1451, longitude: -99.6680 }, 
        zoom: 3, 
        bounds: {}
    };
    $scope.options = {scrollwheel: false};
    $scope.randomMarkers = [];
    var createMarker = function(i, tweet, idKey) {
        if (idKey == null) {
            idKey = "id";
        }

        var ret = {
            geometry: tweet.geo,
            tweetId: tweet._id
            //user: tweet.user_screen_name,
            //created_at: tweet.created_at,
            //text: tweet.text,
            //source: tweet.source,
            //show: false
        };
        /*
        ret.onClick = function() {
            console.log("Clicked!");
            ret.show = true;
            //$scope.apply();
        };
        */
        ret[idKey] = i;
        return ret;
    };

    $scope.tweets.$promise.then(function() {
        // when it comes here, it means all tweets info have been retrieved
        // then we can use $scope.tweets.forEach(fucntion(tweet) {create markers})
        //var tweetsCopy = $scope.tweets;
        console.log("total tweets:", $scope.tweets.length);
        var markers = [];
        var len = $scope.tweets.length;
        for (var i = 0; i < len; i++) {
            //console.log($scope.tweets[i]);
            var tweet = $scope.tweets[i];
            markers.push(createMarker(i, tweet));
            //console.log(markers[i]);
        }
        $scope.randomMarkers = markers;
        
    });
}]);

TweetControllers.controller('RealTimeStreamingController', ['$scope', 'Socket', function($scope, Socket) {
    $scope.tweets = [];
    $scope.btnIsDisabled = false;
    $scope.btnText = "Find Tweets From San Francisco";
    $scope.btnIsDisabledStop = true;
    $scope.btnTextStop = "Stop Streaming Tweets";

    $scope.findTweets = function findTweets() {

        Socket.emit('tweet-io:start', true);

        $scope.btnText = "Streaming Real Time Tweets Now...";
        $scope.btnIsDisabled = true;
        $scope.btnIsDisabledStop = false;

        Socket.on('tweet-io:tweets', function (data) {
            //console.log(data);
            $scope.tweets = $scope.tweets.concat(data);
            //$scope.tweets = data;
        });         
    };

    $scope.stopStreaming = function stopStreaming() {
        Socket.emit('tweet-io:stop', true);
        $scope.btnText = "Find Tweets From San Francisco";
        $scope.btnIsDisabled = false;
        $scope.btnIsDisabledStop = true;
    };
}]);