const fs = require('fs');

// function to encode file data to base64 encoded string
function base64_encode(file) {
    // read binary data
    try {
      var bitmap = fs.readFileSync(file);
    } catch (err) {
      if (err.code === 'ENOENT') {
        console.log('File not found!');
        return null;
      } else {
        throw err;
      }
    }
    // convert binary data to base64 encoded string
    return Buffer.from(bitmap).toString('base64');
  }

module.exports = {
base64_encode,
};
  