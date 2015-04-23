'use strict';

var Twit = require('twit');
var sensitiveData = require('./sensitiveData');

var T = new Twit({
	consumer_key: sensitiveData.consumer_key,
	consumer_secret: sensitiveData.consumer_secret,
	access_token: sensitiveData.access_token,
	access_token_secret: sensitiveData.access_token_secret
});

module.exports = T;