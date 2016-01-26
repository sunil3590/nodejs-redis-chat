# nodejs-redis-chat
A multi-client chat server with Node.js as server and Redis as data store

#### Prerequisites:
Install node.js
```
sudo apt-get update
sudo apt-get install git-core curl build-essential openssl libssl-dev
git clone https://github.com/joyent/node.git
cd node
./configure
make
sudo make install
```

#### To install nodejs-redis-chat:
```
sudo npm install nodejs-redis-chat
```

#### To start chat server:
```
sudo node index.js
```

#### Usage:
Connect to the chat server at http://127.0.0.1:3000 using a web browser and chat on!

#### TODO:
1. Add support to store messages in redis
2. Add configurability of chat server
3. Client should keep only last few messages in the history section
4. Persist messages on a regular basis