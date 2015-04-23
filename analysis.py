import requests
import csv,json
import re
import unicodedata
import zerorpc

class HelloRPC(object):
	# this is the dummy classify by using the website
	def classifyURL(self, datalist):
		pattern = '[a-zA-z]'
		tweets = []
		for data in datalist:		
			pr_data = unicodedata.normalize('NFKD',data['text']).encode('ascii','ignore')
			r = requests.post('http://text-processing.com/api/sentiment/', data=("text=" + pr_data))
			resp = ''
			while resp == '':
				resp = r.content.split()
				
			data['att'] = ''.join(re.findall(pattern,resp[len(resp)-1]))

			print data['att']
			data['att'] = 'pos'
		return datalist


	def classifySingle(self, data):
		pattern = '[a-zA-z]'
		tweets = []
		print data['text']
		try:
			tweet = data['text']
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
			pr_data = tweet

			r = requests.post('http://text-processing.com/api/sentiment/', data=("text=" + pr_data))

			resp = ''
			while resp == '':			
				resp = r.content.split() 

			data['att'] = ''.join(re.findall(pattern,resp[len(resp)-1]))
			print data['att']
			return data
		except:
			data['att'] = 'neutral'
			return data

s = zerorpc.Server(HelloRPC())
s.bind("tcp://0.0.0.0:4242")
s.run()

