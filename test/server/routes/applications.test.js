const Utility = require(`${serverRoot}/lib/Utility`);
// const Session = require(`${serverRoot}/lib/Session`);
const logger = require(`${serverRoot}/config/winston`);
const errorManifest = require(`${serverRoot}/lib/errors/error_manifest`);

const Validator = require(`${serverRoot}/lib/validation/form_validators/ManageApplication`);
const validator = new Validator();

const ApplicationsDeveloperService = require(`${serverRoot}/services/ApplicationsDeveloper`);
const applicationsDeveloperService = new ApplicationsDeveloperService();

const exceptions = require(`${testRoot}/server/_fakes/mocks`);

const routeUtils = require(`${serverRoot}/routes/utils`);
const app = require(`${serverRoot}/app`);

const keyData = require(`${testRoot}/server/_fakes/data/services/apiKeys`);
const singleAppData = require(`${testRoot}/server/_fakes/data/services/singleApplication`);

let stubLogger;

const cookieStr = 'AD_SID=abc123';

describe('routes/applications.js', () => {
  beforeEach(done => {
    sinon.reset();
    sinon.restore();
    stubLogger = sinon.stub(logger, 'info').returns(true);
    done();
  });

  afterEach(done => {
    sinon.reset();
    sinon.restore();
    done();
  });

  it('should serve up details of a single application', () => {
    const slug = '/manage-applications/appId123/view/test';
    const stubSingleApplication = sinon.stub(ApplicationsDeveloperService.prototype, 'getApplication').returns(Promise.resolve(singleAppData.singleApp));
    const stubKeyList = sinon.stub(ApplicationsDeveloperService.prototype, 'getKeysForApplication').returns(Promise.resolve(Promise.resolve(keyData.getApiKeyList)));
    return request(app)
      .get(slug)
      .set('Cookie', cookieStr)
      .then(response => {
        expect(stubLogger).to.have.been.calledOnce;
        expect(stubSingleApplication).to.have.been.calledOnce;
        expect(stubKeyList).to.have.been.calledOnce;
        expect(response.text).to.include('Application details');
        expect(response.text).to.include('Keys for this application');
        expect(response).to.have.status(200);
      });
  });

  it('should serve up the application overview page with an error on the /manage-applications/appId/view/env path', () => {
    const slug = '/manage-applications/appId123/view/test';
    const genericServerException = exceptions.genericServerException;
    const stubSingleApplicationReject = sinon.stub(ApplicationsDeveloperService.prototype, 'getApplication').rejects(new Error('Test error'));
    const stubKeyListReject = sinon.stub(ApplicationsDeveloperService.prototype, 'getKeysForApplication').rejects(new Error('Test error'));
    const stubProcessException = sinon.stub(routeUtils, 'processException')
      .returns(genericServerException);
    return request(app)
      .get(slug)
      .set('Cookie', cookieStr)
      .then(response => {
        expect(stubLogger).to.have.been.calledOnce;
        expect(stubSingleApplicationReject).to.have.been.calledOnce;
        expect(stubKeyListReject).to.have.been.calledOnce;
        expect(stubProcessException).to.have.been.calledOnce;
        expect(response.text).to.include('Internal server error. Please try again');
        expect(response).to.have.status(200);
      });
  });
});
