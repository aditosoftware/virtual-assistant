const dialogflow = require('@google-cloud/dialogflow');
const fs = require('fs');

const config = require('../config');
const Logger = require('../loaders/logger').LoggerInstance;

function createSession(aditoUserId) {
  // remove '_____USER_' of aditoUserId to get unique 36 byte id
  const sessionId = aditoUserId.replace('_____USER_', '');
  const sessionClient = new dialogflow.SessionsClient();
  const sessionPath = sessionClient.projectAgentSessionPath(config.DIALOGFLOW_PROJECTID, sessionId);

  return { sessionClient, sessionPath };
}

async function createRequest(sessionPath, message) {
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

    return {
      session: sessionPath,
      queryInput: {
        audioConfig: {
          audioEncoding: config.DIALOGFLOW_AUDIO_ENCODING,
          sampleRateHertz: config.DIALOGFLOW_SAMPLE_RATE_HERTZ,
          languageCode: config.DIALOGFLOW_LANGUAGE_CODE,
        },
      },
      // user audio input
      inputAudio: base64InputAudio,
    };
  } else {
    return {
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
}

async function sendRequest(sessionClient, request) {
  // * sessionClient.detectItent(req) should return DetectIntentResponse (https://cloud.google.com/dialogflow/docs/reference/rest/v2/DetectIntentResponse)
  // * but it returns an array in this form: [ object(DetectIntentResponse), null, null]
  // * adito webservice expects JSON format so this does not work with array at the beginning
  // * can't find anything useful what the array and the last two values are used for, therefor remove them and work with the DetectIntentResponse
  try {
    const dialogflowResponseArr = await sessionClient.detectIntent(await request);
    const dialogflowResponse = dialogflowResponseArr[0];
    Logger.debug(`Dialogflow Response received`);
    return dialogflowResponse;
  } catch (err) {
    Logger.error(err);
    return;
  }
}

function getDialogflowResponse(message) {
  const { sessionClient, sessionPath } = createSession(message.aditoUserId);
  Logger.debug(`Dialogflow Session created`);

  const request = createRequest(sessionPath, message);
  Logger.debug(`Dialogflow Request created`);

  return sendRequest(sessionClient, request);
}

module.exports = {
  getDialogflowResponse,
};
