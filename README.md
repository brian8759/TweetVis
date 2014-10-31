Near real time data visualizaiton of twitter users' reaction on breaking events

Adapt the "MEAN" stack.
Use MongoDB as the database storage.
Use Node.js and express.js to make the back end. 
Use Mongoose as the connection layer between Node.js and MongoDB.
Use Angular.js to do the front end.

I used ngRoute to handle different views. 
So far, three views, they are, "listing all tweets in the DB", "listing the detail info of certain tweet" and 
"visualizing the tweets' GEO in the google map"
So far, I have used UI Boottrap to implement the pagination.
And I combine the pagination with user defined query and the sorting method.

Besides, I have used the angular-google-maps to show the tweets' geo location. 
The markers will be clustered at the first time. Then user can click it and zoom into the detail part.
If user click the marker, the info window will show the detail part of the tweet.


However, if we have too many markers to draw on the google map, it will be really slow to render the map with makers in the browser(client side).
Therefore, we need to render the google map with markers in the node.js, via jade.

googlemap.jade is a test file to render the google map with four markers in the node.js with jade. And it works!!

After checking online resource, I found out rendering big data in google maps in the node.js is not good for  
my case. Because, this projects involves large amount of user interaction in the front-end.
I will find other ways to do it.

One possible choice:
At first, we only fetch Geo information of every tweets from DB. Then we create markers containing geo info. 
And render markers in the angular.js.
Later, when user zoom in and click one marker, this marker will use tweet._id to query DB again to retrieve the detail info 
of this tweet, and show it up in the info window. This way can handle 5285 tweets at one time. However, when it comes to 7000
tweets, it does not work!


Add one important functionality:
With the help of Twit, we can stream live tweets now, and apply some filters, such as location and key word.

We can use "natural" module, to create a Naive Bayes Classifier, then use a corpus to train the classifier,
then for every incoming tweet, we can do the sentimental analysis

However, this is still "beat the bush!!"

I found a great way to do the sentiment analysis.
Use ZeroRPC to connect python and node.js.
Use current Twit in node.js to stream Tweets, and then for a batch of tweets, send them to python part via ZeroRPC, to use
the well established nltk package. 
Then in the node.js part, the callback will have the result and push it to the frontend!!
This is brilliant!!

Bugs:
1: If I put "saving bandwidth" methods into stream.on('connect'), there will be [Error: socket hang up] code: 'ECONNRESET'.
If I put it into stream.on('tweet'), no errors!

So far, user can dynamically stream real time Tweets based on keyword and geo location. 

Everytime when user create a new keyword or a new geo location, a new collection will be created in the MongoDB.
And real time tweets will be streamed and saved into that collection.
Then when user stop streaming, he can query the DB to retrieve those tweets!

