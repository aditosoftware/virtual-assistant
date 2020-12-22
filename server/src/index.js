const express = require('express');

const config = require('./config');
const loader = require('./loaders/index');
const Logger = require('./loaders/logger').LoggerInstance;

async function startServer() {
  const app = express();

  // splitting startup process into modules
  await loader(app);

  app.listen(config.NODE_SERVER_PORT, (err) => {
    if (err) {
      Logger.error(err);
      process.exit(1);
    }

    Logger.info(`Server is listening on port ${config.NODE_SERVER_PORT}`);
  });
}

startServer();
