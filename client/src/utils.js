function playOutput(arrayBuffer) {
  let audioContext = new AudioContext();
  let outputSource = audioContext.createBufferSource();
  try {
    if (arrayBuffer.byteLength > 0) {
      audioContext.decodeAudioData(
        arrayBuffer,
        (buffer) => {
          audioContext.resume();
          outputSource.connect(audioContext.destination);
          outputSource.buffer = buffer;
          outputSource.start(0);
        },
        () => {
          console.log(arguments);
        }
      );
    }
  } catch (e) {
    console.log(e);
  }
}

function toArrayBuffer(buf) {
  var ab = new ArrayBuffer(buf.length);
  var view = new Uint8Array(ab);
  for (var i = 0; i < buf.length; ++i) {
    view[i] = buf[i];
  }
  return ab;
}

function blobToFile(blob, fileName) {
  // Blob() is almost a File() - it's just missing the two properties below which will get added by this function
  if (blob && fileName) {
    blob.lastModifiedDate = new Date();
    blob.name = fileName;
  }
  return blob;
}

export { playOutput, toArrayBuffer, blobToFile };
