
/*
 * Central class for accessing SDK library clients
 */
const privateSDK = require("private-ch-sdk-node");

class APIClientHelper {
    /**
     * Create an instace of the SDKs private api client
     *
     * @param {string} oauthToken - the oauth token 
     * @param {string} accountUrl - the url of the account service required for this client
     */
    static getPrivateAPIClient(oauthToken, accountUrl) {
        return privateSDK.createPrivateApiClient(undefined, oauthToken, undefined, accountUrl);
    }
}

module.exports = APIClientHelper;