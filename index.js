var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var cam = require('linuxcam');
const os = require('os')
const workersManager = require('./workersManager');

const frames = {
  queue: [],
  maxQueue: Math.round(os.cpus().length * 1.2),
  n: 0,
  lastSent: -1,
  parseFrame() {
    const possibleNextFrame = frames.queue.findIndex(foundframe => foundframe.frameN === frames.lastSent + 1)
    if (possibleNextFrame === -1) return false
    io.emit('imgdata', frames.queue[possibleNextFrame])
    frames.queue.splice(possibleNextFrame, 1)
    frames.lastSent++
    getNextFrame()
  }
}

setInterval(() => {
  frames.parseFrame()
}, 1000 / 30)

function getNextFrame() {
  if (frames.queue.length >= frames.maxQueue) return false
  var frame = cam.frame()
  frame.frameN = frames.n++
  frame.data = frame.data.toString('base64')
  var frameInQueue = {
    promise: workersManager.parseFrame(frame).then((frame) => {
      frameInQueue = Object.assign(frameInQueue, frame)
    })
  }
  frames.queue.push(frameInQueue)
  getNextFrame()
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