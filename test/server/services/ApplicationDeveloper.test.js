const ApplicationDeveloper = require(`${serverRoot}/services/ApplicationsDeveloper`);
const applicationDeveloper = new ApplicationDeveloper();
const logger = require(`${serverRoot}/config/winston`);
const privateSdk = require('private-ch-sdk-node');
const APIClientHelper = require(`${serverRoot}/lib/APIClientHelper`);

const request = require('axios');
const chai = require('chai');
const assert = chai.assert;

const apiKeyData = require(`${testRoot}/server/_fakes/data/services/apiKeys`);
const privateSdkData = require(`${testRoot}/server/_fakes/data/services/private_ch_sdk_node`);
const serviceData = require(`${testRoot}/server/_fakes/data/services/ApplicationDeveloper`);
const routeData = require(`${testRoot}/server/_fakes/data/routes/application.js`);

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

  const baseOptions = {
    headers: {
      // authorization: this.server.apiKey
      content_type: 'application/json'
    },
    responseType: 'json'
  };

  it('should correctly get the base options for the Api Client Service', () => {
    const opts = applicationDeveloper._getBaseOptions();
    expect(opts).to.have.own.property('headers')
      .to.have.own.property('content_type')
      .that.is.equal('application/json');
    expect(opts).to.have.own.property('responseType')
      .that.is.equal('json');
  });

  it('should fetch Api Keys from the applications.api service', () => {
    // static test vars
    const mockEnv = 'mock';
    const mockURL = 'https://mocksite.com';
    const mockId = 'test';
    const finalVars = Object.assign({}, baseOptions);
    finalVars.method = 'GET';
    finalVars.url = mockURL + '/applications/' + mockId + '/api-clients?items_per_page=20&start_index=0';
    // Create stubs
    const stubOpts = sinon.stub(ApplicationDeveloper.prototype, '_getBaseOptions').returns(baseOptions);
    const stubAxios = sinon.stub(request, 'request').returns(Promise.resolve(apiKeyData.getApiKeyList));
    // Inject stubs
    applicationDeveloper.request = stubAxios;
    applicationDeveloper.server.baseUrl.mock = mockURL;

    // Call method
    expect(applicationDeveloper.getKeysForApplication(mockId, mockEnv))
    // Assertions
      .to.eventually.eql(apiKeyData.getApiKeyList);
    expect(stubAxios).to.have.been.calledOnce;
    expect(stubAxios).to.have.been.calledWithMatch(finalVars);
    expect(stubOpts).to.have.been.calledOnce;
    expect(stubLogger).to.have.been.calledOnce;
  });

  it('should fetch specific Api Keys from the applications.api service', () => {
    // static test vars
    const mockEnv = 'mock';
    const mockURL = 'https://mocksite.com';
    const mockAppId = 'testApp';
    const mockKeyId = 'testKey';
    const mockKeyType = 'mock';
    const finalVars = Object.assign({}, baseOptions);
    finalVars.method = 'GET';
    finalVars.url = mockURL + '/applications/' + mockAppId + '/api-clients/'+ mockKeyType +'/'+ mockKeyId;
    // Create stubs
    const stubOpts = sinon.stub(ApplicationDeveloper.prototype, '_getBaseOptions').returns(baseOptions);
    const stubAxios = sinon.stub(request, 'request').returns(Promise.resolve(apiKeyData.getApiKeyList));
    // Inject stubs
    applicationDeveloper.request = stubAxios;
    applicationDeveloper.server.baseUrl.mock = mockURL;

    // Call method
    expect(applicationDeveloper.getSpecificKey(mockAppId, mockKeyId, mockKeyType, mockEnv))
    // Assertions
      .to.eventually.eql(apiKeyData.getApiKeyList);
    expect(stubAxios).to.have.been.calledOnce;
    expect(stubAxios).to.have.been.calledWithMatch(finalVars);
    expect(stubOpts).to.have.been.calledOnce;
    expect(stubLogger).to.have.been.calledOnce;
  });

  it('should delete a specific key from applications.api service', () => {
    // static test vars
    const mockEnv = 'mock';
    const mockURL = 'https://mocksite.com';
    const mockAppId = 'testApp';
    const mockKeyId = 'testKey';
    const mockKeyType = 'mock';
    const finalVars = Object.assign({}, baseOptions);
    finalVars.method = 'DELETE';
    finalVars.url = mockURL + '/applications/' + mockAppId + '/api-clients/'+ mockKeyType +'/'+ mockKeyId;
    // Create stubs
    const stubOpts = sinon.stub(ApplicationDeveloper.prototype, '_getBaseOptions').returns(baseOptions);
    const stubAxios = sinon.stub(request, 'request').returns(Promise.resolve(apiKeyData.getApiKeyList));
    // Inject stubs
    applicationDeveloper.request = stubAxios;
    applicationDeveloper.server.baseUrl.mock = mockURL;

    // Call method
    expect(applicationDeveloper.deleteApiKey(mockAppId, mockKeyId, mockKeyType, mockEnv))
    // Assertions
      .to.eventually.eql(apiKeyData.getApiKeyList);
    expect(stubAxios).to.have.been.calledOnce;
    expect(stubAxios).to.have.been.calledWithMatch(finalVars);
    expect(stubOpts).to.have.been.calledOnce;
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
    const mockId = 'test';
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
    const mockId = 'test';
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
    const finalVars = Object.assign({}, baseOptions);
    const mockId = 'test';
    finalVars.method = 'POST';
    finalVars.url = mockURL + '/applications/'+mockId+'/api-clients/key';
    finalVars.data = {
      description: 'description',
      name: 'key demo',
      restricted_ips: ['00000'],
      js_domains: ['javascriptDomain']
    };
    // Create stubs
    const stubOpts = sinon.stub(ApplicationDeveloper.prototype, '_getBaseOptions').returns(baseOptions);
    const stubAxios = sinon.stub(request, 'request').returns(Promise.resolve(routeData.addNewKey));

    // Inject stubs
    applicationDeveloper.request = stubAxios;
    applicationDeveloper.server.baseUrl.mock = mockURL;
    // Call method
    expect(applicationDeveloper.addNewRestKey(routeData.addNewKey, mockId, mockEnv))
      // Assertions
      .to.eventually.eql(routeData.addNewKey);
    expect(stubAxios).to.have.been.calledOnce;
    expect(stubAxios).to.have.been.calledWithExactly(finalVars);
    expect(stubOpts).to.have.been.calledOnce;
    expect(stubLogger).to.have.been.calledOnce;
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
    const mockAppId = 'test';
    const mockURL = 'https://mocksite.com';
    const finalVars = Object.assign({}, baseOptions);
    const mockKeyId = 'test';
    finalVars.method = 'PUT';
    finalVars.url = mockURL + '/applications/'+mockAppId+'/api-clients/key/'+mockKeyId;
    finalVars.data = {
      description: 'description',
      name: 'test',
      restricted_ips: ['00000'],
      js_domains: ['javascriptDomain']
    };
    // Create stubs
    const stubOpts = sinon.stub(ApplicationDeveloper.prototype, '_getBaseOptions').returns(baseOptions);
    const stubAxios = sinon.stub(request, 'request').returns(Promise.resolve(routeData.updateKey));

    // Inject stubs
    applicationDeveloper.request = stubAxios;
    applicationDeveloper.server.baseUrl.mock = mockURL;
    // Call method
    expect(applicationDeveloper.updateKey(routeData.updateKey, mockAppId, mockKeyId, mockEnv))
      // Assertions
      .to.eventually.eql(routeData.updateKey);
    expect(stubAxios).to.have.been.calledOnce;
    expect(stubAxios).to.have.been.calledWithExactly(finalVars);
    expect(stubOpts).to.have.been.calledOnce;
    expect(stubLogger).to.have.been.calledOnce;
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
            'httpStatusCode': privateSdkData.getApplication.httpResponse
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
