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
    $scope.btnIsDisabledKeyWord = false;
    $scope.btnText = "Stream Tweets Now";
    $scope.btnIsDisabledStop = true;
    $scope.btnTextStop = "Stop Streaming Tweets";

    $scope.map = {
            center: {latitude: 37.47, longitude: -122.26 }, 
            zoom: 2, 
            bounds: {},
            options: {scrollwheel: false},
            marker: [],
            markersControl: {}
    };
    var count = 1;

    $scope.sendKeyWord = function() {
        var keyWord = $scope.keyWord;
        if(keyWord) {
            Socket.emit('sendKeyWord', $scope.keyWord);
            $scope.btnIsDisabledKeyWord = true;
            $scope.btnIsDisabled = false;
            // we need to clean tweets and markers
            $scope.tweets = [];
            $scope.map.markersControl.getGMarkers().forEach(function(marker) {
                marker.setMap(null);
            });
            $scope.map.marker = [];
        } else {
            alert('You must enter a valid meaningful streaming keyWord');
        }
        
    };

    $scope.cleanMarkers = function cleanMarkers() {
        $scope.tweets = [];
        $scope.map.markersControl.getGMarkers().forEach(function(marker) {
            marker.setMap(null);
        });
        $scope.map.marker = [];
    };

    $scope.findTweets = function findTweets() {
        Socket.emit('tweet-io:start', true);
        $scope.btnText = "Streaming Tweets Now...";
        $scope.btnIsDisabled = true;
        $scope.btnIsDisabledStop = false;
    };

    $scope.stopStreaming = function stopStreaming() {
        Socket.emit('tweet-io:stop', true);
        $scope.btnText = "Stream Tweets Now";
        $scope.btnIsDisabled = false;
        $scope.btnIsDisabledKeyWord = false;
        $scope.btnIsDisabledStop = true;
    };

    Socket.on('tweet-io:tweets', function (data) {
        console.log(data);
        $scope.tweets = $scope.tweets.concat(data);
        // for each object in data, we check the data[i].user.coordinates
        data.forEach(function(v) {
            if(v.user.coordinates != null) {
                var marker = {
                    id: count,
                    geometry: v.user.coordinates,
                    user_name: v.user.name,
                    text: v.text,
                    show: false
                };
                marker.onClick = function() {
                    marker.show = !marker.show;
                };
                //console.log(marker);
                count++;
                $scope.map.marker.push(marker);
            }
        });
    });         
}]);