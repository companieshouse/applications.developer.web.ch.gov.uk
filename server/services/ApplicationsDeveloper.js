const logger = require(`${serverRoot}/config/winston`);
const APIClientHelper = require(`${serverRoot}/lib/APIClientHelper`);

class ApplicationsDeveloper {
  constructor () {
    this.server = {
      apiKey: process.env.APPLICATIONS_DEVELOPER_SERVICE_API_KEY,
      baseUrl: {
        live: process.env.ACCOUNT_LOCAL_URL,
        test: process.env.APPLICATIONS_DEVELOPER_SERVICE_TEST_BASE_URL,
        future: process.env.APPLICATIONS_DEVELOPER_SERVICE_FUTURE_BASE_URL
      },
      auth: {
        username: process.env.APPLICATIONS_DEVELOPER_SERVICE_USERNAME,
        password: process.env.APPLICATIONS_DEVELOPER_SERVICE_PASSWORD
      }
    };
  }

  _getBaseUrlForPostFormData (data) {
    let baseUrl = '';
    if (typeof data.environment !== 'undefined') {
      if (data.environment === 'test') {
        if (typeof data.inDevelopment !== 'undefined' && data.inDevelopment ===
          'yes') {
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
    logger.info(
      `trying to retrieve application list from environment=[${environment}] using serverUrl=[${serverUrl}]`);
    const client = APIClientHelper.getPrivateAPIClient(oauthToken, serverUrl);

    // MVP pagination
    const itemsPerPage = 20; // api currently limits to 20, this should be increased for MVP without pagination options in the UI
    const startIndex = 0;
    const applicationList = await client.applicationsService.getApplications(
      itemsPerPage, startIndex);

    logger.debug(`applicationList=[${JSON.stringify(applicationList)}]`);
    return applicationList.resource;
  }

  async getApplication (id, oauthToken, environment) {
    const serverUrl = this.server.baseUrl[environment];
    logger.info(
      `trying to retrieve application with id=[${id}] from environment=[${environment}] using serverUrl=[${serverUrl}]`);
    const client = APIClientHelper.getPrivateAPIClient(oauthToken, serverUrl);

    const application = await client.applicationsService.getApplication(id);

    logger.debug(`application=[${JSON.stringify(application)}]`);
    return application.resource;
  }

  async saveApplication (data, oauthToken) {
    const serverUrl = this._getBaseUrlForPostFormData(data);
    logger.info(
      `creating application in environment=[${data.environment}] inDevelopment=[${data.inDevelopment}], using serverUrl=[${serverUrl}]`);
    const client = APIClientHelper.getPrivateAPIClient(oauthToken, serverUrl);

    const applicationPostRequest = {
      name: data.applicationName,
      description: data.description,
      privacyPolicyUrl: data.privacyPolicy,
      termsAndConditionsUrl: data.terms
    };

    logger.info(`Service request to save data, with payload=[${JSON.stringify(
      applicationPostRequest)}]`);
    const application = await client.applicationsService.postApplication(
      applicationPostRequest);

    logger.debug(`application=[${JSON.stringify(application)}]`);
    return application.resource;
  }

  async addNewKey (data, appId, oauthToken, environment) {
    if (data.keyType === 'rest') {
      return this.addNewRestKey(data, appId, oauthToken, environment);
    } else if (data.keyType === 'web') {
      return this.addNewWebClient(data, appId, oauthToken, environment);
    } else if (data.keyType === 'stream') {
      return this.addNewStreamKey(data, appId, oauthToken, environment);
    }
    return Promise.reject(new Error('Could not match Key Type'));
  }

  async addNewRestKey (data, appId, oauthToken, environment) {
    const serverUrl = this.server.baseUrl[environment];
    logger.info(
      `creating api key for application=[${appId}] in environment=[${environment}], using serverUrl=[${serverUrl}]`);
    const client = APIClientHelper.getPrivateAPIClient(oauthToken, serverUrl);
    let restrictedIps = [];
    let javaScriptDomains = [];
    restrictedIps = data.restrictedIps.split(',');
    javaScriptDomains = data.javaScriptDomains.split(',');
    const apiKeyPostRequest = {
      name: data.keyName,
      description: data.keyDescription,
      restrictedIPs: restrictedIps,
      jsDomains: javaScriptDomains
    };

    logger.info(
      `Service request to save key data against application=[${appId}], with payload=[${JSON.stringify(
        apiKeyPostRequest)}]`);
    const apiKey = await client.apiKeysService.postAPIKey(apiKeyPostRequest,
      appId);

    logger.debug(`apiKey=[${JSON.stringify(apiKey)}]`);
    return apiKey.resource;
  }

  async addNewWebClient (data, appId, oauthToken, environment) {
    const serverUrl = this.server.baseUrl[environment];
    logger.info(
      `creating web client for application=[${appId}] in environment=[${environment}], using serverUrl=[${serverUrl}]`);
    const client = APIClientHelper.getPrivateAPIClient(oauthToken, serverUrl);

    let redirectURIs = [];
    redirectURIs = data.redirectURIs.split(',');
    const webClientPostRequest = {
      name: data.keyName,
      description: data.keyDescription,
      redirectURIs: redirectURIs
    };

    logger.info(
      `Service request to save web client data against application=[${appId}], with payload=[${JSON.stringify(
        webClientPostRequest)}]`);
    const webClient = await client.webClientsService.postWebClient(
      webClientPostRequest, appId);

    logger.debug(`webClient=[${JSON.stringify(webClient)}]`);
    return webClient.resource;
  }

  async addNewStreamKey (data, appId, oauthToken, environment) {
    const serverUrl = this.server.baseUrl[environment];
    logger.info(
      `creating stream key for application=[${appId}] in environment=[${environment}], using serverUrl=[${serverUrl}]`);
    const client = APIClientHelper.getPrivateAPIClient(oauthToken, serverUrl);

    let restrictedIps = [];
    restrictedIps = data.restrictedIps.split(',');
    const streamKeyPostRequest = {
      name: data.keyName,
      description: data.keyDescription,
      restrictedIPs: restrictedIps
    };

    logger.info(
      `Service request to save stream key data against application=[${appId}], with payload=[${JSON.stringify(
        streamKeyPostRequest)}]`);
    const streamKey = await client.streamKeysService.postStreamKey(
      streamKeyPostRequest, appId);

    logger.debug(`streamKey=[${JSON.stringify(streamKey)}]`);
    return streamKey.resource;
  }

  async updateKey (data, appId, keyId, keyType, oauthToken, environment) {
    if (keyType === 'key') {
      return this.updateRestApiKey(data, appId, keyId, oauthToken, environment);
    } else if (keyType === 'web') {
      return this.updateWebKey(data, appId, keyId, oauthToken, environment);
    } else if (keyType === 'stream-key') {
      return this.updateStreamKey(data, appId, keyId, oauthToken, environment);
    } else {
      return Promise.reject(new Error('Could not match Key Type'));
    }
  }

  async updateWebKey (data, appId, keyId, oauthToken, environment) {
    const serverUrl = this.server.baseUrl[environment];
    logger.info(`updating api key=[${keyId}] for application=[${appId}] in environment=[${environment}], using serverUrl=[${serverUrl}]`);
    const client = APIClientHelper.getPrivateAPIClient(oauthToken, serverUrl);

    let redirectURIs = [];
    redirectURIs = data.redirectURIs.split(',');
    const apiKeyPutRequest = {
      name: data.keyName,
      description: data.keyDescription,
      redirectURIs: redirectURIs
    };

    logger.info(`Service request to save key data against application=[${appId}], with payload=[${JSON.stringify(apiKeyPutRequest)}]`);
    const apiKey = await client.webClientsService.putWebClient(apiKeyPutRequest, appId, keyId);

    logger.debug(`apiKey=[${JSON.stringify(apiKey)}]`);
    return apiKey.resource;
  }


  async updateStreamKey (data, appId, keyId, oauthToken, environment) {
    const serverUrl = this.server.baseUrl[environment];
    logger.info(`updating stream key=[${keyId}] for application=[${appId}] in environment=[${environment}], using serverUrl=[${serverUrl}]`);
    const client = APIClientHelper.getPrivateAPIClient(oauthToken, serverUrl);
    let restrictedIps = [];
    restrictedIps = data.restrictedIps.split(',');
    const streamKeyPutRequest = {
      name: data.keyName,
      description: data.keyDescription,
      restrictedIPs: restrictedIps
    };
    logger.info(`Service request to save key data against application=[${appId}], with payload=[${JSON.stringify(streamKeyPutRequest)}]`);

    const streamKey = await client.streamKeysService.putStreamKey(
      streamKeyPutRequest, appId, keyId);
    logger.debug(`streamKey=[${JSON.stringify(streamKey)}]`);
    return streamKey.resource;
  }

  async updateRestApiKey (data, appId, keyId, oauthToken, environment) {
    const serverUrl = this.server.baseUrl[environment];
    logger.info(`updating api key=[${keyId}] for application=[${appId}] in environment=[${environment}], using serverUrl=[${serverUrl}]`);
    const client = APIClientHelper.getPrivateAPIClient(oauthToken, serverUrl);
    let restrictedIps = [];
    let javaScriptDomains = [];
    restrictedIps = data.restrictedIps.split(',');
    javaScriptDomains = data.javaScriptDomains.split(',');
    const apiKeyPutRequest = {
      name: data.keyName,
      description: data.keyDescription,
      restrictedIPs: restrictedIps,
      jsDomains: javaScriptDomains
    };
    logger.info(`Service request to save key data against application=[${appId}], with payload=[${JSON.stringify(apiKeyPutRequest)}]`);
    const apiKey = await client.apiKeysService.putAPIKey(apiKeyPutRequest, appId, keyId);
    logger.debug(`apiKey=[${JSON.stringify(apiKey)}]`);
    return apiKey.resource;
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
    };

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

    const application = await client.applicationsService.deleteApplication(applicationId);

    logger.debug(`application=[${JSON.stringify(application)}]`);
    return application.resource;
  }

  async getAPIClientsForApplication (appId, oauthToken, environment) {
    const serverUrl = this.server.baseUrl[environment];
    logger.info(`trying to retrieve api client list for application=[${appId}] from environment=[${environment}] using serverUrl=[${serverUrl}]`);
    const client = APIClientHelper.getPrivateAPIClient(oauthToken, serverUrl);

    // MVP pagination
    const itemsPerPage = 20; // api currently limits to 20, this should be increased for MVP without pagination options in the UI
    const startIndex = 0;
    const apiClientList = await client.applicationsService.getApplicationAPIClients(appId, itemsPerPage, startIndex);

    logger.debug(`apiClientList=[${JSON.stringify(apiClientList)}]`);
    return apiClientList.resource;
  }

  async getAPIClient (appId, keyId, keyType, oauthToken, environment) {
    const serverUrl = this.server.baseUrl[environment];
    logger.info(`get keyType=[${keyType}], keyId=[${keyId}] for application=[${appId}] in environment=[${environment}], using serverUrl=[${serverUrl}]`);
    const client = APIClientHelper.getPrivateAPIClient(oauthToken, serverUrl);

    var apiClient;
    if (keyType === 'stream-key') {
      apiClient = await client.streamKeysService.getStreamKey(appId, keyId);
    } else if (keyType === 'web') {
      apiClient = await client.webClientsService.getWebClient(appId, keyId);
    } else {
      apiClient = await client.apiKeysService.getAPIKey(appId, keyId);
    }

    logger.debug(`apiClient=[${JSON.stringify(apiClient)}]`);
    return apiClient.resource;
  }

  async deleteAPIClient (appId, keyId, keyType, oauthToken, environment) {
    const serverUrl = this.server.baseUrl[environment];
    logger.info(`deleting keyType=[${keyType}], keyId=[${keyId}] for application=[${appId}] in environment=[${environment}], using serverUrl=[${serverUrl}]`);
    const client = APIClientHelper.getPrivateAPIClient(oauthToken, serverUrl);

    var apiClient;
    if (keyType === 'stream-key') {
      apiClient = await client.streamKeysService.deleteStreamKey(appId, keyId);
    } else if (keyType === 'web') {
      apiClient = await client.webClientsService.deleteWebClient(appId, keyId);
    } else if (keyType == 'key') {
      apiClient = await client.apiKeysService.deleteAPIKey(appId, keyId);
    } else {
      logger.info(`Cannot delete Key of Type: ${keyType}`);
      return Promise.reject(new Error('Could not match Key Type'));
    }

    logger.debug(`apiClient=[${JSON.stringify(apiClient)}]`);
    return apiClient.resource;
  }
}
module.exports = ApplicationsDeveloper;
