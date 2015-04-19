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
		name: String,
		user_screen_name: String,
		att: String
	});

module.exports = tweetSchema;
