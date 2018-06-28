const jpeg = require('jpeg-js');

process.on('message', (data) => {
  var {id, frame} = data
  frame.data = Buffer.from(frame.data, 'base64')
  var newFrameData = []
  var newI = 0
  var oldI = 0
  while (oldI < frame.data.length) {
    // list.splice( 1, 0, "baz"); // at index position 1, remove 0 elements, then add "baz" to that position
    newFrameData[newI++] = frame.data[oldI++]; // red
    newFrameData[newI++] = frame.data[oldI++]; // green
    newFrameData[newI++] = frame.data[oldI++]; // blue
    newFrameData[newI++] = 0xFF; // alpha - ignored in JPEGs
  }
  frame.data = newFrameData
  frame.data = jpeg.encode(frame, 97).data.toString('base64')
  process.send({
    id,
    frame
  })
})