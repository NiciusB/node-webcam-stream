var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var cam = require('linuxcam');
const child_process = require('child_process');


const forked = child_process.fork('webcam_frame.js')
forked.on('message', (jpeg_frame) => {
  io.emit("imgdata", jpeg_frame)
  getNextFrame()
});

function getNextFrame() {
  var frame = cam.frame()
  frame.data = frame.data.toString('base64')
  forked.send(frame)
}

setTimeout(() => {
  cam.start("/dev/video0", 640, 360)
  getNextFrame()
}, 1000)

io.on('connection', function(socket){
  socket.on('error', function(err){
    console.log("ERROR: "+err);
  });
});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});