var express = require('express');
var router = express.Router();
//var path = require('path');
var mongoose = require('mongoose');
var schema = require('../schema/schema');
var TweetSchema = require('../schema/TweetSchema');
var model;

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'TweetVis' });
  //res.render('googlemap',{});
});

router.get('/getAllCollections', function(req, res) {
  mongoose.connection.db.collectionNames(function(error, names) {
    if (error) {
      throw new Error(error);
    } else {
      console.dir(names);
      res.json(names);
    }
  });
});

router.post('/getAllTweets', function(req, res) {
  var collectionName = req.body.name;
  model = mongoose.model(collectionName, schema, collectionName);
  model.find({}, 'name user_screen_name created_at geo text att', {lean: true}, function(err, tweets) {
    if(err) {
      res.status(500).json({ status: 'failure' });
    } else {
      //console.log(tweets);
      res.json(tweets);
    }
  });
});

router.get('/tweetAPI/All', function(req, res) {
  TweetSchema.find({}, 'user_screen_name created_at att', {lean: true}, function(err, tweets) {
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
  TweetSchema.find({}, 'geo att', {lean: true})
  .limit(3000)
  .exec(function(err, tweets) {
    if(err) {
      res.status(500).json({ status: 'failure' });
    } else {
      //console.log(tweets);
      res.json(tweets);
    }
  });
});

router.get('/tweetAPI/:tweetId', function(req, res) {
  var tweetId = req.params.tweetId;
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
