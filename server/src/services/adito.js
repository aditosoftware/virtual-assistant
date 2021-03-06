const got = require('got');

const Response = require('../models/response');
const config = require('../config');
const Logger = require('../loaders/logger').LoggerInstance;

// sends the dialogflowResponse to the adito webservice and returns the adito response
async function send(aditoUserId, usertoken, dialogflowResponse) {
  let aditoResponse = new Response();

  // add id of the calling adito user to the dialogflow response
  dialogflowResponse.aditoUserId = aditoUserId;

  try {
    await (async () => {
      const url =
        config.ADITO_SERVER_HOST +
        config.ADITO_SERVER_REST_SERVICE_PATH +
        config.ADITO_SERVER_VA_REST;

      const { body } = await got.post(url, {
        headers: {
          authMethod: 'Method_usertoken',
          tokenid: usertoken,
        },
        json: dialogflowResponse,
        responseType: 'json',
        https: {
          rejectUnauthorized: false,
        },
      });
      aditoResponse.initModel(body);
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
    // * server-side (adito) runtime error - e.g. function failed because of missing input handling, function not found, nullpointer exception etc.
    Logger.error(err);
    let errResponse = new Response();
    let data = {
      responseId: null,
      languageCode: config.DIALOGFLOW_LANGUAGE_CODE,
      aditoUserId: dialogflowResponse.aditoUserId,
      queryResult: {
        queryText: dialogflowResponse.queryResult.queryText,
        parameters: null,
        allRequiredParamsPresent: true,
        fulfillmentText:
          'Whoops! Deine Anfrage war korrekt, dennoch ist während der Bearbeitung ein Fehler aufgetreten. Bitte kontaktiere einen Administrator.\nDetails: ' +
          err.response.statusCode +
          ' ' +
          err.response.statusMessage,
        intent: {
          name: null,
          displayName: null,
        },
      },
    };
    errResponse.initModel(data);
    switch (err.response.statusCode) {
      case 401:
        // token auth for webservice not configured
        errResponse.queryResult.fulfillmentText =
          'Anfrage an ADITO-Server aufgrund fehlender oder ungültiger Authentifizierung abgelehnt';
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
      const url =
        config.ADITO_SERVER_HOST +
        config.ADITO_SERVER_REST_SERVICE_PATH +
        config.ADITO_SERVER_PICTURE_REST;

      try {
        const response = await got(url, {
          searchParams: { id: aditoUserId },
          https: {
            rejectUnauthorized: false,
          },
        });
        aditoUserImage = response.body;
        Logger.debug(
          'ADITO Service: GET ' +
            config.ADITO_SERVER_HOST +
            config.ADITO_SERVER_REST_SERVICE_PATH +
            config.ADITO_SERVER_PICTURE_REST
        );
      } catch (err) {
        Logger.error(err);
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
