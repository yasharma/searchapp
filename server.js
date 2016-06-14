var port = process.env.PORT || 3000;
var io = require('socket.io')(port);
io.on('connection', function (socket) {
	socket.on('new.post.created', function () {
		io.emit('new.post.created');
	});
});
console.log('app is listening on port ... ' + port);