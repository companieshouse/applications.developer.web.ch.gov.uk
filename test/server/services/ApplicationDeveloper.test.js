const ApplicationDeveloper = require(`${serverRoot}/services/ApplicationsDeveloper`);
const applicationDeveloper = new ApplicationDeveloper();
const logger = require(`${serverRoot}/config/winston`);
const APIClientHelper = require(`${serverRoot}/lib/APIClientHelper`);

const chai = require('chai');
const assert = chai.assert;

const privateSdkData = require(`${testRoot}/server/_fakes/data/services/private_ch_sdk_node`);

describe('services/ApplicationDeveloper', () => {
  let stubLogger;

  beforeEach(done => {
    sinon.reset();
    sinon.restore();
    stubLogger = sinon.stub(logger, 'info').returns(true); // why does this fail if its a const but nor otherwise???
    done();
  });

  afterEach(done => {
    sinon.reset();
    sinon.restore();
    done();
  });

  it('should fetch a list of api clients from the applications.api service', () => {
    // static test vars
    const mockEnv = 'mock';
    const mockURL = 'https://mocksite.com';
    const mockId = 'test';
    const mockOauthToken = 'token';
    const stubAPIClientHelper = sinon.stub(APIClientHelper, 'getPrivateAPIClient').returns({
      applicationsService: {
        getApplicationAPIClients: (itemsPerPage, startIndex) => {
          return privateSdkData.getApplicationAPIClients;
        }
      }
    });
    applicationDeveloper.server.baseUrl.mock = mockURL;
    applicationDeveloper.APIClientHelper = stubAPIClientHelper;

    // Call method
    expect(applicationDeveloper.getAPIClientsForApplication(mockId, mockOauthToken, mockEnv))
    // Assertions
      .to.eventually.eql(privateSdkData.getApplicationAPIClients.resource);
    expect(stubAPIClientHelper).to.have.been.calledOnce;
    expect(stubLogger).to.have.been.calledOnce;
  });

  it('should fetch specific Api Keys from the applications.api service', () => {
    // static test vars
    const mockEnv = 'mock';
    const mockURL = 'https://mocksite.com';
    const mockAppId = 'test';
    const mockKeyId = 'testkey';
    const mockOauthToken = 'token';
    const stubAPIClientHelper = sinon.stub(APIClientHelper, 'getPrivateAPIClient').returns({
      apiKeysService: {
        getAPIKey: (applicationId, apiKeyId) => {
          return privateSdkData.getAPIKey;
        }
      }
    });
    applicationDeveloper.server.baseUrl.mock = mockURL;
    applicationDeveloper.APIClientHelper = stubAPIClientHelper;

    // Call method
    expect(applicationDeveloper.getAPIClient(mockAppId, mockKeyId, 'key', mockOauthToken, mockEnv))
    // Assertions
      .to.eventually.eql(privateSdkData.getAPIKey.resource);
    expect(stubAPIClientHelper).to.have.been.calledOnce;
    expect(stubLogger).to.have.been.calledOnce;
  });

  it('should delete a specific key from applications.api service', () => {
    // static test vars
    const mockEnv = 'mock';
    const mockURL = 'https://mocksite.com';
    const mockAppId = 'test';
    const mockKeyId = 'testkey';
    const mockOauthToken = 'token';
    const stubAPIClientHelper = sinon.stub(APIClientHelper, 'getPrivateAPIClient').returns({
      apiKeysService: {
        deleteAPIKey: (applicationId, apiKeyId) => {
          return {
            httpStatusCode: privateSdkData.getAPIKey.httpResponse
          };
        }
      }
    });
    applicationDeveloper.server.baseUrl.mock = mockURL;
    applicationDeveloper.APIClientHelper = stubAPIClientHelper;

    // Call method
    expect(applicationDeveloper.deleteAPIClient(mockAppId, mockKeyId, 'key', mockOauthToken, mockEnv))
    // Assertions
      .to.eventually.eql();
    expect(stubAPIClientHelper).to.have.been.calledOnce;
    expect(stubLogger).to.have.been.calledOnce;
  });

  it('should fetch single Applications from the applications.api service', () => {
    // static test vars
    const mockEnv = 'mock';
    const mockURL = 'https://mocksite.com';
    const mockId = 'test';
    const mockOauthToken = 'token';
    const stubAPIClientHelper = sinon.stub(APIClientHelper, 'getPrivateAPIClient').returns({
      applicationsService: {
        getApplication: applicationId => {
          return privateSdkData.getApplication;
        }
      }
    });
    applicationDeveloper.server.baseUrl.mock = mockURL;
    applicationDeveloper.APIClientHelper = stubAPIClientHelper;

    // Call method
    expect(applicationDeveloper.getApplication(mockId, mockOauthToken, mockEnv))
    // Assertions
      .to.eventually.eql(privateSdkData.getApplication.resource);
    expect(stubAPIClientHelper).to.have.been.calledOnce;
    expect(stubLogger).to.have.been.calledOnce;
  });

  it('should fetch a list of Applications from the applications.api service', () => {
    // static test vars
    const mockEnv = 'mock';
    const mockURL = 'https://mocksite.com';
    const mockOauthToken = 'token';
    const stubAPIClientHelper = sinon.stub(APIClientHelper, 'getPrivateAPIClient').returns({
      applicationsService: {
        getApplications: (itemsPerPage, startIndex) => {
          return privateSdkData.getApplications;
        }
      }
    });
    applicationDeveloper.server.baseUrl.mock = mockURL;
    applicationDeveloper.APIClientHelper = stubAPIClientHelper;

    // Call method
    expect(applicationDeveloper.getApplicationList(mockOauthToken, mockEnv))
    // Assertions
      .to.eventually.eql(privateSdkData.getApplications.resource);
    expect(stubAPIClientHelper).to.have.been.calledOnce;
    expect(stubLogger).to.have.been.calledOnce;
  });

  it('should save an application using the applications.api service', () => {
    // static test vars
    const mockEnv = 'mock';
    const mockURL = 'https://mocksite.com';
    const mockOauthToken = 'token';
    const stubAPIClientHelper = sinon.stub(APIClientHelper, 'getPrivateAPIClient').returns({
      applicationsService: {
        postApplication: applicationPostRequest => {
          return privateSdkData.getApplication; // create response is the same structure as get response
        }
      }
    });
    applicationDeveloper.server.baseUrl.live = mockURL;
    applicationDeveloper.APIClientHelper = stubAPIClientHelper;

    const data = {
      environment: 'live',
      applicationName: privateSdkData.getApplication.resource.name,
      description: privateSdkData.getApplication.resource.description,
      terms: privateSdkData.getApplication.resource.termsAndConsitionsUrl,
      privacyPolicy: privateSdkData.getApplication.resource.privacyPolicyUrl
    };

    // Call method
    expect(applicationDeveloper.saveApplication(data, mockOauthToken))
    // Assertions
      .to.eventually.eql(privateSdkData.getApplication.resource);
    expect(stubAPIClientHelper).to.have.been.calledOnce;
    expect(stubLogger).to.have.been.calledTwice;
  });

  it('should save a rest key using the applications.api service', () => {
    // static test vars
    const mockEnv = 'mock';
    const mockURL = 'https://mocksite.com';
    const mockId = 'test';
    const mockOauthToken = 'token';
    const stubAPIClientHelper = sinon.stub(APIClientHelper, 'getPrivateAPIClient').returns({
      apiKeysService: {
        postAPIKey: apiKeyPostRequest => {
          return privateSdkData.getAPIKey; // create response is the same structure as get response
        }
      }
    });
    applicationDeveloper.server.baseUrl.live = mockURL;
    applicationDeveloper.APIClientHelper = stubAPIClientHelper;

    const data = {
      keyType: 'rest',
      keyName: privateSdkData.getAPIKey.resource.name,
      keyDescription: privateSdkData.getAPIKey.resource.description,
      restrictedIps: privateSdkData.getAPIKey.resource.restricted_ips[0],
      javaScriptDomains: privateSdkData.getAPIKey.resource.js_domains[0]
    };

    // Call method
    expect(applicationDeveloper.addNewKey(data, mockId, mockOauthToken, mockEnv))
    // Assertions
      .to.eventually.eql(privateSdkData.getAPIKey.resource);
    expect(stubAPIClientHelper).to.have.been.calledOnce;
    expect(stubLogger).to.have.been.calledTwice;
  });

  it('should save a stream key using the applications.api service', () => {
    // static test vars
    const mockEnv = 'mock';
    const mockURL = 'https://mocksite.com';
    const mockId = 'test';
    const mockOauthToken = 'token';
    const stubAPIClientHelper = sinon.stub(APIClientHelper, 'getPrivateAPIClient').returns({
      apiKeysService: {
        postAPIKey: apiKeyPostRequest => {
          return privateSdkData.getAPIKey; // create response is the same structure as get response
        }
      },
      streamKeysService: {
        postStreamKey: streamKeyPostRequest => {
          return privateSdkData.getStreamKey;
        }
      }
    });
    applicationDeveloper.server.baseUrl.live = mockURL;
    applicationDeveloper.APIClientHelper = stubAPIClientHelper;

    const data = {
      keyType: 'stream',
      keyName: privateSdkData.getStreamKey.resource.name,
      keyDescription: privateSdkData.getStreamKey.resource.description,
      restrictedIps: privateSdkData.getStreamKey.resource.restricted_ips[0]
    };

    // Call method
    expect(applicationDeveloper.addNewKey(data, mockId, mockOauthToken, mockEnv))
    // Assertions
      .to.eventually.eql(privateSdkData.getStreamKey.resource);
    expect(stubAPIClientHelper).to.have.been.calledOnce;
    expect(stubLogger).to.have.been.calledTwice;
  });

  it('getBaseUrlForPostFormData should return environment live when live is requested', () => {
    const env = 'live';
    const data = {
      name: 'app demo',
      description: 'description',
      environment: 'live'
    };
    applicationDeveloper.server.baseUrl.live = env;
    const baseUrl = applicationDeveloper._getBaseUrlForPostFormData(data);
    assert.equal(env, baseUrl);
  });

  it('getBaseUrlForPostFormData should return environment test when test is requested', () => {
    const env = 'test';
    const data = {
      name: 'app demo',
      description: 'description',
      environment: 'test'
    };
    applicationDeveloper.server.baseUrl.test = env;
    const baseUrl = applicationDeveloper._getBaseUrlForPostFormData(data);
    assert.equal(env, baseUrl);
  });

  it('getBaseUrlForPostFormData should return environment future when future is requested', () => {
    const env = 'future';
    const data = {
      name: 'app demo',
      description: 'description',
      environment: 'test',
      inDevelopment: 'yes'
    };
    applicationDeveloper.server.baseUrl.future = env;
    const baseUrl = applicationDeveloper._getBaseUrlForPostFormData(data);
    assert.equal(env, baseUrl);
  });

  it('should update an application using the applications.api service', () => {
    // static test vars
    const mockEnv = 'mock';
    const mockURL = 'https://mocksite.com';
    const mockId = 'test';
    const mockOauthToken = 'token';
    const stubAPIClientHelper = sinon.stub(APIClientHelper, 'getPrivateAPIClient').returns({
      applicationsService: {
        putApplication: (applicationPutRequest, applicationId) => {
          return privateSdkData.getApplication; // update response is the same structure as get response
        }
      }
    });
    applicationDeveloper.server.baseUrl.mock = mockURL;
    applicationDeveloper.APIClientHelper = stubAPIClientHelper;

    const data = {
      env: mockEnv,
      appId: mockId,
      applicationName: privateSdkData.getApplication.resource.name,
      description: privateSdkData.getApplication.resource.description,
      terms: privateSdkData.getApplication.resource.termsAndConsitionsUrl,
      privacyPolicy: privateSdkData.getApplication.resource.privacyPolicyUrl
    };

    // Call method
    expect(applicationDeveloper.updateApplication(data, mockOauthToken))
    // Assertions
      .to.eventually.eql(privateSdkData.getApplication.resource);
    expect(stubAPIClientHelper).to.have.been.calledOnce;
    expect(stubLogger).to.have.been.calledTwice;
  });

  it('should update a key using the applications.api service', () => {
    // static test vars
    const mockEnv = 'mock';
    const mockURL = 'https://mocksite.com';
    const mockAppId = 'test';
    const mockKeyId = 'test-key';
    const mockOauthToken = 'token';
    const stubAPIClientHelper = sinon.stub(APIClientHelper, 'getPrivateAPIClient').returns({
      apiKeysService: {
        putAPIKey: apiKeyPostRequest => {
          return privateSdkData.getAPIKey; // update response is the same structure as get response
        }
      }
    });
    applicationDeveloper.server.baseUrl.live = mockURL;
    applicationDeveloper.APIClientHelper = stubAPIClientHelper;

    const data = {
      keyType: 'rest',
      keyName: privateSdkData.getAPIKey.resource.name,
      keyDescription: privateSdkData.getAPIKey.resource.description,
      restrictedIps: privateSdkData.getAPIKey.resource.restricted_ips[0],
      javaScriptDomains: privateSdkData.getAPIKey.resource.js_domains[0],
      appId: mockAppId,
      env: mockEnv,
      keyId: mockKeyId
    };

    // Call method
    expect(applicationDeveloper.updateKey(data, mockAppId, mockKeyId, mockOauthToken, mockEnv))
    // Assertions
      .to.eventually.eql(privateSdkData.getAPIKey.resource);
    expect(stubAPIClientHelper).to.have.been.calledOnce;
    expect(stubLogger).to.have.been.calledTwice;
  });

  it('should delete an Application using the applications.api service', () => {
    // static test vars
    const mockEnv = 'mock';
    const mockURL = 'https://mocksite.com';
    const mockId = 'test';
    const mockOauthToken = 'token';
    const stubAPIClientHelper = sinon.stub(APIClientHelper, 'getPrivateAPIClient').returns({
      applicationsService: {
        deleteApplication: applicationId => {
          return {
            httpStatusCode: privateSdkData.getApplication.httpResponse
          };
        }
      }
    });
    applicationDeveloper.server.baseUrl.mock = mockURL;
    applicationDeveloper.APIClientHelper = stubAPIClientHelper;

    // Call method
    expect(applicationDeveloper.deleteApplication(mockId, mockOauthToken, mockEnv))
    // Assertions
      .to.eventually.eql();
    expect(stubAPIClientHelper).to.have.been.calledOnce;
    expect(stubLogger).to.have.been.calledOnce;
  });

  it('getBaseUrlForPostFormData should return empty string when empty or undefined environment is requested', () => {
    const env = 'future';
    const data = {
      name: 'app demo',
      description: 'description'
    };
    applicationDeveloper.server.baseUrl.future = env;
    applicationDeveloper.server.baseUrl.test = env;
    applicationDeveloper.server.baseUrl.live = env;
    let baseUrl = applicationDeveloper._getBaseUrlForPostFormData(data);
    assert.equal('', baseUrl);
    data.environment = '';
    baseUrl = applicationDeveloper._getBaseUrlForPostFormData(data);
    assert.equal('', baseUrl);
  });

  it('getBaseUrlForPostFormData should return empty string when unknown environment is requested', () => {
    const env = 'future';
    const data = {
      name: 'app demo',
      description: 'description',
      environment: 'Does Not Exist'
    };
    applicationDeveloper.server.baseUrl.future = env;
    applicationDeveloper.server.baseUrl.test = env;
    applicationDeveloper.server.baseUrl.live = env;
    const baseUrl = applicationDeveloper._getBaseUrlForPostFormData(data);
    assert.equal('', baseUrl);
  });
});
