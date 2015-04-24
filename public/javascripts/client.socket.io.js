// connect to chat server
var server_name = "http://127.0.0.1:3000/";
var socket = io.connect(server_name);
console.log('Client connecting to chat server ' + server_name);

// receive user ID from server
var ID = "unknown";
socket.on('user-id', function(data) {
	ID = data.userID;
	console.log('user-id : ' + ID);
});

// handle an old message
socket.on('old-msg', function(data) {
	console.log('old-msg : ' + data.userID + " " + data.text);

	var old_msgs = $("#old_msgs");

	// add the old message to the list to present on webpage
	if(data.userID == ID) {
		old_msgs.append("<li id='my_msg'><strong>" + data.userID + "</strong>: " + data.text + "</li>");
	} else {
		old_msgs.append("<li id='their_msg'><strong>" + data.userID + "</strong>: " + data.text + "</li>");
	}

	// set the scroll to the bottom to show the latest message
	// http://stackoverflow.com/questions/19199712/how-to-keep-scroll-bar-always-to-bottom-of-page
	$("#history").animate({ scrollTop: $("#old_msgs").height() }, 1);
});

// handle a status message
socket.on('status', function(data) {
	console.log('status : ' + data.statusMsg);

	var old_msgs = $("#old_msgs");

	// display the status message
	old_msgs.append("<li id='status_msg'>" + data.status + "</li>");
});

// set a handler for onclick event of "send" button
var botton = document.getElementById("send");
botton.onclick = send_msg;

// send message on "enter" key
// http://stackoverflow.com/questions/979662/how-to-detect-pressing-enter-on-keyboard-using-jquery
$(document).keypress(function(e) {
    if(e.which == 13) {
        send_msg();
    }
});

// function to send message to server
function send_msg() {
	var msg = $('#new_msg').val();
	$('#new_msg').val('');
	$('#new_msg').focus();

	console.log('new-msg : ' + ID + " " + msg);

	// send the new message to the server
	socket.emit('new-msg', {userID: ID, text: msg});
}
