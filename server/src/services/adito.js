const got = require('got');

const config = require('../config');
const Logger = require('../loaders/logger').LoggerInstance;

// * ADITO user name and password - used for http basic auth
// ! hardcoded default admin credentials - will get replaced by token auth
// ? does token auth also need webservice role for ADITO users?
// TODO: refactor to token auth
const aditoUserName = 'Admin';
const aditoPassword = 'GB3gJYDfrOz6HVDAjWFe';

// sends the dialogflowResponse to the adito webservice and returns the adito response
async function send(aditoUserId, dialogflowResponse) {
  let aditoResponse = null;

  // add id of the calling adito user to the dialogflow response
  dialogflowResponse.aditoUserId = aditoUserId;

  try {
    await (async () => {
      const { body } = await got.post(
        config.ADITO_SERVER_HOST +
          config.ADITO_SERVER_REST_SERVICE_PATH +
          config.ADITO_SERVER_VA_REST,
        {
          username: aditoUserName,
          password: aditoPassword,
          json: dialogflowResponse,
          responseType: 'json',
          https: {
            rejectUnauthorized: false,
          },
        }
      );
      aditoResponse = body;
    })();
    Logger.debug(
      'ADITO Service: POST ' +
        config.ADITO_SERVER_HOST +
        config.ADITO_SERVER_REST_SERVICE_PATH +
        config.ADITO_SERVER_VA_REST
    );
    Logger.debug('ADITO Service: Response received');
    return aditoResponse;
  } catch (err) {
    Logger.error(err);
    // TODO: this is ugly - should refactor to own response object or a wrapper for dialogflow/adito response
    // ! have to change asap if token auth gets implemented
    // ? 401 should not occur with token auth
    let errResponse = {
      queryResult: {
        queryText: dialogflowResponse.queryResult.queryText,
        fulfillmentText:
          'Es ist ein Fehler aufgetreten - Fehlercode: ' +
          err.response.statusCode +
          ' - bitte kontaktieren Sie einen Administrator',
        aditoUserId: dialogflowResponse.aditoUserId,
      },
    };
    switch (err.response.statusCode) {
      case 401:
        // username/password not correct
        errResponse.queryResult.fulfillmentText =
          'Bitte überprüfe deinen Anmeldedaten - Benutzername oder Passwort sind falsch';
        break;
      case 403:
        // user does not have adito webservice role
        errResponse.queryResult.fulfillmentText = err.response.body;
        break;
      default:
    }
    return errResponse;
  }
}

// gets the profile image linked to the adito user id
async function getUserImage(aditoUserId) {
  let aditoUserImage;

  try {
    await (async () => {
      try {
        const response = await got(
          config.ADITO_SERVER_HOST +
            config.ADITO_SERVER_REST_SERVICE_PATH +
            config.ADITO_SERVER_PICTURE_REST,
          {
            searchParams: { id: aditoUserId },
            https: {
              rejectUnauthorized: false,
            },
          }
        );
        aditoUserImage = response.body;
        Logger.debug(
          'ADITO Service: GET ' +
            config.ADITO_SERVER_HOST +
            config.ADITO_SERVER_REST_SERVICE_PATH +
            config.ADITO_SERVER_PICTURE_REST
        );
      } catch (error) {
        console.log(error);
      }
    })();
  } catch (err) {
    Logger.error(err);
    return;
  }

  return aditoUserImage;
}

module.exports = {
  send,
  getUserImage,
};
