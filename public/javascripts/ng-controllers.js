"use strict";

var TweetControllers = angular.module('tweetvis.Controllers', []);

TweetControllers.controller('ListAllTweetsController', ['$scope', 'Tweet', 'filterFilter', 
function($scope, Tweet, filterFilter) {
    $scope.tweets = Tweet.query();

    $scope.itemsPerPage = 20;
    $scope.currentPage = 1;

    $scope.tweets.$promise.then(function () {
    $scope.totalItems = $scope.tweets.length;
    
    $scope.maxSize = 8;
    $scope.$watch('query', function (newQuery, oldQuery) {
        $scope.currentPage = 1;
        $scope.filteredTweets = filterFilter($scope.tweets, {user_screen_name: $scope.query});
        $scope.noOfPages = $scope.filteredTweets.length / $scope.itemsPerPage;
        if(newQuery !== oldQuery) {
            $scope.totalItems = $scope.filteredTweets.length;
        }
    });
  });
}]);

TweetControllers.controller('ListAllCollections', ['$scope', '$http', function($scope, $http) {
    $http.get('/getAllCollections')
    .success(function(data) {
        $scope.collections = data;
    })
    .error(function(data, status) {
        console.log(status);
    });
}]);

TweetControllers.controller('ListOneTweetController', ['$scope', '$routeParams', 'Tweet', 
function($scope, $routeParams, Tweet) {
    $scope.tweet = Tweet.get({ tweetId: $routeParams.tweetId });
    
    $scope.tweet.$promise.then(function() {
        $scope.map = {
            center: {latitude: 40.1451, longitude: -99.6680 }, 
            zoom: 3, 
            bounds: {},
            options: {scrollwheel: false},
            marker: [{
                id: 1,
                longitude: $scope.tweet.geo[0].coordinates[0],
                latitude: $scope.tweet.geo[0].coordinates[1],
                tweetId: $scope.tweet._id
            }]
        };
        if($scope.tweet.att == 'neg') {
            $scope.map.marker[0].icon = "/images/user_neg.png";
        } else if($scope.tweet.att == 'pos') {
            $scope.map.marker[0].icon = "/images/user_pos.png"
        } else {
            $scope.map.marker[0].icon = "/images/user_neu.png"
        }
    });
    
}]);

TweetControllers.controller('ListOneCollection', ['$scope', '$routeParams', 'Tweet', '$http', 'filterFilter', 
function($scope, $routeParams, Tweet, $http, filterFilter) {
    $scope.itemsPerPage = 10;
    $scope.currentPage = 1;

    $http.get('/getAllTweets/' + $routeParams.collectionId)
    .success(function(tweets) {
        $scope.tweets = tweets;
        $scope.totalItems = $scope.tweets.length;
        $scope.maxSize = 8;
        $scope.$watch('query', function (newQuery, oldQuery) {
            $scope.currentPage = 1;
            $scope.filteredTweets = filterFilter($scope.tweets, {user_screen_name: $scope.query});
            $scope.noOfPages = $scope.filteredTweets.length / $scope.itemsPerPage;
            if(newQuery !== oldQuery) {
                $scope.totalItems = $scope.filteredTweets.length;
            }
        });
    })
    .error(function() {

    });
}]);

TweetControllers.controller('GoogleMapController', ['$scope', '$routeParams', 'Tweet', '$http', 
function($scope, $routeParams, Tweet, $http) {
    $scope.map = {
        center: {
            latitude: 40.1451, 
            longitude: -99.6680 
        }, 
        zoom: 3, 
        bounds: {},
        options: {
            scrollwheel: false
        },
        markers: []
    };
    
    var createMarker = function(i, tweet, idKey) {
        if (idKey == null) {
            idKey = "id";
        }

        var ret = {
            longitude: tweet.geo[0].coordinates[0],
            latitude: tweet.geo[0].coordinates[1],
            user: tweet.user_screen_name,
            created_at: tweet.created_at,
            text: tweet.text,
            show: false,
            tweetId: tweet._id
        };
        
        if(tweet.att == 'neg') {
            ret.icon = "/images/user_neg.png";
        } else if(tweet.att == 'pos') {
            ret.icon = "/images/user_pos.png"
        } else {
            ret.icon = "/images/user_neu.png"
        }

        ret.onClick = function() {
            ret.show = true;
        };
        
        ret[idKey] = i;
        return ret;
    };

    $http.get('/getAllTweets/' + $routeParams.collectionId)
    .success(function(tweets) {
        $scope.tweets = tweets;
        var markers = [];
        var len = $scope.tweets.length;
        for (var i = 0; i < len; i++) {
            var tweet = $scope.tweets[i];
            markers.push(createMarker(i, tweet));
        }
        $scope.map.markers = markers;
    })
    .error(function() {

    });

}]);

TweetControllers.controller('RealTimeStreamingController', ['$scope', 'Socket', 'uiGmapGoogleMapApi', 
function($scope, Socket, GoogleMapApi) {
    GoogleMapApi.then(function(maps) {
        maps.visualRefresh = true;
        $scope.defaultBounds = new google.maps.LatLngBounds(
          new google.maps.LatLng(40.82148, -73.66450),
          new google.maps.LatLng(40.66541, -74.31715)
        );

        
        $scope.map.bounds = {
          northeast: {
            latitude:$scope.defaultBounds.getNorthEast().lat(),
            longitude:$scope.defaultBounds.getNorthEast().lng()
          },
          southwest: {
            latitude:$scope.defaultBounds.getSouthWest().lat(),
            longitude:-$scope.defaultBounds.getSouthWest().lng()

          }
        }
        $scope.searchbox.options.bounds = new google.maps.LatLngBounds($scope.defaultBounds.getNorthEast(), $scope.defaultBounds.getSouthWest());
    });

    $scope.tweets = [];
    $scope.btnIsDisabled = false;
    $scope.btnIsDisabledKeyWord = false;
    $scope.btnText = "Stream Tweets Now";
    $scope.btnIsDisabledStop = true;
    $scope.btnTextStop = "Stop Streaming Tweets";

    $scope.map = {
        control: {},
        center: {
            latitude: 40.74349,
            longitude: -73.990822
        },
        zoom: 3,
        dragging: false,
        bounds: {},
        markers: [],
        markersControl: {},
        events: {
            idle: function (map) {
                var bounds = map.getBounds();
                var ne = bounds.getNorthEast(); // LatLng of the north-east corner
                var sw = bounds.getSouthWest(); // LatLng of the south-west corder
            }
        }
    };

    var cleanUp = function() {
        $scope.tweets = [];
        $scope.map.markersControl.getGMarkers().forEach(function(marker) {
            marker.setMap(null);
        });
        $scope.map.markers = [];
    };

    $scope.searchbox = {
      template:'searchbox.tpl.html',
      position:'top-left',
      options: {
        bounds: {} 
      },
      events: {
        places_changed: function (searchBox) {
          var places = searchBox.getPlaces();
          if (places.length == 0) {
            return;
          }
          
          var bounds = new google.maps.LatLngBounds();
          var place = places[0];

          var newStreamingParam = {
              name: place.name,        
              longitude: place.geometry.location.lng(),
              latitude: place.geometry.location.lat()
          };

          bounds.extend(place.geometry.location);

          Socket.emit('newStreamingParam', newStreamingParam);

            $scope.btnIsDisabledKeyWord = true;
            $scope.btnIsDisabled = false;
            cleanUp();
            $scope.map.center = {
                longitude: place.geometry.location.lng(),
                latitude: place.geometry.location.lat()
            };
            $scope.map.zoom = 10;
        }
      }   
    };

    var count = 1;

    $scope.sendKeyWord = function() {
        var keyWord = $scope.keyWord;
        if(keyWord) {
            Socket.emit('newStreamingParam', $scope.keyWord);
            $scope.btnIsDisabledKeyWord = true;
            $scope.btnIsDisabled = false;
            cleanUp();
            $scope.map.center = {
                latitude: 19.89677,
                longitude: -155.58278
            };
            $scope.map.zoom = 2;
        } else {
            alert('You must enter a valid meaningful streaming keyWord');
        }
        
    };

    $scope.cleanMarkers = cleanUp;

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
        $scope.tweets = $scope.tweets.concat(data);
        data.forEach(function(v) {
            if(v.user.coordinates != null) {
                var marker = {
                    id: count,
                    geometry: v.user.coordinates,
                    user_name: v.user.name,
                    text: v.text,
                    show: false
                };
                if(v.att == 'neg') {
                    marker.icon = "/images/user_neg.png";
                } else if(v.att == 'pos') {
                    marker.icon = "/images/user_pos.png"
                } else {
                    marker.icon = "/images/user_neu.png"
                }
                marker.onClick = function() {
                    marker.show = !marker.show;
                };
                count++;
                $scope.map.markers.push(marker);
            }
        });
    });         
}]);