# nodejs-redis-chat
A multi-client chat server with Node.js as server and Redis as data store

### To install:
```
npm install nodejs-redis-chat
```

### To start chat server:
```
node app.js
```

### Usage:
Connect to the chat server at http://127.0.0.1:3000 using a web browser and chat on!

### TODO:
1. Add support to store messages in redis
2. Add configurability of chat server
3. Add support to let user select user name
4. Client should keep only last few messages in memory
5. Persist messages in redis