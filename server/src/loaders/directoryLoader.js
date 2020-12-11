const fs = require('fs');

const config = require('../config');

module.exports = (app) => {
  // create directory /audio if it does not exist
  if (!fs.existsSync(config.NODE_SERVER_FS_AUDIO_PATH)) {
    console.log('directoryLoader: directory /audio does not exist');
    fs.mkdirSync(config.NODE_SERVER_FS_AUDIO_PATH);
    console.log('directoryLoader: directory /audio created');
  }
};
