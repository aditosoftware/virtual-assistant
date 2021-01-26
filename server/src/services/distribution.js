const aditoService = require('../services/adito');
const dialogflowService = require('../services/dialogflow');
const Response = require('../models/response');
const Logger = require('../loaders/logger').LoggerInstance;

async function distribute(message) {
  Logger.debug(`Distribution Service called`);

  let response = new Response();

  // messages have to be sent to dialogflow to detect an intent
  // depending on the intent received: send dialogflowResponse back to chat app or to adito webservice
  let dialogflowResponse = await dialogflowService.getDialogflowResponse(message);

  // check if response is valid
  // dialogflowResponse is null if Dialogflow could not match an intent to the request
  // if this is the case: trigger default fallback intent by firing custom event
  if (!dialogflowResponse) {
    const aditoFallbackEvent = 'ADITO_FALLBACK';
    response.initModel(
      await dialogflowService.triggerDialogflowEvent(message.aditoUserId, aditoFallbackEvent)
    );
  } else {
    // * send intent to adito webservice if intent is 'adito_'-intent and all required params are present
    if (
      dialogflowResponse.queryResult.intent &&
      dialogflowResponse.queryResult.intent.displayName.startsWith('adito_') &&
      dialogflowResponse.queryResult.allRequiredParamsPresent
    ) {
      response.initModel(
        await aditoService.send(message.aditoUserId, message.usertoken, dialogflowResponse)
      );
    } else {
      if (
        !dialogflowResponse.queryResult.intent &&
        !dialogflowResponse.queryResult.fulfillmentText
      ) {
        dialogflowResponse.queryResult.fulfillmentText =
          'Das konnte ich leider nicht verstehen. Probier es bitte erneut';
      }
      // send dialogflow response back to chat app
      response = dialogflowResponse;
    }
  }
  return response;
}

module.exports = {
  distribute,
};
