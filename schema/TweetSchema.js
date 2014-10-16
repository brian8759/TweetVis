var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var geoSchema = new Schema({
	'type': { type: String, default: "Point" },
	coordinates: [{ type: "Number" }]
});

//var Geo = mongoose.model('Geo', geoSchema);

var tweetSchema = new Schema({
		text: String,
		created_at: Date,
		source: String,
		//geo: {type: mongoose.Schema.Types.ObjectId, ref: 'Geo'},
		// nested schema!!
		geo: [geoSchema],
		user_screen_name: String
	}, {collection: "Oct16thEvent"});

//var collection = 'Oct16thEvent';

module.exports = mongoose.model('Oct16thEvent', tweetSchema);