const Logger = require('./logger').LoggerInstance;
const directoryLoader = require('./directoryLoader');
const expressLoader = require('./expressLoader');

module.exports = async (app) => {
  await directoryLoader();
  Logger.info('Directory loaded');

  await expressLoader(app);
  Logger.info('Express loaded');
};
