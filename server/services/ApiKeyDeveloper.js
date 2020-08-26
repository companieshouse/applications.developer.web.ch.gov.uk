const axios = require('axios');
const logger = require(`${serverRoot}/config/winston`);
const UrlService = require(`${serverRoot}/services/UrlService`);
const urlService = new UrlService();

class ApiKeyDeveloper {
  constructor () {
    this.server = {};
    this.request = axios;
  }

  _getBaseOptions () {
    return {
      headers: {
        content_type: 'application/json'
      },
      responseType: 'json'
    };
  }

  getKeysForApplication (appId, environment) {
    const options = Object.assign(this._getBaseOptions(), {
      method: 'GET',
      url: `${urlService.getUrlForEnv(environment)}/applications/${appId}/api-clients?items_per_page=20&start_index=0`
    });
    logger.info(`Service request to retrieve ${environment} api key list for applicatio ${appId}, with payload: `, options);
    return this.request(options);
  }
}

module.exports = ApiKeyDeveloper;
