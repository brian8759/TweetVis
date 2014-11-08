#!/usr/bin/python

import zerorpc
import json
import re
import nltk.classify.util
from nltk.classify import NaiveBayesClassifier
from nltk.corpus import movie_reviews

def word_feature(words):
		return dict([(word, True) for word in words])

def extract_features(document):
	document_words = set(document)
	features = {}
	for word in word_features:
		features['contains(%s)' % word] = (word in document_words)
	return features

def preprocessTweet(tweet):
	''' here tweet is tweet.text '''
	# convert to lower case
	tweet = tweet.lower()
	# convert url to URL
	tweet = re.sub('((www\.[\s]+)|(https?://[^\s]+))','URL',tweet)
	# convert @username to AT_USER
	tweet = re.sub('@[^\s]+','AT_USER',tweet)
	# remove additional white spaces
	tweet = re.sub('[\s]+', ' ', tweet)
	# replace hashtag with regular word
	tweet = re.sub(r'#([^\s]+)', r'\1', tweet)
	# trim
	tweet = tweet.strip()
	return tweet

class HelloRPC(object):
	def __init__(self):
		negIds = movie_reviews.fileids('neg')
		posIds = movie_reviews.fileids('pos')
		negFeatures = [(word_feature(movie_reviews.words(fileids=[f])), 'neg') for f in negIds]
		posFeatures = [(word_feature(movie_reviews.words(fileids=[f])), 'pos') for f in posIds]
		trainFeatures = negFeatures + posFeatures
		self.classifier = NaiveBayesClassifier.train(trainFeatures)

	def hello(self, name):
		return "Hello, %s" % name

	def analyze(self, tweet):
		''' tweet is a json file, we need to extract the text part, and do feature extraction, then use classifier '''
		''' before analyzing tweet, we need to preprocess it'''
		tweetString = json.loads(tweet)
		text = tweetString['text']
		processedText = preprocessTweet(text)
		attitude = self.classifier.classify(extract_features(processedText.split()))
		
s = zerorpc.Server(HelloRPC())
s.bind("tcp://127.0.0.1:4242")
s.run()