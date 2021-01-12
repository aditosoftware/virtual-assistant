const express = require('express');

const message = require('./routes/message');
const picture = require('./routes/picture');
const tutorial = require('./routes/tutorial');

module.exports = () => {
  const app = express.Router();
  message(app);
  picture(app);
  tutorial(app);

  return app;
};
