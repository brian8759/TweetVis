/*
 * For testing real time streaming tweets
*/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var geoSchema = new Schema({
	'type': { type: String, default: "Point" },
	coordinates: [{ type: "Number" }]
});

var tweetSchema = new Schema({
		text: String,
		created_at: Date,
		source: String,
		geo: [geoSchema],
		user_screen_name: String
	}, {collection: 'EbolaGeoLatest'});

module.exports = mongoose.model('EbolaGeoLatest', tweetSchema);