const ApiKeyDeveloper = require(`${serverRoot}/services/ApiKeyDeveloper`);
const apiKeyDeveloper = new ApiKeyDeveloper();
const UrlService = require(`${serverRoot}/services/UrlService`);
const logger = require(`${serverRoot}/config/winston`);

const request = require('axios');

const apiKeyData = require(`${testRoot}/server/_fakes/data/services/apiKeys`);

describe('services/UrlService', () => {
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
    const opts = apiKeyDeveloper._getBaseOptions();
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
    const finalVars = baseOptions;
    finalVars.method = 'GET';
    finalVars.url = mockURL + '/applications' + mockId + '/api-clients?items_per_page=20&start_index=0';
    // Create stubs
    const stubUrlServ = sinon.stub(UrlService.prototype, 'getUrlForEnv').returns(mockURL);
    const stubOpts = sinon.stub(ApiKeyDeveloper.prototype, '_getBaseOptions').returns(baseOptions);
    const stubAxios = sinon.stub(request, 'request').returns(Promise.resolve(apiKeyData.getApiKeyList));
    // Inject stubs
    apiKeyDeveloper.request = stubAxios;
    apiKeyDeveloper.urlService = stubUrlServ;

    // Call method
    expect(apiKeyDeveloper.getKeysForApplication(mockId, mockEnv))
    // Assertions
      .to.eventually.eql(apiKeyData.getApiKeyList);
    expect(stubUrlServ).to.have.been.calledOnce;
    expect(stubUrlServ).to.have.been.calledWithMatch(mockEnv);
    expect(stubAxios).to.have.been.calledOnce;
    expect(stubAxios).to.have.been.calledWithMatch(finalVars);
    expect(stubOpts).to.have.been.calledOnce;
    expect(stubLogger).to.have.been.calledOnce;
  });
});
