const Utility = require(`${serverRoot}/lib/Utility`);
// const Session = require(`${serverRoot}/lib/Session`);
const logger = require(`${serverRoot}/config/winston`);
const errorManifest = require(`${serverRoot}/lib/errors/error_manifest`);

const Validator = require(`${serverRoot}/lib/validation/form_validators/ManageApplication`);
const validator = new Validator();

const ApplicationsDeveloperService = require(`${serverRoot}/services/ApplicationsDeveloper`);
const applicationsDeveloperService = new ApplicationsDeveloperService();

const serviceData = require(`${testRoot}/server/_fakes/data/services/manage_applications`);
const routeData = require(`${testRoot}/server/_fakes/data/routes/application`);

const routeUtils = require(`${serverRoot}/routes/utils`);
const app = require(`${serverRoot}/app`);

let stubLogger,
  stubAddApplicationValidator,
  stubSave;

const cookieStr = 'AD_SID=abc123';

describe('routes/applications.js', () => {
  beforeEach(done => {
    sinon.reset();
    sinon.restore();
    sinon.stub(Utility, 'logException').returns(undefined);
    stubLogger = sinon.stub(logger, 'info').returns(true);

    stubAddApplicationValidator = sinon.stub(Validator.prototype, 'addApplication').returns(Promise.resolve(true));
    stubSave = sinon.stub(ApplicationsDeveloperService.prototype, 'save').returns(Promise.resolve(true));
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

//LOOK OVER IN SESSION - ERROR PATH
  it.only('should serve up the applications index page on the /manage-applications path with an error', () => {
    const slug = '/manage-applications';
    const stubGetListReject = sinon.stub(ApplicationsDeveloperService.prototype, 'getList')
       .rejects(new Error('Test error'));
    const stubProcessException = sinon.stub(routeUtils, 'processException')
         .returns(errorManifest.generic.serverError);
    return request(app)
      .get(slug)
      .set('Cookie', cookieStr)
      .then(response => {
        expect(stubLogger).to.have.been.calledOnce;
        expect(stubGetListReject).to.have.been.called;
        expect(stubProcessException).to.have.been.calledOnce;
        //expect(response.text).to.include('Internal server error. Please try again');
        expect(response).to.have.status(200);
      });
  });


  it('should save an application and redirect to the application overview page on the /manage-applications/add mount path', () => {
    const slug = '/manage-applications/add';
    return request(app)
      .post(slug)
      .set('Cookie', cookieStr)
      .send(routeData.addApplication)
      .then(response => {
      /*  const stubAddApplicationValidator = sinon.stub(Validator.prototype, 'addApplication').returns(Promise.resolve(true));
        const stubSave = sinon.stub(applicationsDeveloperService, 'save').returns(Promise.resolve(true));*/
        expect(response).to.have.status(200);
        expect(stubLogger).to.have.been.calledTwice;
        expect(stubAddApplicationValidator).to.have.been.calledOnce;
        expect(stubSave).to.have.been.calledOnce;
        //expect(response).to.redirectTo('()\/manage-applications/g');
      });
  });

  //ERROR PATH ADD - GET

  it('should serve up the add application page', () => {
    const slug = '/manage-applications/add';
    return request(app)
      .get(slug)
      .set('Cookie', cookieStr)
      .then(response => {
        /* const stubGetList = sinon.stub(ApplicationsDeveloperService.prototype, 'getList')
           .returns(Promise.resolve(serviceData.getList));*/
        expect(response).to.have.status(200);
        expect(stubLogger).to.have.been.calledOnce;
        expect(response.text).to.include('New application');
      });
  });
  it('should save an application and redirect to the application overview page on the /manage-applications/add mount path', () => {
    const slug = '/manage-applications/add';
    return request(app)
      .post(slug)
      .set('Cookie', cookieStr)
      .send(routeData.addApplication)
      .then(response => {
        /*  const stubAddApplicationValidator = sinon.stub(Validator.prototype, 'addApplication').returns(Promise.resolve(true));
          const stubSave = sinon.stub(applicationsDeveloperService, 'save').returns(Promise.resolve(true));*/
        expect(response).to.have.status(200);
        expect(stubLogger).to.have.been.calledTwice;
        expect(stubAddApplicationValidator).to.have.been.calledOnce;
        expect(stubSave).to.have.been.calledOnce;
        expect(response).to.redirectTo('/[.]*\/manage-applications/g');
      });
  });
  //LOOK OVER IN SESSION - UHAPPY PATH POST

  it('should serve up the view applications page', () => {
    const slug = '/manage-applications/:appId/view';
    return request(app)
      .get(slug)
      .set('Cookie', cookieStr)
      .then(response => {
        expect(response).to.have.status(200);
        expect(stubLogger).to.have.been.calledOnce;
        expect(response.text).to.include('Application details');
        expect(response.text).to.include('Keys for this application');
      });
  });
  //LOOK OVER IN SESSION - UNHAPPY PATH VIEW APPLICATIONS PAGE

});
