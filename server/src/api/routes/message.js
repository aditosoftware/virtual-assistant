const express = require('express');
const multer = require('multer');

const config = require('../../config');
const distributionService = require('../../services/distribution');
const Message = require('../../models/message');
const Response = require('../../models/response');
const messageHelper = require('../../helpers/messageHelper');
const Logger = require('../../loaders/logger').LoggerInstance;

const router = express.Router();

module.exports = (app) => {
  app.use('/', router);

  router.get('/message', async (req, res) => {
    Logger.debug('GET /message');
    res.send(new Message());
  });

  // defines storage location and name of file
  let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, config.NODE_SERVER_FS_AUDIO_PATH);
    },
    filename: function (req, file, cb) {
      let aditoUserId = JSON.parse(req.body.message).aditoUserId;
      cb(null, file.fieldname + '-' + aditoUserId + '.wav');
    },
  });

  let upload = multer({
    storage: storage,
    onError: (err) => {
      Logger.error('audio file upload failed: ' + err);
    },
  });

  // '/message' is the route - 'audio' is the key of the FormData received from Chat.jsx
  router.post('/message', upload.single('audio'), async (req, res) => {
    Logger.debug(`POST /message`);

    let message = new Message();
    message.initModel(JSON.parse(req.body.message));
    message.messageAudio = req.file;

    if (message.isValid()) {
      try {
        let response = new Response();
        response.initModel(await distributionService.distribute(message));
        // returns the response in chat format
        return res.status(200).json(await messageHelper.toMessage(response));
      } catch (e) {
        Logger.error(e);
        return res
          .status(500)
          .send({ message: 'Server error while distributing message to corresponding Services' });
      }
    } else {
      return res
        .status(400)
        .send({ message: 'Message received at endpoint /message is not valid' });
    }
  });
};
