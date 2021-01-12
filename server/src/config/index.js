// * config file for the virtual assistant
// * env vars (process.env.) from Dockerfile and can be modified at start
// * e.g. Dialogflow Project ID, ADITO Server Host, ...
// * this following constants should only be changed if you know what you are doing

const ADITO_SERVER_HOST = process.env.ADITO_SERVER_HOST || 'https://localhost:8443/'; // host name of adito server
const ADITO_SERVER_REST_SERVICE_PATH = 'services/rest/'; // default path leading to adito rest webservices
const ADITO_SERVER_VA_REST = 'virtualAssistant_rest'; // path to rest webservice to communicate dialogflows detected intent to adito
const ADITO_SERVER_PICTURE_REST = 'virtualAssistantUserPicture_rest'; // path to rest webservice to get profile picture of an adito user
const DIALOGFLOW_PROJECTID = process.env.DIALOGFLOW_PROJECTID || 'adito-virtual-assistant-dmvu'; // id of the dialogflow project/agent
const DIALOGFLOW_LANGUAGE_CODE = process.env.DIALOGFLOW_LANGUAGECODE || 'de'; // language code used in messages - check https://cloud.google.com/dialogflow/es/docs/reference/language for format and supported languages
const DIALOGFLOW_AUDIO_ENCODING = 'AUDIO_ENCODING_LINEAR_16'; // audio encoding used for audio messages
const NODE_ENV = process.env.NODE_ENV || 'dev'; // defines the env in which the server is running - 'prod' or 'dev'
const NODE_SERVER_PORT = process.env.NODE_SERVER_PORT || 5000; // port of the node server
const NODE_SERVER_API_PATH = '/api'; // path to api routes of node server
const NODE_SERVER_FS_ASSETS_PATH = './assets'; // assets path on filesystem of the node server
const NODE_SERVER_FS_AUDIO_PATH = './audio'; // audio path on filesystem of the node server

// TODO: refactor config (https://github.com/santiq/bulletproof-nodejs/blob/master/src/config/index.ts)
module.exports = {
  logs: {
    level: process.env.LOG_LEVEL || 'silly',
  },
  ADITO_SERVER_HOST,
  ADITO_SERVER_REST_SERVICE_PATH,
  ADITO_SERVER_VA_REST,
  ADITO_SERVER_PICTURE_REST,
  DIALOGFLOW_PROJECTID,
  DIALOGFLOW_LANGUAGE_CODE,
  DIALOGFLOW_AUDIO_ENCODING,
  NODE_ENV,
  NODE_SERVER_PORT,
  NODE_SERVER_API_PATH,
  NODE_SERVER_FS_AUDIO_PATH,
  NODE_SERVER_FS_ASSETS_PATH,
};
