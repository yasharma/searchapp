var fs = require('fs');
fs.openSync('/tmp/app-initialized', 'w');
var http = require('http');

//Create a server
var server = http.createServer();

/*var io = require('socket.io')(process.env.PORT);
io.on('connection', function (socket) {
	socket.on('new.post.created', function () {
		io.emit('new.post.created');
	});
});*/
console.log(process.env.PORT);
server.listen(process.env.PORT);
