Near real time data visualizaiton of twitter users' reaction on breaking events

HowTo:
Step 1: install node.js, npm
Step 2: npm install
step 3: install zeroRPC
step 4: python analysis.py
step 5: node ./bin/www
step 6: go to localhost:3000


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

Caution:
I found out it had some bugs while installing zeroRPC with latest Node.js (Version: 12.2X).
Please downgrade Node.js to 10.3X, then everything works well.

Bugs:
1: If I put "saving bandwidth" methods into stream.on('connect'), there will be [Error: socket hang up] code: 'ECONNRESET'.
If I put it into stream.on('tweet'), no errors!

So far, user can dynamically stream real time Tweets based on keyword and geo location. 

Everytime when user create a new keyword or a new geo location, a new collection will be created in the MongoDB.
And real time tweets will be streamed and saved into that collection.
Then when user stop streaming, he can query the DB to retrieve those tweets!

When the node.js receive a real time tweet, it will check if this tweet contains geo location, if so, then send to server.py via zeroRPC, 
in server.py, the nltk package will do the basic sentimental analysis via Naive Bayes Classifier, then get an attitude based on the tweet
text. Then add "attitude" into tweet, and send it back to node.js, then store it into MongoDB, and push it to the frontend.


