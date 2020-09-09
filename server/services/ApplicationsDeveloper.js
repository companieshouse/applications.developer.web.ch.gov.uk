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

  _getBaseUrlForPostFormData (data) {
    let baseUrl = '';
    if (typeof data.environment !== 'undefined') {
      if (data.environment === 'test') {
        if (typeof data.inDevelopment !== 'undefined' && data.inDevelopment === 'yes') {
          baseUrl = this.server.baseUrl.future;
        } else {
          baseUrl = this.server.baseUrl.test;
        }
      } else if (data.environment === 'live') {
        baseUrl = this.server.baseUrl.live;
      }
    }
    return baseUrl;
  }

  // Remeber to remove the temporary query string once API is refcatored not to require it when doing a "fetch all"
  getApplicationList (environment) {
    const options = Object.assign(this._getBaseOptions(), {
      method: 'GET',
      url: `${this.server.baseUrl[environment]}/applications/?items_per_page=20&start_index=0`
    });
    logger.info(`Service request to retrieve ${environment} applications list, with payload: `, options);
    return this.request(options);
  }

  getApplication (id, environment) {
    logger.info('trying to retrieve application with id: ', id, ' with enviroment: ', environment);
    const options = Object.assign(this._getBaseOptions(), {
      method: 'GET',
      url: `${this.server.baseUrl[environment]}/applications/${id}`
    });
    return this.request(options);
  }

  saveApplication (data) {
    const baseUrl = this._getBaseUrlForPostFormData(data);
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

  addNewRestKey (data, appId, env) {
    let restrictedIps = [];
    let javaScriptDomains = [];
    restrictedIps = data.restrictedIps.split(", ");
    javaScriptDomains = data.javaScriptDomains.split(", ");
    const options = Object.assign(this._getBaseOptions(), {
      method: 'POST',
      data: {
        name: data.keyName,
        description: data.keyDescription,
        restricted_ips: restrictedIps,
        js_domains: javaScriptDomains
      },
      url: `${this.server.baseUrl[env]}/applications/${appId}/api-clients/key`
    });
    logger.info('Service request to save key data, with payload: ', options);
    return this.request(options);
  }

  addNewWebKey(data, appId, env){
    let restrictedURIs = [];
    restrictedURIs = data.restrictedURIs.split(", ");
    const options = Object.assign(this._getBaseOptions(), {
      method: 'POST',
      data: {
        name: data.keyName,
        description: data.keyDescription,
        restricted_uris: restrictedURIs
      },
      url: `${this.server.baseUrl[env]}/applications/${appId}/api-clients/web`
    });
    logger.info('Service request to save key data, with payload: ', options);
    return this.request(options);
  }

  addNewStreamKey(data, appId, env){
    let restrictedIps = [];
    restrictedIps = data.restrictedIps.split(", ");
    const options = Object.assign(this._getBaseOptions(), {
      method: 'POST',
      data: {
        name: data.keyName,
        description: data.keyDescription,
        restricted_ips: restrictedIps
      },
      url: `${this.server.baseUrl[env]}/applications/${appId}/api-clients/stream`
    });
    logger.info('Service request to save key data, with payload: ', options);
    return this.request(options);
  }


  updateApplication (data) {
    const baseUrl = this.server.baseUrl[data.env];
    const options = Object.assign(this._getBaseOptions(), {
      method: 'PUT',
      data: {
        name: data.applicationName,
        description: data.description,
        terms_and_conditions_url: data.terms,
        privacy_policy_url: data.privacyPolicy
      },
      url: `${baseUrl}/applications/${data.appId}`
    });
    logger.info('Service request to update data, with payload: ', options);
    return this.request(options);
  }


  getKeysForApplication (appId, environment) {
      const options = Object.assign(this._getBaseOptions(), {
        method: 'GET',
        url: `${this.server.baseUrl[environment]}/applications/${appId}/api-clients?items_per_page=20&start_index=0`
      });
    logger.info(`Service request to retrieve ${environment} api key list for application ${appId}, with payload: `, options);
    return this.request(options);
  }

  getSpecificKey (appId, keyId, keyType, environment) {
    const options = Object.assign(this._getBaseOptions(), {
      method: 'GET',
      url: `${this.server.baseUrl[environment]}/applications/${appId}/api-clients/${keyType}/${keyId}`
    });
    logger.info(`Service request to retrieve ${environment} ${keyType} api key ${keyId} for application ${appId}, with payload: `, options);
    return this.request(options);
  }

  deleteApiKey (appId, keyId, keyType, environment) {
    const options = Object.assign(this._getBaseOptions(), {
      method: 'DELETE',
      url: `${this.server.baseUrl[environment]}/applications/${appId}/api-clients/${keyType}/${keyId}`
    });
    logger.info(`Service request to delete ${environment} ${keyType} api key ${keyId} for application ${appId}, with payload: `, options);
    return this.request(options);
  }
}
module.exports = ApplicationsDeveloper;
