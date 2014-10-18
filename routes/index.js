var express = require('express');
var router = express.Router();
//var path = require('path');
//var mongoose = require('mongoose');
//var TweetSchema = require('../schema/TweetSchema');
var model = require('../schema/TweetSchema');
//var db = require('../db');
//var db = mongoose.createConnection('localhost', 'Ebola');
//var model = db.model('testgeo', TweetSchema);

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'TweetVis' });
});

router.get('/tweetAPI/All', function(req, res) {
  //Tweet.find({}, 'user_screen_name created_at', function(err, tweets) {
  model.find({}, 'user_screen_name created_at', {lean: true}, function(err, tweets) {
    if(err) {
      res.status(500).json({ status: 'failure' });
    } else {
      //console.log(tweets);
      res.json(tweets);
    }
  });	
});

router.get('/tweetAPI/Map', function(req, res) {
  //Tweet.find({}, 'user_screen_name created_at', function(err, tweets) {
  model.find({}, '', {lean: true})
  .limit(1000)
  .exec(function(err, tweets) {
    if(err) {
      res.status(500).json({ status: 'failure' });
    } else {
      //console.log(tweets);
      res.json(tweets);
    }
  });
  /*  
  model.find({}, function(err, tweets) {
    if(err) {
      res.status(500).json({ status: 'failure' });
    } else {
      //console.log(tweets);
      res.json(tweets);
    }
  }); 
*/
});

router.get('/tweetAPI/:tweetId', function(req, res) {
  var tweetId = req.params.tweetId;
  //console.log(tweetId);
  //Tweet.findById(tweetId, '', {lean: true}, function(err, tweet) {
  model.findById(tweetId, '', {lean: true}, function(err, tweet) {
    if(err) {
      res.status(500).json({ status: 'failure' });
    } else {
      //console.log(tweet);
      //res.sendFile(path.join(__dirname, '../public/partials/', 'googlemap.htm'));
      res.json(tweet);
    }
  });
});

module.exports = router;
