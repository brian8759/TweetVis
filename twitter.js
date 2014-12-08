var T = require('./twitWrapper');
var io = require('./bin/www').io;
var schema = require('./schema/schema');
var mongoose = require('mongoose');


var zerorpc = require("zerorpc");

var client = new zerorpc.Client();
client.connect("tcp://127.0.0.1:4242");
/*
client.invoke("hello", "RPC", function(error, res, more) {
    console.log(res);
});
*/

// then we can use mongoose.model('Collection', schema, 'collection_name'); 
var TWEETS_BUFFER_SIZE = 1;
var SOCKETIO_TWEETS_EVENT = 'tweet-io:tweets';
var NEW_STREAMING_PARAM = 'newStreamingParam';
var SOCKETIO_START_EVENT = 'tweet-io:start';
var SOCKETIO_STOP_EVENT = 'tweet-io:stop';
var isFirstConnectionToTwitter = true;

console.log("Waiting for client.....");
//var stream = T.stream('statuses/filter', { locations: [-122.75,36.8,-121.75,37.8] });
var tweetsBuffer = [];
var stream = null;

//Handle Socket.IO events
var discardClient = function() {
	console.log('Client disconnected. Stop streaming from Twitter!');
	stream.stop();
};

var handleClient = function() {
	console.log('Client connected! Start streaming from Twitter...');
	stream.start();
};

var broadcastTweets = function() {
	//send buffer only if full
	if(tweetsBuffer.length >= TWEETS_BUFFER_SIZE) {
		//broadcast tweets
		io.sockets.emit(SOCKETIO_TWEETS_EVENT, tweetsBuffer);
		
		tweetsBuffer = [];
	}
};

var keyWord;
// a valid longitude should be {-180, 180}, a valid latitude should be {-90, 90}
var longitude = 250;
var latitude = 250;
var margin = 0.15;
var model;
io.sockets.on('connection', function(socket) {
	socket.on(NEW_STREAMING_PARAM, function(data) {
		if(stream != null) {
			stream.stop();
			isFirstConnectionToTwitter = true;
			stream = null;
		}
		// we use keyword or cityName_geoLocation as the collection name
		if(typeof(data) === 'string') {
			console.log('type:', typeof(data), data);
			keyWord = data;
			// reset the longitude and latitude
			longitude = 250;
			latitude = 250;
			var collectionName = keyWord.toLowerCase();
			model = mongoose.model(collectionName, schema, collectionName);
			stream = T.stream('statuses/filter', { track: keyWord });
		} else {
			console.log('type:', typeof(data), data);
			// data = {longitude: lon, latitude: lat}
			var cityName = data.name;
			longitude = +data.longitude;
			latitude = +data.latitude;
			var collectionName = cityName.concat('_', '[', data.longitude, ', ', data.latitude, ']');
			model = mongoose.model(collectionName, schema, collectionName);
			stream = T.stream('statuses/filter', { locations: [longitude-margin, latitude-margin, longitude+margin, latitude+margin] });
		}

		stream.on('connect', function(request) {
			console.log('Connected to Twitter API');

			if (isFirstConnectionToTwitter) {
				isFirstConnectionToTwitter = false;
				console.log("for saving bandwidth, stop useless streaming");
				stream.stop();
			}
		});

		stream.on('disconnect', function(message) {
			console.log('Disconnected from Twitter API. Message: ' + message);
		});

		stream.on('reconnect', function (request, response, connectInterval) {
		  	console.log('Trying to reconnect to Twitter API in ' + connectInterval + ' ms');
		});

		stream.on('tweet', function(tweet) {
			
			
			if (tweet.coordinates == null || tweet.place == null) {
				return ;
			}
			// we need to check tweet's geo location first
			if(longitude !== 250 || latitude !== 250) {
				// this means we are streaming tweets based on geo location
				var tweetLongitude = tweet.coordinates.coordinates[0];
				var tweetLatitude = tweet.coordinates.coordinates[1];
				if(tweetLongitude < (longitude-margin) || tweetLongitude > (longitude+margin))
					return;
				if(tweetLatitude < (latitude-margin) || tweetLatitude > (latitude+margin))
					return;
			}

			//Create message containing tweet + location + username + profile pic
			/*
			var msg = {};
			msg.text = tweet.text;
			msg.location = tweet.place.full_name;
			msg.user = {
				name: tweet.user.name, 
				image: tweet.user.profile_image_url,
				coordinates: tweet.coordinates
			};
			*/
			//console.log(msg);
			/*
				var tuple = new model({
					text: tweet.text,
					created_at: tweet.created_at,
					source: tweet.source,
					name: tweet.user.name, 
					user_screen_name: tweet.user.screen_name
					//attitude: tweet.attitude
				});
				tuple.geo.push({
					type: tweet.coordinates.type,
					coordinates: tweet.coordinates.coordinates
				});
				tuple.save(function(err, doc) {
					if(err) console.error(err);
					else console.dir(doc);
				});
				//push msg into buffer
				tweetsBuffer.push(msg);

				broadcastTweets();
			*/

			
			// send valid tweet to python server via zeroRPC
			client.invoke("classifySingle", tweet, function(error, res, more) {
    			console.dir(res);
    			// we can save this tweet into mongoDB
    			var tweet = res;
				var tuple = new model({
					text: tweet.text,
					created_at: tweet.created_at,
					source: tweet.source,
					name: tweet.user.name, 
					user_screen_name: tweet.user.screen_name,
					att: tweet.att
				});
				tuple.geo.push({
					type: tweet.coordinates.type,
					coordinates: tweet.coordinates.coordinates
				});
				tuple.save(function(err, doc) {
					if(err) console.error(err);
					else console.dir(doc);
				});
				//push msg into buffer
				var msg = {};
				msg.text = tweet.text;
				msg.location = tweet.place.full_name;
				msg.att = tweet.att;
				msg.user = {
					name: tweet.user.name, 
					image: tweet.user.profile_image_url,
					coordinates: tweet.coordinates
				};
				tweetsBuffer.push(msg);

				broadcastTweets();
			});
			

		});
	});
	
	socket.on(SOCKETIO_START_EVENT, handleClient);
	
	socket.on(SOCKETIO_STOP_EVENT, discardClient);

	socket.on('disconnect', discardClient);
});
