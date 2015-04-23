var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var io = require('socket.io');
var http = require('http');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// set up a server and socket.io
var server = http.createServer(app);
server.listen(3000);
var socket = io.listen(server);
console.log("Server listening to http://127.0.0.1:3000/");

// set up socket connection call back functions
socket.on('connection', onConnect);
socket.on('disconnection', onDisconnect);

// queue to hold messages
var msgs = [];

// to generate next user ID
var nextUserID = 0;

// handle new message from a client
function handleInComing(data) {
    console.log("new msg : " + data.userID + " " + data.text);

    // store the new message
    msgs[msgs.length] = data;

    // emit the new message to all clients
    socket.emit('old-msg', {userID: data.userID, text: data.text});
}

// handle new connections
function onConnect(client) {
    // send the client its user ID
    var uid = "user_" + nextUserID;
    client.emit('user-id', {userID: uid});
    console.log("new client conneceted : " + nextUserID);

    // update the next user ID
    nextUserID++;

    // set up handler for new-msg from client
    client.on('new-msg', handleInComing);

    // send all old msgs to new client
    sendOldMsgs(client);
}

// send all the old messages to a new client
function sendOldMsgs(client) {
    // send each message stored to the client
    for(i = 0; i < msgs.length; i++) {
        client.emit('old-msg', {userID: msgs[i].userID, text: msgs[i].text});
        //console.log("sent : " + msgs[i].userID + " " + msgs[i].text);
    }
}

// handle a client disconnection
function onDisconnect(socket) {
    console.log("A client disconnected");
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
