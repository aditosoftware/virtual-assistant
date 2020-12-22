const fs = require('fs');

const Logger = require('../loaders/logger').LoggerInstance;

// function to encode file data to base64 encoded string
function base64_encode(file) {
  // read binary data
  try {
    var bitmap = fs.readFileSync(file);
  } catch (err) {
    if (err.code === 'ENOENT') {
      Logger.error('encodeHelper - File not found: ' + file);
      return null;
    } else {
      Logger.error(err);
      throw err;
    }
  }
  // convert binary data to base64 encoded string
  return Buffer.from(bitmap).toString('base64');
}

module.exports = {
  base64_encode,
};
