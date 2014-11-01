var mongoose = require('mongoose');
var Admin = mongoose.mongo.Admin;

//mongoose.connect('mongodb://localhost:27017/Ebola');

mongoose.connect('mongodb://localhost:27017/RealTimeTweets');
var connection = mongoose.connection;

connection.on('open', function(){
  // retrieving the list of databases in MongoDB	
  new Admin(connection.db).listDatabases(function(err, result) {
  	 console.log('listDatabases succeeded');
  	 console.log(result.databases);
  });	
  // retrieving the list of collections in connecting database
  connection.db.collectionNames(function(error, names) {
    if (error) {
      throw new Error(error);
    } else {
      names.map(function(name) {
        console.log('found collection', name);
      });
    }
  });
});
 
connection.on('error', function(error){
  throw new Error(error);
});

module.exports = mongoose.connection;