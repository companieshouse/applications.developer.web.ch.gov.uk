const Redis = require('ioredis');

const logger = require(`${serverRoot}/config/winston`);

const Validator = require(`${serverRoot}/lib/validation/form_validators/ManageApplication`);

const ApplicationsDeveloperService = require(`${serverRoot}/services/ApplicationsDeveloper`);
const NotificationService = require(`${serverRoot}/services/Notification`);

const exceptions = require(`${testRoot}/server/_fakes/mocks`);

const routeUtils = require(`${serverRoot}/routes/utils`);

const serviceData = require(`${testRoot}/server/_fakes/data/services/ApplicationDeveloper`);
const routeData = require(`${testRoot}/server/_fakes/data/routes/application`);
const keyData = require(`${testRoot}/server/_fakes/data/services/apiKeys`);
const { sessionSignedIn, SIGNED_IN_COOKIE } = require(`${testRoot}/server/_fakes/mocks/lib/session`);
const singleAppData = require(`${testRoot}/server/_fakes/data/services/singleApplication`);

let stubLogger;
let app;

const signedInCookie = [`${process.env.COOKIE_NAME}=${SIGNED_IN_COOKIE}`];

describe('routes/applications.js', () => {
  beforeEach(done => {
    sinon.reset();
    sinon.restore();
    sinon.stub(Redis.prototype, 'connect').returns(Promise.resolve());
    sinon.stub(Redis.prototype, 'get').returns(Promise.resolve(sessionSignedIn));
    app = require(`${serverRoot}/app`);

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
    process.env.FUTURE_DISPLAY_FLAG = 'true';
    const stubGetApplicationList = sinon.stub(ApplicationsDeveloperService.prototype, 'getApplicationList')
      .returns(Promise.resolve(serviceData.getList));

    return request(app)
      .get(slug)
      .set('Cookie', signedInCookie)
      .then(response => {
        expect(stubLogger).to.have.been.calledOnce;
        expect(stubGetApplicationList).to.have.been.calledThrice;
        expect(response).to.have.status(200);
      });
  });

  it('should serve up the applications index page on the /manage-applications path with an error', () => {
    const slug = '/manage-applications';
    process.env.FUTURE_DISPLAY_FLAG = 'true';
    const genericServerException = exceptions.genericServerException;
    const stubGetListReject = sinon.stub(ApplicationsDeveloperService.prototype, 'getApplicationList')
      .rejects(new Error('Test error'));
    const stubProcessException = sinon.stub(routeUtils, 'processException')
      .returns(genericServerException);
    return request(app)
      .get(slug)
      .set('Cookie', signedInCookie)
      .then(response => {
        expect(stubLogger).to.have.been.calledOnce;
        expect(stubGetListReject).to.have.been.called;
        expect(stubProcessException).to.have.been.calledOnce;
        expect(response.text).to.include('Internal server error. Please try again');
        expect(response).to.have.status(200);
      });
  });

  it('should serve up the applications index page on the /manage-applications mount path without future flag', () => {
    const slug = '/manage-applications';
    process.env.FUTURE_DISPLAY_FLAG = '';
    const stubGetApplicationList = sinon.stub(ApplicationsDeveloperService.prototype, 'getApplicationList')
      .returns(Promise.resolve(serviceData.getList));
    return request(app)
      .get(slug)
      .set('Cookie', signedInCookie)
      .then(response => {
        expect(stubLogger).to.have.been.calledOnce;
        expect(stubGetApplicationList).to.have.been.calledTwice;
        expect(response).to.have.status(200);
      });
  });

  it('should serve up the applications index page on the /manage-applications path with an error without future flag', () => {
    const slug = '/manage-applications';
    process.env.FUTURE_DISPLAY_FLAG = '';
    const genericServerException = exceptions.genericServerException;
    const stubGetListReject = sinon.stub(ApplicationsDeveloperService.prototype, 'getApplicationList')
      .rejects(new Error('Test error'));
    const stubProcessException = sinon.stub(routeUtils, 'processException')
      .returns(genericServerException);
    return request(app)
      .get(slug)
      .set('Cookie', signedInCookie)
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
      .set('Cookie', signedInCookie)
      .then(response => {
        expect(stubLogger).to.have.been.calledOnce;
        expect(response.text).to.include('New application');
        expect(response).to.have.status(200);
      });
  });
  it('should save an application and redirect to the application overview page on the /manage-applications mount path', () => {
    const slug = '/manage-applications/add';
    process.env.FUTURE_DISPLAY_FLAG = 'true';
    const stubAddApplicationValidator = sinon.stub(Validator.prototype, 'addApplication').returns(Promise.resolve(true));
    const stubSave = sinon.stub(ApplicationsDeveloperService.prototype, 'saveApplication').returns(Promise.resolve(true));
    const stubGetList = sinon.stub(ApplicationsDeveloperService.prototype, 'getApplicationList')
      .returns(Promise.resolve(serviceData.getApplicationList));const stubNotifications = sinon.stub(NotificationService.prototype, 'notify');
    return request(app)
      .post(slug)
      .set('Cookie', signedInCookie)
      .send(routeData.addApplication)
      .then(response => {
        expect(stubLogger).to.have.been.calledTwice;
        expect(stubAddApplicationValidator).to.have.been.calledOnce;
        expect(stubAddApplicationValidator).to.have.been.calledWith(routeData.addApplication);
        expect(stubSave).to.have.been.calledOnce;
        expect(response).to.redirectTo(/manage-applications/);
        expect(stubGetList).to.have.been.calledThrice;
        expect(response).to.have.status(200);
        expect(stubNotifications).to.have.been.calledOnce;
      });
  });
  it('should serve add application with an error on validation', () => {
    const slug = '/manage-applications/add';
    const validationException = exceptions.validationException;
    const stubValidatorReject = sinon.stub(Validator.prototype, 'addApplication').rejects(new Error('Validation error'));
    const stubProcessException = sinon.stub(routeUtils, 'processException').returns(validationException.stack);
    const stubSave = sinon.stub(ApplicationsDeveloperService.prototype, 'saveApplication').returns(Promise.resolve(true));
    const stubGetList = sinon.stub(ApplicationsDeveloperService.prototype, 'getApplicationList')
      .returns(Promise.resolve(serviceData.getApplicationList));
    return request(app)
      .post(slug)
      .set('Cookie', signedInCookie)
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
    const stubKeyList = sinon.stub(ApplicationsDeveloperService.prototype, 'getKeysForApplication').returns(Promise.resolve(Promise.resolve(keyData.getApiKeyList)));
    return request(app)
      .get(slug)
      .set('Cookie', signedInCookie)
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
      .set('Cookie', signedInCookie)
      .then(response => {
        expect(stubLogger).to.have.been.calledOnce;
        expect(stubSingleApplicationReject).to.have.been.calledOnce;
        expect(stubKeyListReject).to.have.been.calledOnce;
        expect(stubProcessException).to.have.been.calledOnce;
        expect(response.text).to.include('Internal server error. Please try again');
        expect(response).to.have.status(200);
      });
  });

  it('should serve up the update application page on the /manage-applications/:appId/update/:env mount path', () => {
    const slug = '/manage-applications/app123/update/test';
    const stubSingleApplication = sinon.stub(ApplicationsDeveloperService.prototype, 'getApplication').returns(Promise.resolve(singleAppData.singleApp));

    return request(app)
      .get(slug)
      .set('Cookie', signedInCookie)
      .then(response => {
        expect(stubLogger).to.have.been.calledOnce;
        expect(stubSingleApplication).to.have.been.calledOnce;
        expect(response.text).to.include('Update application');
        expect(response).to.have.status(200);
      });
  });

  it('should serve up the update key page on the /manage-applications/:appId/:keyType/:keyId/update/:env mount path', () => {
    const slug = '/manage-applications/mockAppId/mockKeyType/mockKeyId/update/mockEnv';
    const stubSingleKey = sinon.stub(ApplicationsDeveloperService.prototype, 'getSpecificKey').returns(Promise.resolve(keyData.getRestApiKey));
    return request(app)
      .get(slug)
      .set('Cookie', signedInCookie)
      .then(response => {
        expect(stubLogger).to.have.been.calledOnce;
        expect(stubSingleKey).to.have.been.calledOnce;
        expect(stubSingleKey).to.have.been.calledWith('mockAppId', 'mockKeyId', 'mockKeyType', 'mockEnv');
        expect(response.text).to.include('Update key');
        expect(response).to.have.status(200);
      });
  });

  it('should serve up the delete application page on a Get', () => {
    const slug = '/manage-applications/mockAppId/mockKeyType/mockKeyId/delete/mockEnv';
    const stubSingleKey = sinon.stub(ApplicationsDeveloperService.prototype, 'getSpecificKey').returns(Promise.resolve(keyData.getRestApiKey));
    return request(app)
      .get(slug)
      .set('Cookie', signedInCookie)
      .then(response => {
        expect(stubLogger).to.have.been.calledOnce;
        expect(stubSingleKey).to.have.been.calledOnce;
        expect(stubSingleKey).to.have.been.calledWith('mockAppId', 'mockKeyId', 'mockKeyType', 'mockEnv');
        expect(response.text).to.include('Delete API client key');
        expect(response).to.have.status(200);
      });
  });

  it('should serve the update application page with an error on the /manage-applications/:appId/update/:env mount path', () => {
    const slug = '/manage-applications/app123/update/test';
    const stubSingleApplicationError = sinon.stub(ApplicationsDeveloperService.prototype, 'getApplication').rejects(new Error('Test error'));
    const stubProcessException = sinon.stub(routeUtils, 'processException')
      .returns(exceptions.genericServerException);

    return request(app)
      .get(slug)
      .set('Cookie', signedInCookie)
      .then(response => {
        expect(stubLogger).to.have.been.calledOnce;
        expect(stubSingleApplicationError).to.have.been.calledOnce;
        expect(stubProcessException).to.have.been.calledOnce;
        expect(response.text).to.include('Internal server error. Please try again');
        expect(response).to.have.status(200);
      });
  });

  it('should serve up the update key page with an error on the /manage-applications/:appId/:keyType/:keyId/update/:env mount path', () => {
    const slug = '/manage-applications/mockAppId/mockKeyType/mockKeyId/update/mockEnv';
    const genericServerException = exceptions.genericServerException;
    const testErr = new Error('Test error');
    const stubSingleKey = sinon.stub(ApplicationsDeveloperService.prototype, 'getSpecificKey')
      .rejects(testErr);
    const stubProcessException = sinon.stub(routeUtils, 'processException')
      .returns(genericServerException);
    return request(app)
      .get(slug)
      .set('Cookie', signedInCookie)
      .then(response => {
        expect(stubLogger).to.have.been.calledOnce;
        expect(stubSingleKey).to.have.been.calledOnce;
        expect(stubSingleKey).to.have.been.calledWith('mockAppId', 'mockKeyId', 'mockKeyType', 'mockEnv');
        expect(stubProcessException).to.have.been.calledOnce;
        expect(stubProcessException).to.have.been.calledWith(testErr);
        expect(response.text).to.include('Internal server error. Please try again');
        expect(response).to.have.status(200);
      });
  });

  it('should serve up the delete key page on the delete path when got with an error', () => {
    const slug = '/manage-applications/mockAppId/mockKeyType/mockKeyId/delete/mockEnv';
    const genericServerException = exceptions.genericServerException;
    const testErr = new Error('Test error');
    const stubSingleKey = sinon.stub(ApplicationsDeveloperService.prototype, 'getSpecificKey')
      .rejects(testErr);
    const stubProcessException = sinon.stub(routeUtils, 'processException')
      .returns(genericServerException);
    return request(app)
      .get(slug)
      .set('Cookie', signedInCookie)
      .then(response => {
        expect(stubLogger).to.have.been.calledOnce;
        expect(stubSingleKey).to.have.been.calledOnce;
        expect(stubSingleKey).to.have.been.calledWith('mockAppId', 'mockKeyId', 'mockKeyType', 'mockEnv');
        expect(stubProcessException).to.have.been.calledOnce;
        expect(stubProcessException).to.have.been.calledWith(testErr);
        expect(response.text).to.include('Internal server error. Please try again');
        expect(response).to.have.status(200);
      });
  });

  it('should update an application on the test environment and redirect to the application overview page on the /manage-applications mount path', () => {
    const slug = '/manage-applications/app123/update/test';
    process.env.FUTURE_DISPLAY_FLAG = 'true';
    const stubValidateApplicationValidator = sinon.stub(Validator.prototype, 'updateApplication').returns(Promise.resolve(true));
    const stubUpdate = sinon.stub(ApplicationsDeveloperService.prototype, 'updateApplication').returns(Promise.resolve(true));
    const stubNotifications = sinon.stub(NotificationService.prototype, 'notify');
    return request(app)
      .post(slug)
      .set('Cookie', signedInCookie)
      .send(routeData.updateApplication)
      .then(response => {
        expect(stubLogger).to.have.callCount(4);
        expect(stubValidateApplicationValidator).to.have.been.calledOnce;
        expect(stubValidateApplicationValidator).to.have.been.calledWith(routeData.updateApplication);
        expect(stubUpdate).to.have.been.calledOnce;
        expect(response).to.redirectTo(/manage-applications\/app123\/view\/test/);
        expect(response).to.have.status(200);
        expect(stubNotifications).to.have.been.calledOnce;
      });
  });

  it('should serve the update application page on the /manage-applications/:appId/update/:env with errors', () => {
    const slug = '/manage-applications/app123/update/test';
    const stubValidatorError = sinon.stub(Validator.prototype, 'updateApplication').rejects(new Error('Validation error'));
    const stubProcessException = sinon.stub(routeUtils, 'processException').returns(exceptions.validationException.stack);
    const stubUpdate = sinon.stub(ApplicationsDeveloperService.prototype, 'updateApplication').returns(Promise.resolve(true));

    return request(app)
      .post(slug)
      .set('Cookie', signedInCookie)
      .send(routeData.updateApplication)
      .then(response => {
        expect(stubLogger).to.have.been.calledOnce;
        expect(stubValidatorError).to.have.been.calledOnce;
        expect(stubValidatorError).to.have.been.calledWith(routeData.updateApplication);
        expect(stubProcessException).to.have.been.calledOnce;
        expect(stubUpdate).to.not.have.been.called;
        expect(response).to.have.status(200);
        expect(response.text).to.include('Summary message for sample field');
      });
  });

  it('should serve the update key page on the /manage-applications/:appId/:keyType/:keyId/update/:env with errors', () => {
    const slug = '/manage-applications/app123/rest/key123/update/test';
    const stubValidatorError = sinon.stub(Validator.prototype, 'updateKey').rejects(new Error('Validation error'));
    const stubProcessException = sinon.stub(routeUtils, 'processException').returns(exceptions.validationException.stack);
    const stubUpdate = sinon.stub(ApplicationsDeveloperService.prototype, 'updateKey').returns(Promise.resolve(true));

    return request(app)
      .post(slug)
      .set('Cookie', signedInCookie)
      .send(routeData.updateKey)
      .then(response => {
        expect(stubLogger).to.have.been.calledOnce;
        expect(stubValidatorError).to.have.been.calledOnce;
        expect(stubValidatorError).to.have.been.calledWith(routeData.updateKey);
        expect(stubProcessException).to.have.been.calledOnce;
        expect(stubUpdate).to.not.have.been.called;
        expect(response).to.have.status(200);
        expect(response.text).to.include('Summary message for sample field');
      });
  });

  it('should serve up the delete a key and then redirect to view application that owned the key on success', () => {
    const slug = '/manage-applications/mockAppId/mockKeyType/mockKeyId/delete/mockEnv';
    const stubDeleteKey = sinon.stub(ApplicationsDeveloperService.prototype, 'deleteApiKey').returns(Promise.resolve(true));
    const stubGetApplications = sinon.stub(ApplicationsDeveloperService.prototype, 'getApplication').returns(Promise.resolve(true));
    const stubGetApplicationKeyss = sinon.stub(ApplicationsDeveloperService.prototype, 'getKeysForApplication').returns(Promise.resolve(true));
    const stubNotifications = sinon.stub(NotificationService.prototype, 'notify');
    return request(app)
      .post(slug)
      .set('Cookie', signedInCookie)
      .then(response => {
        expect(stubLogger).to.have.been.calledTwice;
        expect(stubDeleteKey).to.have.been.calledOnce;
        expect(stubDeleteKey).to.have.been.calledWith('mockAppId', 'mockKeyId', 'mockKeyType', 'mockEnv');
        expect(response).to.redirectTo(/manage-applications\/mockAppId\/view\/mockEnv/g);
        expect(stubNotifications).to.have.been.calledOnce;
      });
  });
  it('should serve up the delete key page on the delete path when got with an error', () => {
    const slug = '/manage-applications/mockAppId/mockKeyType/mockKeyId/delete/mockEnv';
    const genericServerException = exceptions.genericServerException;
    const testErr = new Error('Test error');
    const stubDeleteKey = sinon.stub(ApplicationsDeveloperService.prototype, 'deleteApiKey')
      .rejects(testErr);
    const stubProcessException = sinon.stub(routeUtils, 'processException')
      .returns(genericServerException);
    return request(app)
      .post(slug)
      .set('Cookie', signedInCookie)
      .then(response => {
        expect(stubLogger).to.have.been.calledOnce;
        expect(stubDeleteKey).to.have.been.calledOnce;
        expect(stubDeleteKey).to.have.been.calledWith('mockAppId', 'mockKeyId', 'mockKeyType', 'mockEnv');
        expect(stubProcessException).to.have.been.calledOnce;
        expect(stubProcessException).to.have.been.calledWith(testErr);
        expect(response.text).to.include('Internal server error. Please try again');
        expect(response).to.have.status(200);
      });
  });
  it('should serve up the add new key page', () => {
    const slug = '/manage-applications/mockAppId/api-key/add/mockEnv';
    return request(app)
      .get(slug)
      .set('Cookie', signedInCookie)
      .then(response => {
        expect(stubLogger).to.have.been.calledOnce;
        expect(response.text).to.include('New API client key');
        expect(response).to.have.status(200);
      });
  });
  it('should save a rest key and redirect to the view application page on the /manage-applications mount path', () => {
    const slug = '/manage-applications/mockAppId/api-key/add/mockEnv';
    const stubAddKeyValidator = sinon.stub(Validator.prototype, 'addNewKey').returns(Promise.resolve(true));
    const stubSave = sinon.stub(ApplicationsDeveloperService.prototype, 'addNewRestKey').returns(Promise.resolve(true));
    const stubGetList = sinon.stub(ApplicationsDeveloperService.prototype, 'getKeysForApplication')
      .returns(Promise.resolve(keyData.getApiKeyList));
    const stubNotifications = sinon.stub(NotificationService.prototype, 'notify');
    return request(app)
      .post(slug)
      .set('Cookie', signedInCookie)
      .send(routeData.addNewKey)
      .then(response => {
        expect(stubLogger).to.have.been.calledThrice;
        expect(stubAddKeyValidator).to.have.been.calledOnce;
        expect(stubAddKeyValidator).to.have.been.calledWith(routeData.addNewKey);
        expect(stubSave).to.have.been.calledOnce;
        expect(response).to.redirectTo(/manage-applications\/mockAppId\/view\/mockEnv/g);
        expect(stubGetList).to.have.been.calledOnce;
        expect(response).to.have.status(200);
        expect(stubNotifications).to.have.been.calledOnce;
      });
  });
  it('should serve add new key with an error on validation', () => {
    const slug = '/manage-applications/mockAppId/api-key/add/mockEnv';
    const validationException = exceptions.validationException;
    const stubValidatorReject = sinon.stub(Validator.prototype, 'addNewKey').rejects(new Error('Validation error'));
    const stubProcessException = sinon.stub(routeUtils, 'processException').returns(validationException.stack);
    const stubSave = sinon.stub(ApplicationsDeveloperService.prototype, 'addNewRestKey').returns(Promise.resolve(true));
    const stubGetList = sinon.stub(ApplicationsDeveloperService.prototype, 'getKeysForApplication')
      .returns(Promise.resolve(keyData.getApiKeyList));
    return request(app)
      .post(slug)
      .set('Cookie', signedInCookie)
      .send(routeData.addNewKey)
      .then(response => {
        expect(stubLogger).to.have.been.calledOnce;
        expect(stubValidatorReject).to.have.been.calledOnce;
        expect(stubValidatorReject).to.have.been.calledWith(routeData.addNewKey);
        expect(stubProcessException).to.have.been.calledOnce;
        expect(response).to.have.status(200);
        expect(response.text).to.include('Summary message for sample field');
        expect(stubSave).to.not.have.been.called;
        expect(stubGetList).to.not.have.been.called;
      });
  });

  it('should delete an application and then redirect to /manage-applications', () => {
    const slug = '/manage-applications/mockAppId/delete/mockEnv';
    const stubDeleteApplication = sinon.stub(ApplicationsDeveloperService.prototype, 'deleteApplication').returns(Promise.resolve(true));
    const stubNotifications = sinon.stub(NotificationService.prototype, 'notify');
    return request(app)
      .post(slug)
      .set('Cookie', signedInCookie)
      .then(response => {
        expect(stubLogger).to.have.callCount(5);
        expect(stubDeleteApplication).to.have.been.calledOnce;
        expect(stubDeleteApplication).to.have.been.calledWith('mockAppId', 'mockEnv');
        expect(response).to.redirectTo(/manage-applications/);
        expect(response).to.have.status(200);
        expect(stubNotifications).to.have.been.calledOnce;
      });
  });

  it('When delete application errors it should serve the manage applications page with errors', () => {
    const slug = '/manage-applications/mockAppId/delete/mockEnv';
    const stubDeleteApplication = sinon.stub(ApplicationsDeveloperService.prototype, 'deleteApplication').rejects(new Error('Generic error'));
    const stubProcessException = sinon.stub(routeUtils, 'processException').returns(exceptions.genericServerException);

    return request(app)
      .post(slug)
      .set('Cookie', signedInCookie)
      .then(response => {
        expect(stubLogger).to.have.been.calledOnce;
        expect(stubDeleteApplication).to.have.been.calledOnce;
        expect(stubDeleteApplication).to.have.been.calledWith('mockAppId', 'mockEnv');
        expect(stubProcessException).to.have.been.calledOnce;
        expect(response).to.have.status(200);
        expect(response.text).to.include('Internal server error. Please try again');
      });
  });

  it('should serve up the confirm delete application page on a Get', () => {
    const slug = '/manage-applications/mockAppId/update/mockEnv/confirm';
    const stubSingleKey = sinon.stub(ApplicationsDeveloperService.prototype, 'getApplication').returns(Promise.resolve(singleAppData.singleApp));
    return request(app)
      .get(slug)
      .set('Cookie', signedInCookie)
      .then(response => {
        expect(stubLogger).to.have.been.calledOnce;
        expect(stubSingleKey).to.have.been.calledOnce;
        expect(stubSingleKey).to.have.been.calledWith('mockAppId', 'mockEnv');
        expect(response.text).to.include('Are you sure you want to delete this application?');
        expect(response).to.have.status(200);
      });
  });
});
