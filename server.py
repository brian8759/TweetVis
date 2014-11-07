#!/usr/bin/python

import zerorpc
import nltk.classify.util
from nltk.classify import NaiveBayesClassifier
from nltk.corpus import movie_reviews

def word_feature(words):
	return dict([(word, True) for word in words])

negIds = movie_reviews.fileids('neg')
posIds = movie_reviews.fileids('pos')

negFeatures = [(word_feature(movie_reviews.words(fileids=[f])), 'neg') for f in negIds]
posFeatures = [(word_feature(movie_reviews.words(fileids=[f])), 'pos') for f in posIds]

negCutoff = len(negFeatures) * 9/10
posCutoff = len(posFeatures) * 9/10

trainFeatures = negFeatures[:negCutoff] + posFeatures[:posCutoff]
testFeatures = negFeatures[negCutoff:] + posFeatures[posCutoff:]

print 'train on %d instances, test on %d instances' % (len(trainFeatures), len(testFeatures))

classifier = NaiveBayesClassifier.train(trainFeatures)
print 'accuracy:', nltk.classify.util.accuracy(classifier, testFeatures)
classifier.show_most_informative_features()

class HelloRPC(object):
	

    def hello(self, name):
        return "Hello, %s" % name

s = zerorpc.Server(HelloRPC())
s.bind("tcp://127.0.0.1:4242")
s.run()