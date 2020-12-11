const directoryLoader = require('./directoryLoader');
const expressLoader = require('./expressLoader');

module.exports = async (app) => {
  await directoryLoader(app);
  await expressLoader(app);
};
