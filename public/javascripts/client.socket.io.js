// connect to chat server
var server_name = "http://127.0.0.1:3000/";
var socket = io.connect(server_name);
console.log('Client connecting to chat server ' + server_name);

// client nickname
var ID = "unknown";

// handle an old message event from server
socket.on('old-msg', handleOldMsg);

// handle a status message from server
socket.on('status', handleStatusMsg);

// on key press handler for new message text box
$('#new_msg').keypress(handleMsgKeyPress);

// on key press handler for user ID text box
$('#user_id').keypress(handleIDKeyPress);

// set a handler for onclick event of "send" button
var botton = document.getElementById("send");
botton.onclick = send_msg;

// disable everything till user name is obtained
$('#new_msg').attr('disabled', 'disabled');
$('#history').attr('disabled', 'disabled');
$('#send_btn').attr('disabled', 'disabled');

// set focus on the user id text box to start with
$('#user_id').focus();

// function to send message to server
function send_msg() {
	var msg = $('#new_msg').val();
	$('#new_msg').val('');
	$('#new_msg').focus();

	console.log('new-msg : ' + ID + " " + msg);

	// send the new message to the server
	socket.emit('new-msg', {userID: ID, text: msg});
}

// function to handle old message
function handleOldMsg(data) {
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
}

// function to handle status message
function handleStatusMsg(data) {
	console.log('status : ' + data.statusMsg);

	var old_msgs = $("#old_msgs");

	// display the status message
	old_msgs.append("<li id='status_msg'>" + data.status + "</li>");
}

// send message on "enter" key
// http://stackoverflow.com/questions/979662/how-to-detect-pressing-enter-on-keyboard-using-jquery
function handleMsgKeyPress(e) {
    if(e.which == 13) {
        send_msg();
    }
}

// handle key press on the user ID text box
function handleIDKeyPress(e) {
    if(e.which == 13) {
    	ID = $("#user_id").val();

    	// emit user ID to chat server
        socket.emit('user-id', {userID: ID});

        // disable the user ID text box
        $('#user_id').attr('disabled', 'disabled');

        // enable everything else
        $('#new_msg').removeAttr('disabled');
		$('#history').removeAttr('disabled');
		$('#send_btn').removeAttr('disabled');

		// set focus on the new msg text box to start with
		$('#new_msg').focus();
    }
}