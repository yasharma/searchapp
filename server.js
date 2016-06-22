var fs = require('fs');
var http = require('http');

//Create a server
var server = http.createServer();

/*var io = require('socket.io')(process.env.PORT);
io.on('connection', function (socket) {
	socket.on('new.post.created', function () {
		io.emit('new.post.created');
	});
});*/

server.listen('/tmp/nginx.socket');