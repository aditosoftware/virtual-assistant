const express = require('express');
const multer = require('multer');

const config = require('../../config/index.js');
const distributionService = require('../../services/distribution');
const Message = require('../../models/message');

const router = express.Router();

module.exports = (app) => {
  app.use('/', router);

  router.get('/message', async (req, res) => {
    let message = new Message();
    res.send(message);
  });

  // defines storage location and name of file
  let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, config.audioPath);
    },
    filename: function (req, file, cb) {
      let aditoUserId = JSON.parse(req.body.message).aditoUserId;
      cb(null, file.fieldname + '-' + aditoUserId + '.wav');
    },
  });

  let upload = multer({ storage: storage });

  // '/message' is the route - 'audio' is the key of the FormData received from Chat.jsx
  router.post('/message', upload.single('audio'), async (req, res) => {
    let message = new Message();
    message.initModel(JSON.parse(req.body.message));
    message.messageAudio = req.file;

    const response = await distributionService.distribute(message);

    // returns the response in chat format
    return res.status(200).json(await distributionService.responseToChatMessage(response));
  });
};
