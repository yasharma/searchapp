var io = require('socket.io')(process.env.PORT);
io.on('connection', function (socket) {
	socket.on('new.post.created', function () {
		io.emit('new.post.created');
	});
});
Server.listen('/tmp/nginx.socket');