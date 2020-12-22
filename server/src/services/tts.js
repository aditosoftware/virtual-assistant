const config = require('../config');
const textToSpeech = require('@google-cloud/text-to-speech');
const Logger = require('../loaders/logger').LoggerInstance;

// create client for GCP text to speech API
const textToSpeechClient = new textToSpeech.TextToSpeechClient();

async function exec(text) {
  Logger.debug('TTS is called with Text: ' + text);

  const textToSpeechReq = {
    input: { text: text },
    voice: { languageCode: config.DIALOGFLOW_LANGUAGE_CODE, ssmlGender: 'NEUTRAL' },
    audioConfig: { audioEncoding: 'LINEAR16' },
  };

  try {
    return await textToSpeechClient.synthesizeSpeech(textToSpeechReq);
  } catch (err) {
    Logger.error(err);
    return;
  }
}

module.exports = {
  exec,
};
