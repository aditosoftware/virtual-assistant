const express = require('express');

const message = require('./routes/message');
const picture = require('./routes/picture');

module.exports = () => {
  const app = express.Router();
  message(app);
  picture(app);

  return app;
};
