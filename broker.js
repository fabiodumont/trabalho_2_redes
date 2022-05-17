var mosca = require('mosca');
var settings = {
        port:1883
        }
 
var server = new mosca.Server(settings);
 
server.on('start', function(){
console.log("start");
});
