const ApplicationDeveloper = require(`${serverRoot}/services/ApplicationsDeveloper`);
const applicationDeveloper = new ApplicationDeveloper();
const logger = require(`${serverRoot}/config/winston`);

const request = require('axios');
const chai = require('chai');
const assert = chai.assert;

const apiKeyData = require(`${testRoot}/server/_fakes/data/services/apiKeys`);
const appData = require(`${testRoot}/server/_fakes/data/services/singleApplication`);
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
    const finalVars = Object.assign({}, baseOptions);
    finalVars.method = 'GET';
    finalVars.url = mockURL + '/applications/' + mockId;
    // Create stubs
    const stubOpts = sinon.stub(ApplicationDeveloper.prototype, '_getBaseOptions').returns(baseOptions);
    const stubAxios = sinon.stub(request, 'request').returns(Promise.resolve(appData.singleApp.data.getApplication));
    // Inject stubs
    applicationDeveloper.request = stubAxios;
    applicationDeveloper.server.baseUrl.mock = mockURL;

    // Call method
    expect(applicationDeveloper.getApplication(mockId, mockEnv))
    // Assertions
      .to.eventually.eql(appData.singleApp.data.getApplication);
    expect(stubAxios).to.have.been.calledOnce;
    expect(stubAxios).to.have.been.calledWithExactly(finalVars);
    expect(stubOpts).to.have.been.calledOnce;
    expect(stubLogger).to.have.been.calledOnce;
  });

  it('should fetch a list of Applications from the applications.api service', () => {
    // static test vars
    const mockEnv = 'mock';
    const mockURL = 'https://mocksite.com';
    const finalVars = Object.assign({}, baseOptions);
    finalVars.method = 'GET';
    finalVars.url = mockURL + '/applications/?items_per_page=20&start_index=0';
    // Create stubs
    const stubOpts = sinon.stub(ApplicationDeveloper.prototype, '_getBaseOptions').returns(baseOptions);
    const stubAxios = sinon.stub(request, 'request').returns(Promise.resolve(serviceData.getList));
    // Inject stubs
    applicationDeveloper.request = stubAxios;
    applicationDeveloper.server.baseUrl.mock = mockURL;

    // Call method
    expect(applicationDeveloper.getApplicationList(mockEnv))
      // Assertions
      .to.eventually.eql(serviceData.getList);
    expect(stubAxios).to.have.been.calledOnce;
    expect(stubAxios).to.have.been.calledWithExactly(finalVars);
    expect(stubOpts).to.have.been.calledOnce;
    expect(stubLogger).to.have.been.calledOnce;
  });

  it('should save an application using the applications.api service', () => {
    // static test vars
    const mockURL = 'https://mocksite.com';
    const finalVars = Object.assign({}, baseOptions);
    finalVars.method = 'POST';
    finalVars.url = mockURL + '/applications';
    finalVars.data = {
      description: 'description',
      name: undefined,
      privacy_policy_url: undefined,
      terms_and_conditions_url: undefined
    };
    // Create stubs
    const stubGetBaseUrlFromEnv = sinon.stub(ApplicationDeveloper.prototype, '_getBaseUrlForPostFormData').returns(mockURL);
    const stubOpts = sinon.stub(ApplicationDeveloper.prototype, '_getBaseOptions').returns(baseOptions);
    const stubAxios = sinon.stub(request, 'request').returns(Promise.resolve(routeData.addApplication));

    // Inject stubs
    applicationDeveloper.request = stubAxios;
    applicationDeveloper.server.baseUrl.mock = mockURL;
    // Call method
    expect(applicationDeveloper.saveApplication(routeData.addApplication))
      // Assertions
      .to.eventually.eql(routeData.addApplication);
    expect(stubGetBaseUrlFromEnv).to.have.been.calledOnce;
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
    const mockURL = 'https://mockurl.com';
    const finalVars = Object.assign({}, baseOptions);
    finalVars.method = 'PUT';
    finalVars.url = mockURL + '/applications' + '/app123';
    finalVars.data = {
      name: 'test',
      description: 'description',
      privacy_policy_url: 'priv',
      terms_and_conditions_url: 'terms'
    };
    // Create stubs
    const stubOpts = sinon.stub(ApplicationDeveloper.prototype, '_getBaseOptions').returns(baseOptions);
    const stubAxios = sinon.stub(request, 'request').returns(Promise.resolve(routeData.updateApplication));

    // Inject stubs
    applicationDeveloper.request = stubAxios;
    applicationDeveloper.server.baseUrl.test = mockURL;
    // Call method
    expect(applicationDeveloper.updateApplication(routeData.updateApplication))
      // Assertions
      .to.eventually.eql(routeData.updateApplication);
    expect(stubAxios).to.have.been.calledOnce;
    expect(stubAxios).to.have.been.calledWithExactly(finalVars);
    expect(stubOpts).to.have.been.calledOnce;
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
