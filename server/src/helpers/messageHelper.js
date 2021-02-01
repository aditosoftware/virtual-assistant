const moment = require('moment');

const config = require('../config');
const Message = require('../models/message');
const encodeHelper = require('../helpers/encodeHelper');
const tts = require('../services/tts');
const Logger = require('../loaders/logger').LoggerInstance;

// get adito logo from assets and encode it in base64
const botPic = encodeHelper.base64_encode(
  `${config.NODE_SERVER_FS_ASSETS_PATH}/images/adito-logo.png`
);

// * converts a dialogflow reponse object into message format
async function toMessage(response) {
  let textToSpeechRes;

  if (!response) {
    return;
  }

  try {
    [textToSpeechRes] = await tts.exec(response.queryResult.fulfillmentText);
    // TODO: add file/line indicator to error logs
    let data = {
      imageUrl: `data:image/png;base64,${botPic}`,
      imageAlt: 'bot',
      messageText: response.queryResult.fulfillmentText,
      messageAudio: textToSpeechRes.audioContent,
      isMyMessage: false,
      queryText: response.queryResult.queryText,
      createdAt: moment().format('HH:mm'),
      isPlaying: false,
      ttsEnabled: false,
    };

    let message = new Message();
    message.initModel(data);

    return message;
  } catch (err) {
    Logger.error(err);
  }
}

module.exports = {
  toMessage,
};
