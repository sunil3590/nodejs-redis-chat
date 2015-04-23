// connect to chat server
var server_name = "http://127.0.0.1:3000/";
var socket = io.connect(server_name);
console.log('Client connecting to chat server ' + server_name);

// receive user ID from server
var ID = "unknown";
socket.on('user-id', function(data) {
	ID = data.userID;
	console.log('user-id: ' + ID);
});

// handle an old message
socket.on('old-msg', function(data) {
	console.log('old-msg: ' + data.userID + " " + data.text);

	var old_msgs = $("#old_msgs");

	if(data.userID == ID) {
		old_msgs.prepend("<li id='my_msg'><strong>" + data.userID + "</strong>: " + data.text + "</li>");
	} else {
		old_msgs.prepend("<li id='their_msg'><strong>" + data.userID + "</strong>: " + data.text + "</li>");
	}
});

// set a handler for onclick event of "send" button
var botton = document.getElementById('send');
botton.onclick = send_msg;

// function to send message to server
function send_msg() {
	var msg = $('#new_msg').val();
	$('#new_msg').val('');

	console.log('new-msg: ' + ID + " " + msg);

	socket.emit('new-msg', {userID: ID, text: msg});
}
