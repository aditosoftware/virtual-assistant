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

export { toArrayBuffer, blobToFile };
