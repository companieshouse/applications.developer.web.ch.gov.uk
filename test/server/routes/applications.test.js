const logger = require(`${serverRoot}/config/winston`);
const Utility = require(`${serverRoot}/lib/Utility`);
// const Session = require(`${serverRoot}/lib/Session`);
let stubLogger;

const errorManifest = require(`${serverRoot}/lib/errors/error_manifest`).validation;
const Validator = require(`${serverRoot}/lib/validation`);
const validator = new Validator();
const ApplicationsDeveloperService = require(`${serverRoot}/services/ApplicationsDeveloper`);
const applicationsDeveloperService = new ApplicationsDeveloperService();
const app = require(`${serverRoot}/app`);
const serviceData = require(`${testRoot}/server/_fakes/data/services/manage_applications`);

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

  it.only('should serve up the applications page with no mount path', () => {
    const slug = '/manage-applications';
    return request(app)
      .get(slug)
      .set('Cookie', cookieStr)
      .then(response => {
        const stubApplicationsDeveloperService = sinon.stub(ApplicationsDeveloperService.prototype, 'getList')
          .returns(Promise.resolve(serviceData.getList));
        expect(response).to.have.status(200);
        expect(stubLogger).to.have.been.called;//Look at this
        expect(stubApplicationsDeveloperService).to.have.been.calledThrice;
      });
  });

});
