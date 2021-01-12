const express = require('express');

const dialogflowService = require('../../services/dialogflow');
const Logger = require('../../loaders/logger').LoggerInstance;
const messageHelper = require('../../helpers/messageHelper');
const Response = require('../../models/response');

const router = express.Router();

module.exports = (app) => {
  app.use('/', router);

  router.post('/tutorial', async (req, res) => {
    Logger.debug('POST /tutorial');
    // trigger dialogflow custom event ADITO_TUTORIAL
    let response = new Response();
    response.initModel(
      await dialogflowService.triggerDialogflowEvent(req.body.aditoUserId, req.body.event)
    );
    return res.status(200).json(await messageHelper.toMessage(response));
  });
};
