var io = require('socket.io')(8082);
io.on('connection', function (socket) {
	socket.on('new.post.created', function () {
		io.emit('new.post.created');
	});
});
console.log('Node server is running on port '+ 8082);