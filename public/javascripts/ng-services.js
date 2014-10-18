"use strict";

var TweetServices = angular.module('tweetvis.Services', []);

TweetServices.factory('Tweet', function($resource) {
  var ret = $resource('tweetAPI/:tweetId', {}, {
    query: {
      method: 'GET', params: { tweetId: 'All' }, isArray: true
    },
    
    map: {
      method: 'GET', params: { tweetId: 'Map' }, isArray: true
    }
    
    // we can define more methods here
  });
  // we can even add more methods to the Service itself, via
  // ret.prototype.functionName = function(){}
  return ret;
});
