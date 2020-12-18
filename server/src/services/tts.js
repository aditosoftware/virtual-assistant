const config = require('../config');
const textToSpeech = require('@google-cloud/text-to-speech');

// create client for GCP text to speech API
const textToSpeechClient = new textToSpeech.TextToSpeechClient();

async function exec(text) {
  const textToSpeechReq = {
    input: { text: text },
    voice: { languageCode: config.DIALOGFLOW_LANGUAGE_CODE, ssmlGender: 'NEUTRAL' },
    audioConfig: { audioEncoding: 'LINEAR16' },
  };
  return await textToSpeechClient.synthesizeSpeech(textToSpeechReq);
}

module.exports = {
  exec,
};
