var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var geoSchema = new Schema({
	type: String,
	coordinates: [Number]
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
	});


module.exports = mongoose.model('EbolaLatest', tweetSchema);