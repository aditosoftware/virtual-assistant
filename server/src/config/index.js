const apiPrefix = '/api';
const audioEncoding = 'AUDIO_ENCODING_LINEAR_16';
const sampleRateHertz = '44100';
const audioPath = './audio';
const assetsPath = './assets';
const aditoRestServicePath = '/services/rest';
const aditoVirtualAssistantPath = '/virtualAssistant_rest';
const aditoUserPicturePath = '/virtualAssistantUserPicture_rest';

module.exports = {
  port: process.env.NODE_SERVER_PORT,
  projectId: process.env.DIALOGFLOW_PROJECTID,
  langCode: process.env.DIALOGFLOW_LANGUAGECODE,
  aditoServerIp: process.env.ADITO_SERVER_HOST,
  apiPrefix,
  audioEncoding,
  sampleRateHertz,
  audioPath,
  assetsPath,
  aditoRestServicePath,
  aditoVirtualAssistantPath,
  aditoUserPicturePath,
};
