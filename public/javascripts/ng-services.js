"use strict";

var TweetServices = angular.module('tweetvis.Services', []);

TweetServices.factory('Tweet', function($resource) {
  var ret = $resource('tweetAPI/:tweetId', {}, {
    query: {
      method: 'GET', params: { tweetId: 'All' }, isArray: true
    },
    
    map: {
      method: 'GET', params: { tweetId: 'Map' }, isArray: true
    },

    render: {
      method: 'GET', params: { tweetId: 'Render' }, isArray: true
    }
  });
  return ret;
});

TweetServices.factory('Socket', function($rootScope) {
  var socket = io.connect('http://localhost:3000');
  return {
    on: function(eventName, callback) {
      socket.on(eventName, function() {
        var args = arguments;
        $rootScope.$apply(function() {
          if(callback) {
            callback.apply(socket, args);
          }
        });
      });
    },
    emit: function(eventName, data, callback) {
      socket.emit(eventName, data, function() {
        var args = arguments;
        $rootScope.$apply(function() {
          if(callback) {
            callback.apply(socket, args);
          }
        });
      });
    }
  };
});
