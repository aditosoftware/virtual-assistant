const express = require('express');

const aditoService = require('../../services/adito');

const router = express.Router();

module.exports = (app) => {
  app.use('/', router);

  router.get('/picture', async (req, res) => {
    const aditoUserId = req.query.id;

    // receives the user profile picture from adito in base64
    const aditoUserImage = JSON.parse(await aditoService.getUserImage(aditoUserId));

    const response = { image: aditoUserImage };

    // returns the blob of the adito profile picture
    return res.status(200).json(response);
  });
};
