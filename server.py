#!/usr/bin/python

import zerorpc
import json
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
		tweetString = json.loads(tweet)
		text = tweetString['text']
		attitude = self.classifier.classify(extract_features(text.split()))
		
s = zerorpc.Server(HelloRPC())
s.bind("tcp://127.0.0.1:4242")
s.run()