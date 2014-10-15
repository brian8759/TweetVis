var mongoose = require('mongoose');

//mongoose.connect('mongodb://localhost:27017/Ebola');

mongoose.connect('mongodb://localhost:27017/Apple');

module.exports = mongoose.connection;