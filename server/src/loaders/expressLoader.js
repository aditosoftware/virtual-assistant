const bodyParser = require('body-parser');
const cors = require('cors');

const config = require('../config');
const api = require('../api/index');

module.exports = (app) => {
  // enable Cross Origin Resource Sharing to all origins by default
  app.use(cors());

  // middleware that transforms the raw string of req.body into json
  // have to resize the limit to send audio file with post
  app.use(bodyParser.json({ limit: '10mb', extended: true }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

  // load API routes
  app.use(config.apiPrefix, api());
};
