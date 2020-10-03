const axios = require('axios');
const logger = require(`${serverRoot}/config/winston`);
const APIClientHelper = require(`${serverRoot}/lib/APIClientHelper`);

class ApplicationsDeveloper {
  constructor () {
    this.server = {
      apiKey: process.env.APPLICATIONS_DEVELOPER_SERVICE_API_KEY,
      baseUrl: {
        // live: process.env.APPLICATIONS_DEVELOPER_SERVICE_LIVE_BASE_URL,
        live: process.env.ACCOUNT_LOCAL_URL,
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

  async getApplicationList (oauthToken, environment) {
    const serverUrl = this.server.baseUrl[environment];
    logger.info(`trying to retrieve application list from environment=[${environment}] using serverUrl=[${serverUrl}]`);
    const client = APIClientHelper.getPrivateAPIClient(oauthToken, serverUrl);

    // MVP pagination
    const itemsPerPage = 20; // api currently limits to 20, this should be increased for MVP without pagination options in the UI
    const startIndex = 0;
    const applicationList = await client.applicationsService.getApplications(itemsPerPage, startIndex);

    logger.debug(`applicationList=[${JSON.stringify(applicationList)}]`);
    return applicationList.resource;
  }

  async getApplication(id, oauthToken, environment) {
    const serverUrl = this.server.baseUrl[environment];
    logger.info(`trying to retrieve application with id=[${id}] from environment=[${environment}] using serverUrl=[${serverUrl}]`);
    const client = APIClientHelper.getPrivateAPIClient(oauthToken, serverUrl);

    const application = await client.applicationsService.getApplication(id);

    logger.debug(`application=[${JSON.stringify(application)}]`);
    return application.resource;
  }

  async saveApplication (data, oauthToken) {
    const serverUrl = this._getBaseUrlForPostFormData(data);
    logger.info(`creating application in environment=[${data.environment}] inDevelopment=[${data.inDevelopment}], using serverUrl=[${serverUrl}]`);
    const client = APIClientHelper.getPrivateAPIClient(oauthToken, serverUrl);

    const applicationPostRequest = {
      name: data.applicationName,
      description: data.description,
      privacyPolicyUrl: data.privacyPolicy,
      termsAndConditionsUrl: data.terms
    }

    logger.info(`Service request to save data, with payload=[${JSON.stringify(applicationPostRequest)}]`);
    const application = await client.applicationsService.postApplication(applicationPostRequest);
    
    logger.debug(`application=[${JSON.stringify(application)}]`);
    return application.resource;
  }

  addNewRestKey (data, appId, env) {
    let restrictedIps = [];
    let javaScriptDomains = [];
    restrictedIps = data.restrictedIps.split(",");
    javaScriptDomains = data.javaScriptDomains.split(",");
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
//addNewWebKey will not currently submit data to the db, as the api functionality has not been implemented
  addNewWebKey(data, appId, env){
    let restrictedURIs = [];
    redirectURIs = data.redirectURIs.split(",");
    const options = Object.assign(this._getBaseOptions(), {
      method: 'POST',
      data: {
        name: data.keyName,
        description: data.keyDescription,
        restricted_uris: redirectURIs
      },
      url: `${this.server.baseUrl[env]}/applications/${appId}/api-clients/web`
    });
    logger.info('Service request to save key data, with payload: ', options);
    return this.request(options);
  }
//addNewStreamKey will not currently submit data to the db, as the api functionality has not been implemented
  addNewStreamKey(data, appId, env){
    let restrictedIps = [];
    restrictedIps = data.restrictedIps.split(",");
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

  updateKey (data, appId, keyId, env) {
    let restrictedIps = [];
    let javaScriptDomains = [];
    restrictedIps = data.restrictedIps.split(",");
    javaScriptDomains = data.javaScriptDomains.split(",");
    const options = Object.assign(this._getBaseOptions(), {
      method: 'PUT',
      data: {
        name: data.keyName,
        description: data.keyDescription,
        restricted_ips: restrictedIps,
        js_domains: javaScriptDomains
      },
      url: `${this.server.baseUrl[env]}/applications/${appId}/api-clients/key/${keyId}`
    });
    logger.info('Service request to update key data, with payload: ', options);
    return this.request(options);
  }

  async updateApplication (data, oauthToken) {
    const serverUrl = this.server.baseUrl[data.env];
    logger.info(`updating application in environment=[${data.env}] using serverUrl=[${serverUrl}]`);
    const client = APIClientHelper.getPrivateAPIClient(oauthToken, serverUrl);

    const applicationPutRequest = {
      name: data.applicationName,
      description: data.description,
      privacyPolicyUrl: data.privacyPolicy,
      termsAndConditionsUrl: data.terms
    }

    const applicationId = data.appId;
    logger.info(`Service request to update data for applicationId=[${applicationId}], with payload=[${JSON.stringify(applicationPutRequest)}]`);
    const application = await client.applicationsService.putApplication(applicationPutRequest, applicationId);
    
    logger.debug(`application=[${JSON.stringify(application)}]`);
    return application.resource;
  }

  async deleteApplication (applicationId, oauthToken, environment) {
    const serverUrl = this.server.baseUrl[environment];
    logger.info(`deleting application=[${applicationId}] in environment=[${environment}] using serverUrl=[${serverUrl}]`);
    const client = APIClientHelper.getPrivateAPIClient(oauthToken, serverUrl);

    logger.info(`Service request to delete data for applicationId=[${applicationId}]`);
    const application = await client.applicationsService.deleteApplication(applicationId);
    
    logger.debug(`application=[${JSON.stringify(application)}]`);
    return application.resource;
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
