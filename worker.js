const jpeg = require('jpeg-js');

process.on('message', (datafromarg) => {
  let {id, frame} = datafromarg
  let parsedRGB = Buffer.from(frame.data, 'base64')
  frame.data = new Array(frame.width * frame.height * 4)
  let newI = 0
  let oldI = 0
  while (oldI < parsedRGB.length) {
    frame.data[newI++] = parsedRGB[oldI++]; // red
    frame.data[newI++] = parsedRGB[oldI++]; // green
    frame.data[newI++] = parsedRGB[oldI++]; // blue
    frame.data[newI++] = 255; // alpha - ignored in JPEGs
  }
  frame.data = jpeg.encode(frame, 97).data.toString('base64')
  process.send({
    id,
    response: frame
  })
})