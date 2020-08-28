const Utility = require(`${serverRoot}/lib/Utility`);
// const Session = require(`${serverRoot}/lib/Session`);
const logger = require(`${serverRoot}/config/winston`);
const errorManifest = require(`${serverRoot}/lib/errors/error_manifest`);

const Validator = require(`${serverRoot}/lib/validation/form_validators/ManageApplication`);
const validator = new Validator();

const ApplicationsDeveloperService = require(`${serverRoot}/services/ApplicationsDeveloper`);
const applicationsDeveloperService = new ApplicationsDeveloperService();

const ApiKeyDeveloper = require(`${serverRoot}/services/ApiKeyDeveloper`);
const apiKeyDeveloper = new ApiKeyDeveloper();

const serviceData = require(`${testRoot}/server/_fakes/data/services/manage_applications`);
const routeData = require(`${testRoot}/server/_fakes/data/routes/application`);
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

  it('should serve up the applications index page on the /manage-applications mount path', () => {
    const slug = '/manage-applications';
    const stubGetList = sinon.stub(ApplicationsDeveloperService.prototype, 'getList')
      .returns(Promise.resolve(serviceData.getList));
    return request(app)
      .get(slug)
      .set('Cookie', cookieStr)
      .then(response => {
        expect(stubLogger).to.have.been.calledOnce;
        expect(stubGetList).to.have.been.calledThrice;
        expect(response).to.have.status(200);
      });
  });

  it('should serve up the applications index page on the /manage-applications path with an error', () => {
    const slug = '/manage-applications';
    const genericServerException = exceptions.genericServerException;
    const stubGetListReject = sinon.stub(ApplicationsDeveloperService.prototype, 'getList')
      .rejects(new Error('Test error'));
    const stubProcessException = sinon.stub(routeUtils, 'processException')
      .returns(genericServerException);
    return request(app)
      .get(slug)
      .set('Cookie', cookieStr)
      .then(response => {
        expect(stubLogger).to.have.been.calledOnce;
        expect(stubGetListReject).to.have.been.called;
        expect(stubProcessException).to.have.been.calledOnce;
        expect(response.text).to.include('Internal server error. Please try again');
        expect(response).to.have.status(200);
      });
  });

  it('should serve up the add application page', () => {
    const slug = '/manage-applications/add';
    return request(app)
      .get(slug)
      .set('Cookie', cookieStr)
      .then(response => {
        expect(stubLogger).to.have.been.calledOnce;
        expect(response.text).to.include('New application');
        expect(response).to.have.status(200);
      });
  });

  it('should save an application and redirect to the application overview page on the /manage-applications mount path', () => {
    const slug = '/manage-applications/add';
    const stubAddApplicationValidator = sinon.stub(Validator.prototype, 'addApplication').returns(Promise.resolve(true));
    const stubSave = sinon.stub(ApplicationsDeveloperService.prototype, 'save').returns(Promise.resolve(true));
    const stubGetList = sinon.stub(ApplicationsDeveloperService.prototype, 'getList')
      .returns(Promise.resolve(serviceData.getList));
    return request(app)
      .post(slug)
      .set('Cookie', cookieStr)
      .send(routeData.addApplication)
      .then(response => {
        expect(stubLogger).to.have.been.calledTwice;
        expect(stubAddApplicationValidator).to.have.been.calledOnce;
        expect(stubAddApplicationValidator).to.have.been.calledWith(routeData.addApplication);
        expect(stubSave).to.have.been.calledOnce;
        expect(response).to.redirectTo(/manage-applications/);
        expect(stubGetList).to.have.been.calledThrice;
        expect(response).to.have.status(200);
      });
  });

  it('should serve add application with an error on validation', () => {
    const slug = '/manage-applications/add';
    const validationException = exceptions.validationException;
    const stubValidatorReject = sinon.stub(Validator.prototype, 'addApplication').rejects(new Error('Validation error'));
    const stubProcessException = sinon.stub(routeUtils, 'processException').returns(validationException.stack);
    const stubSave = sinon.stub(ApplicationsDeveloperService.prototype, 'save').returns(Promise.resolve(true));
    const stubGetList = sinon.stub(ApplicationsDeveloperService.prototype, 'getList')
      .returns(Promise.resolve(serviceData.getList));
    return request(app)
      .post(slug)
      .set('Cookie', cookieStr)
      .send(routeData.addApplication)
      .then(response => {
        expect(stubLogger).to.have.been.calledOnce;
        expect(stubValidatorReject).to.have.been.calledOnce;
        expect(stubValidatorReject).to.have.been.calledWith(routeData.addApplication);
        expect(stubProcessException).to.have.been.calledOnce;
        expect(response).to.have.status(200);
        expect(response.text).to.include('Summary message for sample field');
        expect(stubSave).to.not.have.been.called;
        expect(stubGetList).to.not.have.been.called;
      });
  });

  it('should serve up details of a single application', () => {
    const slug = '/manage-applications/appId123/view/test';
    const stubSingleApplication = sinon.stub(ApplicationsDeveloperService.prototype, 'getApplication').returns(Promise.resolve(singleAppData.singleApp));
    const stubKeyList = sinon.stub(ApiKeyDeveloper.prototype, 'getKeysForApplication').returns(Promise.resolve(Promise.resolve(keyData.getApiKeyList)));
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
    const stubKeyListReject = sinon.stub(ApiKeyDeveloper.prototype, 'getKeysForApplication').rejects(new Error('Test error'));
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
