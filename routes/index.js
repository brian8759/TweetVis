var express = require('express');
var router = express.Router();

var Tweet = require('../schema/TweetSchema');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'TweetVis' });
});

router.get('/tweetAPI/All', function(req, res) {
  Tweet.find({}, 'user_screen_name created_at', function(err, tweets) {
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
  //console.log(tweetId);
  Tweet.findById(tweetId, '', {lean: true}, function(err, tweet) {
    if(err) {
      res.status(500).json({ status: 'failure' });
    } else {
      //console.log(tweet);
      res.json(tweet);
    }
  });
});

module.exports = router;
