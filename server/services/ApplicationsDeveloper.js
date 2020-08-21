const axios = require('axios');
const logger = require(`${serverRoot}/config/winston`);

class ApplicationsDeveloper {
  constructor () {
    this.server = {
      apiKey: process.env.APPLICATIONS_DEVELOPER_SERVICE_API_KEY,
      baseUrl: {
        live: process.env.APPLICATIONS_DEVELOPER_SERVICE_LIVE_BASE_URL,
        test: process.env.APPLICATIONS_DEVELOPER_SERVICE_TEST_BASE_URL,
        future: process.env.APPLICATIONS_DEVELOPER_SERVICE_FUTURE_BASE_URL
      },
      auth: {
        username: process.env.APPLICATIONS_DEVELOPER_SERVICE_USERNAME,
        password: process.env.APPLICATIONS_DEVELOPER_SERVICE_PASSWORD
      }
    };
    this.request = axios;
  }

  _getBaseOptions () {
    return {
      headers: {
        // authorization: this.server.apiKey
        content_type: 'application/json'
      },
      responseType: 'json'
    };
  }

  _getBaseUrl (data) {
    let baseUrl = '';
    if(typeof data.environment !== 'undefined') {
      if(data.environment === 'test') {
        if(typeof data.inDevelopment !== 'undefined' && data.inDevelopment === 'yes') {
          baseUrl = this.server.baseUrl.future;
        } else {
          baseUrl = this.server.baseUrl.test;
        }
      } else if(data.environment === 'live') {
        baseUrl = this.server.baseUrl.live;
      }
    }
    return baseUrl;
  }

  // Remeber to remove the temporary query string once API is refcatored not to require it when doing a "fetch all"
  getList (environment) {
    const options = Object.assign(this._getBaseOptions(), {
      method: 'GET',
      url: `${this.server.baseUrl[environment]}/applications/?items_per_page=20&start_index=0`
    });
    logger.info(`Service request to retrieve ${environment} applications list, with payload: `, options);
    return this.request(options);
  }

  save (data) {
    const baseUrl = this._getBaseUrl(data);
    const options = Object.assign(this._getBaseOptions(), {
      method: 'POST',
      data: {
        name: data.applicationName,
        description: data.description,
        privacy_policy_url: data.privacyPolicy,
        terms_and_conditions_url: data.terms
      },
      url: `${baseUrl}/applications`
    });
    logger.info('Service request to save data, with payload: ', options);
    return this.request(options);
  }
}
module.exports = ApplicationsDeveloper;
