const ManageApplication = require(`${serverRoot}/lib/validation/form_validators/ManageApplication`);
const manageApplication = new ManageApplication();
const errorManifest = require(`${serverRoot}/lib/errors/error_manifest`);
const Validator = require(`${serverRoot}/lib/validation`);
const logger = require(`${serverRoot}/config/winston`);
const routeData = require(`${testRoot}/server/_fakes/data/routes/application`);
const routeUtils = require(`${serverRoot}/routes/utils`);
const exceptions = require(`${testRoot}/server/_fakes/mocks`);
let stubLogger;
describe('server/lib/validation/applications', () => {

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

  it('should validate the addApplication sucessfully and return true', () => {
    const payload = {
      applicationName: 'hi',
      terms: 'https://eg.com',
      privacyPolicy: 'https://eg.com',
      environment: 'test'
    };
    const stubValidName = sinon.stub(Validator.prototype, 'isValidAppName').returns(Promise.resolve(true));
    const stubValidDesc = sinon.stub(Validator.prototype, 'isValidDescription').returns(Promise.resolve(true));
    const stubValidUrl = sinon.stub(Validator.prototype, 'isValidUrl').returns(Promise.resolve(true));
    const stubKeys = sinon.stub(ManageApplication.prototype, '_formatIncomingPayload').returns(routeData.addApplication);
    expect(ManageApplication.prototype.addApplication(payload)).to.eventually.equal(true);
    expect(stubValidName).to.have.been.calledOnce;
    expect(stubValidDesc).to.have.been.calledOnce;
    expect(stubKeys).to.have.been.calledOnce;
    expect(stubValidUrl).to.have.been.calledTwice;
  });
  it.skip('should validate the addApplication and return invalid name validation error', () => {
    const payload = {
      applicationName: '',
      terms: '',
      privacyPolicy: '',
      environment: ''
    };
    const validationException = exceptions.genericServerException;
    const stubProcessException = sinon.stub(routeUtils, 'processException').returns(validationException.stack);
    const stubValidName = sinon.stub(Validator.prototype, 'isValidAppName').returns(Promise.resolve(true));
    const stubValidDesc = sinon.stub(Validator.prototype, 'isValidDescription').returns(Promise.resolve(true));
    const stubValidUrl = sinon.stub(Validator.prototype, 'isValidUrl').returns(Promise.resolve(true));
    const stubKeys = sinon.stub(ManageApplication.prototype, '_formatIncomingPayload').returns(routeData.addApplication);
    expect(ManageApplication.prototype.addApplication(payload)).rejects(validationException);
    expect(stubValidName).to.have.been.calledOnce;
    expect(stubValidDesc).to.have.been.calledOnce;
    expect(stubKeys).to.have.been.calledOnce;
    expect(stubValidUrl).to.have.been.calledTwice;
  });
});
