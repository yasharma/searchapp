var io = require('socket.io')(5001);
io.on('connection', function (socket) {
	socket.on('new.post.created', function () {
		io.emit('new.post.created');
	});
});
Server.listen(‘/tmp/nginx.socket’);