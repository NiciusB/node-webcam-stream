var jpeg = require('jpeg-js');

process.on('message', (frame) => {
  var newFrameData = []
  var newI = 0
  var oldI = 0
  while (oldI < frame.data.length) {
    newFrameData[newI++] = frame.data[oldI++]; // red
    newFrameData[newI++] = frame.data[oldI++]; // green
    newFrameData[newI++] = frame.data[oldI++]; // blue
    newFrameData[newI++] = 0xFF; // alpha - ignored in JPEGs
  }
  var jpeg_frame = jpeg.encode({
    width: frame.width,
    height: frame.height,
    data: newFrameData
  }, 97);
  jpeg_frame.data = jpeg_frame.data.toString('base64')

  process.send(jpeg_frame)
})