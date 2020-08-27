const logger = require(`${serverRoot}/config/winston`);
const Utility = require(`${serverRoot}/lib/Utility`);
const Session = require(`${serverRoot}/lib/Session`);
let stubLogger;

const ApplicationsDeveloperService = require(`${serverRoot}/services/ApplicationsDeveloper`);
const applicationsDeveloperService = new ApplicationsDeveloperService();

const ApiKeyDeveloperService =  require(`${serverRoot}/services/ApiKeyDeveloper`);

const errorManifest = require(`${serverRoot}/lib/errors/error_manifest`).validation;
const Validator = require(`${serverRoot}/lib/validation`);
const validator = new Validator();

const apiKeyData = require(`${testRoot}/server/_fakes/data/services/apiKeys`);
const singleApplication = require(`${testRoot}/server/_fakes/data/services/singleApplication`);

const app = require(`${serverRoot}/app`);

const cookieStr = 'AD_SID=abc123';


describe('routes/report', () => {
  beforeEach(done => {
    sinon.reset();
    sinon.restore();
    sinon.stub(Utility, 'logException').returns(undefined);
    stubLogger = sinon.stub(logger, 'info').returns(true);
    done();
  });

  afterEach(done => {
    sinon.reset();
    sinon.restore();
    done();
  });
  it.skip('should serve up details of a single application', () => {
    const slug = '/manage-applications/appId123/view/test';
    return request(app)
      .get(slug)
      .set('Cookie', cookieStr)
      .then(response => {
        const stubGetApplication = sinon.stub(applicationsDeveloperService, 'getApplication').returns(Promise.resolve(singleApplication.singleApp));
        const stubGetKeys = sinon.stub(ApiKeyDeveloperService.prototype, 'getKeysForApplication').returns(Promise.resolve(apiKeyData.getApiKeyList));
        console.log('keyssssssss', stubGetKeys);
        expect(stubLogger).to.have.been.calledThrice;
        expect(stubGetApplication).to.have.been.calledOnce;
        expect(stubGetKeys).to.have.been.calledOnce;
        expect(response).to.have.status(200);
      });
  });
  it.skip('should serve up the applications page with no mount path', () => {
    const slug = '/';
    return request(app)
      .get(slug)
      .set('Cookie', cookieStr)
      .then(response => {
        expect(response).to.have.status(200);
        expect(stubLogger).to.have.been.calledOnce;
      });
  });
});
