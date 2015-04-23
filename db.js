'use strict';

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/RealTimeTweets');
var connection = mongoose.connection;

connection.on('open', function(){
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