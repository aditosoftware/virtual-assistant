const express = require('express');

const config = require('../../config');
const aditoService = require('../../services/adito');
const encodeHelper = require('../../helpers/encodeHelper');
const Logger = require('../../loaders/logger').LoggerInstance;

const router = express.Router();

module.exports = (app) => {
  app.use('/', router);

  router.get('/picture', async (req, res) => {
    Logger.debug('GET /picture');
    const aditoUserId = req.query.id;
    let aditoUserImage = null;

    // receives the user profile picture from adito in base64
    try {
      aditoUserImage = JSON.parse(await aditoService.getUserImage(aditoUserId));
    } catch (err) {
      Logger.error(err);
      // * do not return status code 500 here
      // * if connection with adito fails, default image is used
    }

    // TODO: replace adito-logo.png with the commonly used user name abbreviation (Tim Admin -> TA)
    // use default user image if none was found or received
    if (!aditoUserImage) {
      Logger.info('No adito user profile picture was found or received - using default picture');
      aditoUserImage = encodeHelper.base64_encode(
        `${config.NODE_SERVER_FS_ASSETS_PATH}/images/adito-logo.png`
      );
    }

    const response = { image: aditoUserImage };

    // returns the blob of the adito profile picture
    return res.status(200).json(response);
  });
};
