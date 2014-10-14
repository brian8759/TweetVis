"use strict";

var TweetServices = angular.module('TweetServices', ['ngResource']);

TweetServices.factory('Tweet', function($resoure) {
  var ret = $resoure('tweetAPI/:tweetId', {}, {
    query: {
      method: 'GET', params: { tweetId: 'All' }, isArray: true
    }
    // we can define more methods here
  });
  // we can even add more methods to the Service itself, via
  // ret.prototype.functionName = function(){}
  return ret;
});
