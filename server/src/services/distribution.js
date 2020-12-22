const aditoService = require('../services/adito');
const dialogflowService = require('../services/dialogflow');
const Logger = require('../loaders/logger').LoggerInstance;

async function distribute(message) {
  Logger.debug(`Distribution Service called`);

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
    response = await aditoService.send(message.aditoUserId, dialogflowResponse);
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
};
