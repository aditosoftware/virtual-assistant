const fs = require('fs');

const config = require('../config');
const Logger = require('./logger').LoggerInstance;

module.exports = () => {
  // create directory /audio if it does not exist
  if (!fs.existsSync(config.NODE_SERVER_FS_AUDIO_PATH)) {
    Logger.info('directoryLoader: directory /audio does not exist');
    try {
      fs.mkdirSync(config.NODE_SERVER_FS_AUDIO_PATH);
      Logger.info('directoryLoader: directory /audio created');
    } catch (err) {
      Logger.error(err);
    }
  }
};
