// * wrapper class for dialogflow response object
// * only contains the properties which get used by the virtual assistant
class Response {
  // * create a new empty object
  constructor() {
    this.responseId = null;
    this.languageCode = null;
    this.aditoUserId = null;
    this.queryResult = {
      queryText: null,
      parameters: null,
      allRequiredParamsPresent: null,
      fulfillmentText: null,
      intent: {
        name: null,
        displayName: null,
      },
    };
  }

  // * init object with given data
  initModel(data) {
    this.responseId = data.responseId;
    this.languageCode = data.languageCode;
    if (data.aditoUserId) this.aditoUserId = data.aditoUserId;
    this.queryResult = {
      queryText: data.queryResult.queryText,
      parameters: data.queryResult.parameters,
      allRequiredParamsPresent: data.queryResult.allRequiredParamsPresent,
      fulfillmentText: data.queryResult.fulfillmentText,
      intent: {
        name: data.queryResult.intent.name,
        displayName: data.queryResult.intent.displayName,
      },
    };
  }

  // * fill an already existing object with the given fields
  fill(newFields) {
    for (let field in newFields) {
      if (this.hasOwnProperty(field) && newFields.hasOwnProperty(field)) {
        if (this[field] !== 'undefined') {
          this[field] = newFields[field];
        }
      }
    }
  }
}

module.exports = Response;
