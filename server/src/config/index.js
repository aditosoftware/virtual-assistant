const dotenv = require('dotenv');

const envFound = dotenv.config();

var apiPrefix = '/api';
var audioEncoding = 'AUDIO_ENCODING_LINEAR_16';
var sampleRateHertz = '44100';
var audioPath = './audio';
var assetsPath = './assets';
var aditoRestServicePath = '/services/rest';
var aditoVirtualAssistantPath = '/virtualAssistant_rest';
var aditoUserPicturePath = '/virtualAssistantUserPicture_rest';

if (envFound.error) {
  // * This error should crash the whole process
  throw new Error('Could not finde .env file!');
}

// TODO: map env variables from dockerfile
module.exports = {
  port: process.env.PORT,
  projectId: process.env.PROJECTID,
  langCode: process.env.LANGUAGECODE,
  aditoServerIp: process.env.ADITOSERVERIP,
  apiPrefix,
  audioEncoding,
  sampleRateHertz,
  audioPath,
  assetsPath,
  aditoRestServicePath,
  aditoVirtualAssistantPath,
  aditoUserPicturePath,
};
