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
			pr_data = unicodedata.normalize('NFKD',data['text']).encode('ascii','ignore')
			#pr_data = "dislike you: so boring"
			r = requests.post('http://text-processing.com/api/sentiment/', data=("text=" + pr_data))
			resp = ''
			while resp == '':
				resp = r.content.split() # this is a string list
				
			data['att'] = ''.join(re.findall(pattern,resp[len(resp)-1]))
			#print pr_data
			print data['att']
		       	#print
			data['att'] = 'pos'
		return datalist


	def classifySingle(self, data):
		print 'in Python'
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
			pr_data = tweet #unicodedata.normalize('NFKD',data['text']).encode('ascii','ignore')

			#pr_data = "dislike you: so boring"
			#print 'ready to call API'
			r = requests.post('http://text-processing.com/api/sentiment/', data=("text=" + pr_data))
			#print 'finish calling API'
			#print r.content
			resp = ''
			while resp == '':			
				#print 'in while'
				resp = r.content.split() # this is a string list
			#print 'ready to append'
			data['att'] = ''.join(re.findall(pattern,resp[len(resp)-1]))
			#print 'finish appending'
			print data['att']
			return data
		except:
			data['att'] = 'neutral'
			return data
'''
# Read files
with open('testdata.csv','rb') as csvfile:
    reader = csvfile.readlines() #csv.reader(csvfile, delimiter = '\n')
#print len(reader)
testsize = 10 # len(reader)
datalist=[]

for row in reader[:]:
    data = json.loads(row)
    data['att'] = "positive"
    datalist.append(data)
    #print json.dumps(data,sort_keys=True,indent=4, separators=(',', ': '))
    #textlist.append(data["text"])

#print textlist
test = HelloRPC()
#test.classifyURL(datalist)
for data in datalist:
	test.classifySingle(data)
'''
'''
#Write to file
f = open("output.csv", "w") 
for i in range(0,testsize):
    datalist[i]["label"]= labels[i]
    datalist[i]=json.dumps(datalist[i])
    f.writelines(datalist[i])
    f.write('\n')
#print len(datalist)

f.close()
'''


s = zerorpc.Server(HelloRPC())
s.bind("tcp://0.0.0.0:4242")
s.run()

