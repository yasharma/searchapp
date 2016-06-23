var http = require('http');
var fs = require('fs');
// write nginx tmp
fs.writeFile("/tmp/app-initialized", "Ready to launch nginx", function(err) {
    if(err) {
        console.log(err);
    } else {
        console.log("The file was saved!");
    }
});

var server = http.createServer();
// listen on the nginx socket
server.listen('/tmp/nginx.socket', function() {
    console.log("Listening ");
});