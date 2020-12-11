const express = require('express');
////const ngrok = require('ngrok');

const config = require('./config');

async function startServer() {
  const app = express();

  // splitting startup process into modules
  const loader = require('./loaders/index');
  await loader(app);

  app.listen(config.NODE_SERVER_PORT, (err) => {
    if (err) {
      console.log(err);
      process.exit(1);
    }

    console.log(`Server is listening on port ${config.NODE_SERVER_PORT}`);

    // use ngrok to make localhost available to internet
    ////(async function () {
    ////const endpointUrl = await ngrok.connect(config.port);
    ////console.log(
    ////`Publicably accessible tunnel to localhost: ${config.port} is available on ${endpointUrl}`
    ////);
    ////})();
  });
}

startServer();
