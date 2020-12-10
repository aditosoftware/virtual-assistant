const moment = require('moment');
const fs = require('fs');
const textToSpeech = require('@google-cloud/text-to-speech');

const aditoService = require('../services/adito');
const dialogflowService = require('../services/dialogflow');
const config = require('../config');
const Message = require('../models/message');

// get adito logo from assets and encode it in base64
const botPic = base64_encode(`${config.NODE_SERVER_FS_ASSETS_PATH}/images/adito-logo.png`);

// create client for GCP text to speech API
const textToSpeechClient = new textToSpeech.TextToSpeechClient();

// function to encode file data to base64 encoded string
function base64_encode(file) {
  // read binary data
  try {
    var bitmap = fs.readFileSync(file);
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.log('File not found!');
      return null;
    } else {
      throw err;
    }
  }
  // convert binary data to base64 encoded string
  return Buffer.from(bitmap).toString('base64');
}

// converts response into chat message format
async function responseToChatMessage(response) {
  // ! TTS should not be in this function
  // TODO: move TTS part somewhere else
  // ? maybe create response model
  const textToSpeechReq = {
    input: { text: response.queryResult.fulfillmentText },
    voice: { languageCode: config.DIALOGFLOW_LANGUAGE_CODE, ssmlGender: 'NEUTRAL' },
    audioConfig: { audioEncoding: 'LINEAR16' },
  };
  const [textToSpeechRes] = await textToSpeechClient.synthesizeSpeech(textToSpeechReq);

  let data = {
    imageUrl: `data:image/png;base64,${botPic}`,
    imageAlt: 'bot',
    messageText: response.queryResult.fulfillmentText,
    messageAudio: textToSpeechRes.audioContent,
    isMyMessage: false,
    queryText: response.queryResult.queryText,
    createdAt: moment().format('HH:mm'),
  };

  let chatMessage = new Message();
  chatMessage.initModel(data);

  return chatMessage;
}

async function distribute(message) {
  let response;

  // messages have to be sent to dialogflow to detect an intent
  // depending on the intent received: send dialogflowResponse back to chat app or to adito webservice
  const dialogflowResponse = await dialogflowService.getDialogflowResponse(message);

  // * send intent to adito webservice if intent is 'adito_'-intent and all required params are present
  if (
    dialogflowResponse.queryResult.intent &&
    dialogflowResponse.queryResult.intent.displayName.startsWith('adito_') &&
    dialogflowResponse.queryResult.allRequiredParamsPresent
  ) {
    response = await aditoService.send(dialogflowResponse);
  } else {
    if (!dialogflowResponse.queryResult.intent && !dialogflowResponse.queryResult.fulfillmentText) {
      dialogflowResponse.queryResult.fulfillmentText =
        'Das konnte ich leider nicht verstehen. Probier es bitte erneut';
    }
    // send dialogflow response back to chat app
    response = dialogflowResponse;
  }

  return response;
}

module.exports = {
  distribute,
  responseToChatMessage,
};
