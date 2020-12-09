const express = require('express');
const path = require('path');
////const ngrok = require('ngrok');

const config = require('./config/index.js');

async function startServer() {
  const app = express();
  app.use(express.static(path.join(__dirname, '../build')));

  const loader = require('./loaders/index');
  await loader(app);

  app.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname, '../build/index.html'));
  });

  app.listen(config.port, (err) => {
    if (err) {
      console.log(err);
      process.exit(1);
    }

    console.log(`Server is listening on port ${config.port}`);

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
