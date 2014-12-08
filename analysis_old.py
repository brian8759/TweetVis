import requests
import csv,json
import re
import unicodedata
import zerorpc

# implement nltk 

class HelloRPC(object):
	# this is the dummy classify by using the website
	def classifyURL(self, datalist):
		pattern = '[a-zA-z]'
		tweets = []
		for data in datalist:		
			#pr_data = unicodedata.normalize('NFKD',data['text']).encode('ascii','ignore')
			#pr_data = "dislike you: so boring"
			#r = requests.post('http://text-processing.com/api/sentiment/', data=("text=" + pr_data))
			#resp = r.content.split() # this is a string list
			
			#data['att'] = ''.join(re.findall(pattern,resp[len(resp)-1]))
			#print pr_data
			#print data['att']
			#print
			data['att'] = 'pos'
		return datalist


	def print_url(r, *args, **kwargs):
		print 'Finish calling API'
		resp = r.content.split() # this is a string list
		print 'Splitted resp'
		#data['att'] = ''.join(re.findall(pattern,resp[len(resp)-1]))
		print ''.join(re.findall(pattern,resp[len(resp)-1]))
		print 'appending resp'
		#print data['att']
		#return data

	def classifySingle(self, data):
		data['att'] = 'pos'
		#pr_data = unicodedata.normalize('NFKD',data['text']).encode('ascii','ignore')
		pr_data = "dislike you: so boring"
		print 'Yes, ready to call API'
		#return requests.post('http://text-processing.com/api/sentiment/', data=("text=" + pr_data), hooks=dict(response=print_url))
		return requests.post('http://text-processing.com/api/sentiment/', data=("text=" + pr_data), hooks=dict(response=print_url))
		#print r
		#return data

		'''
		print 'Finish calling API'
		resp = r.content.split() # this is a string list
		print 'Splitted resp'
		data['att'] = ''.join(re.findall(pattern,resp[len(resp)-1]))
		print 'appending resp'
		print data['att']
		return data
		'''


s = zerorpc.Server(HelloRPC())
s.bind("tcp://0.0.0.0:4242")
s.run()