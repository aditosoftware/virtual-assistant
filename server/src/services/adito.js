const got = require('got');

const config = require('../config');

// * ADITO user name and password - used for http basic auth
// ! hardcoded default admin credentials - will get replaced by token auth
// ? does token auth also need webservice role for ADITO users?
// TODO: refactor to token auth
const aditoUserName = 'Admin';
const aditoPassword = '';

// sends the dialogflowResponse to the adito webservice and returns the adito response
async function send(dialogflowResponse) {
  let aditoResponse;

  await (async () => {
    const { body } = await got.post(
      config.aditoServerIp + config.aditoRestServicePath + config.aditoVirtualAssistantPath,
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

  return aditoResponse;
}

// gets the profile image linked to the adito user id
async function getUserImage(aditoUserId) {
  let aditoUserImage;

  await (async () => {
    try {
      const response = await got(
        config.aditoServerIp + config.aditoRestServicePath + config.aditoUserPicturePath,
        {
          searchParams: { id: aditoUserId },
          https: {
            rejectUnauthorized: false,
          },
        }
      );
      aditoUserImage = response.body;
    } catch (error) {
      console.log(error);
    }
  })();

  return aditoUserImage;
}

module.exports = {
  send,
  getUserImage,
};
