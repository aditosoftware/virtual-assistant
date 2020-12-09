const expressLoader = require('./expressLoader');

module.exports = async (app) => {
  await expressLoader(app);
};
