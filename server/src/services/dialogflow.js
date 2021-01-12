const dialogflow = require('@google-cloud/dialogflow');
const fs = require('fs');

const config = require('../config');
const Response = require('../models/response');
const Logger = require('../loaders/logger').LoggerInstance;

function createSession(aditoUserId) {
  // remove '_____USER_' of aditoUserId to get unique 36 byte id
  const sessionId = aditoUserId.replace('_____USER_', '');
  const sessionClient = new dialogflow.SessionsClient();
  const sessionPath = sessionClient.projectAgentSessionPath(config.DIALOGFLOW_PROJECTID, sessionId);
  Logger.debug(`Dialogflow Session created`);

  return { sessionClient, sessionPath };
}

async function createRequest(sessionPath, message) {
  let dialogflowRequest = null;

  if (message.isAudioMessage) {
    const path = config.NODE_SERVER_FS_AUDIO_PATH + '/audio-' + message.aditoUserId + '.wav';
    const base64InputAudio = fs.readFileSync(path).toString('base64'); // read audio file into inputAudio
    // remove audio file from file system after it got read
    fs.unlink(path, (err) => {
      if (err) {
        Logger.error(err);
        return;
      }
    });

    dialogflowRequest = {
      session: sessionPath,
      queryInput: {
        audioConfig: {
          audioEncoding: config.DIALOGFLOW_AUDIO_ENCODING,
          languageCode: config.DIALOGFLOW_LANGUAGE_CODE,
        },
      },
      // user audio input
      inputAudio: base64InputAudio,
    };
  } else {
    dialogflowRequest = {
      session: sessionPath,
      queryInput: {
        text: {
          // user text input
          text: message.messageText,
          languageCode: config.DIALOGFLOW_LANGUAGE_CODE,
        },
      },
    };
  }

  Logger.debug(`Dialogflow Request created`);
  return dialogflowRequest;
}

function createEventRequest(sessionPath, event) {
  let dialogflowRequest = null;

  switch (event) {
    case 'ADITO_TUTORIAL':
      dialogflowRequest = {
        session: sessionPath,
        queryInput: {
          event: {
            name: event,
            languageCode: config.DIALOGFLOW_LANGUAGE_CODE,
          },
        },
      };
      break;
    default:
      Logger.error('This custom event is not implemented');
  }

  Logger.debug('Dialogflow Request created');
  return dialogflowRequest;
}

async function sendRequest(sessionClient, request) {
  // * sessionClient.detectItent(req) should return DetectIntentResponse (https://cloud.google.com/dialogflow/docs/reference/rest/v2/DetectIntentResponse)
  // * but it returns an array in this form: [ object(DetectIntentResponse), null, null]
  // * adito webservice expects JSON format so this does not work with array at the beginning
  // * can't find anything useful what the array and the last two values are used for, therefor remove them and work with the DetectIntentResponse
  let dialogflowResponse = new Response();

  try {
    Logger.debug('Dialogflow Request sending');
    const dialogflowResponseArr = await sessionClient.detectIntent(await request);
    Logger.debug(`Dialogflow Response received`);
    dialogflowResponse.initModel(dialogflowResponseArr[0]);
    return dialogflowResponse;
  } catch (err) {
    Logger.error(err);
    return;
  }
}

function getDialogflowResponse(message) {
  const { sessionClient, sessionPath } = createSession(message.aditoUserId);
  const request = createRequest(sessionPath, message);
  return sendRequest(sessionClient, request);
}

function triggerDialogflowEvent(aditoUserId, event) {
  const { sessionClient, sessionPath } = createSession(aditoUserId);
  const request = createEventRequest(sessionPath, event);
  return sendRequest(sessionClient, request);
}

module.exports = {
  getDialogflowResponse,
  triggerDialogflowEvent,
};
