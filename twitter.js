var T = require('./twitWrapper');
var io = require('./bin/www').io;
var TWEETS_BUFFER_SIZE = 1;
var SOCKETIO_TWEETS_EVENT = 'tweet-io:tweets';
var NEW_STREAMING_PARAM = 'newStreamingParam';
var SOCKETIO_START_EVENT = 'tweet-io:start';
var SOCKETIO_STOP_EVENT = 'tweet-io:stop';
var nbOpenSockets = 0;
var isFirstConnectionToTwitter = true;

console.log("Waiting for client.....");
//var stream = T.stream('statuses/filter', { locations: [-122.75,36.8,-121.75,37.8] });
var tweetsBuffer = [];
var stream = null;

//Handle Socket.IO events
var discardClient = function() {
	console.log('Client disconnected !');
	if(nbOpenSockets > 0) {
		nbOpenSockets--;
		if(nbOpenSockets == 0) {
			console.log("No active client. Stop streaming from Twitter");
			stream.stop();
		}
	}
};

var handleClient = function() {
	console.log('Client connected !');
		
	if(nbOpenSockets <= 0) {
		nbOpenSockets = 0;
		console.log('First active client. Start streaming from Twitter');
		stream.start();
	}

	nbOpenSockets++;
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

io.sockets.on('connection', function(socket) {
	socket.on(NEW_STREAMING_PARAM, function(data) {
		if(stream != null) {
			stream.stop();
			isFirstConnectionToTwitter = true;
			stream = null;
		}

		if(typeof(data) === 'string') {
			console.log('type:', typeof(data), data);
			var keyWord = data;
			stream = T.stream('statuses/filter', { track: keyWord });
		} else {
			console.log('type:', typeof(data), data);
			// data = {longitude: lon, latitude: lat}
			var longitude = +data.longitude;
			var latitude = +data.latitude;
			var margin = 0.3;
			stream = T.stream('statuses/filter', { locations: [longitude-margin, latitude-margin, longitude+margin, latitude+margin] });
		}

		stream.on('connect', function(request) {
			console.log('Connected to Twitter API');
		});

		stream.on('disconnect', function(message) {
			console.log('Disconnected from Twitter API. Message: ' + message);
		});

		stream.on('reconnect', function (request, response, connectInterval) {
		  	console.log('Trying to reconnect to Twitter API in ' + connectInterval + ' ms');
		});

		stream.on('tweet', function(tweet) {
			
			if (isFirstConnectionToTwitter) {
				isFirstConnectionToTwitter = false;
				console.log("for saving bandwidth, stop useless streaming");
				stream.stop();
			}
			
			if (tweet.coordinates == null || tweet.place == null) {
				return ;
			}

			//Create message containing tweet + location + username + profile pic
			var msg = {};
			msg.text = tweet.text;
			msg.location = tweet.place.full_name;
			msg.user = {
				name: tweet.user.name, 
				image: tweet.user.profile_image_url,
				coordinates: tweet.coordinates
			};

			console.log(msg);

			//push msg into buffer
			tweetsBuffer.push(msg);

			broadcastTweets();
		});
	});
	
	socket.on(SOCKETIO_START_EVENT, handleClient);
	
	socket.on(SOCKETIO_STOP_EVENT, discardClient);

	socket.on('disconnect', discardClient);
});
