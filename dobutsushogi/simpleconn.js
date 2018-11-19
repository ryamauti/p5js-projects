// Create SocketIO instance, connect

var socket = io.connect('http://127.0.0.1:3000'); 

// Add a connect listener
socket.on('connect',function() {
    console.log('Client has connected to the server!');
});
// Add a connect listener
socket.on('message',function(data) {
    console.log('Received a message from the server!',data);
});
// Add a disconnect listener
socket.on('disconnect',function() {
    console.log('The client has disconnected!');
});

function sendmsg(msg) {
    socket.emit('chat message', msg);
}

socket.on('chat message',function(data) {
    console.log('mensagem recebida:',data);
});
