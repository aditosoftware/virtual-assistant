const express = require('express');

const config = require('../../config');
const aditoService = require('../../services/adito');
const encodeHelper = require('../../helpers/encodeHelper');

const router = express.Router();

module.exports = (app) => {
  app.use('/', router);

  router.get('/picture', async (req, res) => {
    const aditoUserId = req.query.id;

    // receives the user profile picture from adito in base64
    let aditoUserImage = JSON.parse(await aditoService.getUserImage(aditoUserId));

    // TODO: replace adito-logo.png with the commonly used user name abbreviation (Tim Admin -> TA)
    // use default user image if none was found or received
    if (!aditoUserImage) {
      aditoUserImage = encodeHelper.base64_encode(
        `${config.NODE_SERVER_FS_ASSETS_PATH}/images/adito-logo.png`
      );
    }

    const response = { image: aditoUserImage };

    // returns the blob of the adito profile picture
    return res.status(200).json(response);
  });
};
