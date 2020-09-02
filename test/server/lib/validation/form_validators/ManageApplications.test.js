const ManageApplication = require(`${serverRoot}/lib/validation/form_validators/ManageApplication`);
const Validator = require(`${serverRoot}/lib/validation`);
const logger = require(`${serverRoot}/config/winston`);
const routeData = require(`${testRoot}/server/_fakes/data/routes/application`);
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
    const stubValidName = sinon.stub(Validator.prototype, 'isValidAppName').returns(true);
    const stubValidDesc = sinon.stub(Validator.prototype, 'isValidDescription').returns(true);
    const stubValidUrl = sinon.stub(Validator.prototype, 'isValidUrl').returns(true);
    const stubKeys = sinon.stub(ManageApplication.prototype, '_formatIncomingPayload').returns(routeData.addApplication);
    expect(ManageApplication.prototype.addApplication(payload)).to.eventually.equal(true);
    expect(stubValidName).to.have.been.calledOnce;
    expect(stubValidDesc).to.have.been.calledOnce;
    expect(stubKeys).to.have.been.calledOnce;
    expect(stubValidUrl).to.have.been.calledTwice;
    expect(stubLogger).to.have.been.calledOnce;
  });
  it('should validate the addApplication and return invalid environment validation error', () => {
    const payload = {
      applicationName: 'name',
      terms: '',
      privacyPolicy: '',
      environment: ''
    };
    const validationException = exceptions.validationException;
    const stubValidName = sinon.stub(Validator.prototype, 'isValidAppName').returns(true);
    const stubValidDesc = sinon.stub(Validator.prototype, 'isValidDescription').returns(true);
    const stubKeys = sinon.stub(ManageApplication.prototype, '_formatIncomingPayload').returns(routeData.addApplication);
    expect(ManageApplication.prototype.addApplication(payload)).to.be.rejectedWith(validationException);
    expect(stubValidName).to.have.been.calledOnce;
    expect(stubValidDesc).to.have.been.calledOnce;
    expect(stubKeys).to.have.been.calledOnce;
    expect(stubLogger).to.have.been.calledTwice;
  });

  it('should validate the addApplication and return blank name validation error, ', () => {
    const payload = {
      applicationName: '',
      terms: '',
      privacyPolicy: '',
      environment: 'test'
    };
    const validationException = exceptions.validationException;
    const stubValidName = sinon.stub(Validator.prototype, 'isValidAppName').returns(false);
    const stubValidDesc = sinon.stub(Validator.prototype, 'isValidDescription').returns(true);
    const stubKeys = sinon.stub(ManageApplication.prototype, '_formatIncomingPayload').returns(routeData.addApplication);
    expect(ManageApplication.prototype.addApplication(payload)).to.be.rejectedWith(validationException);
    expect(stubValidName).to.have.been.calledOnce;
    expect(stubValidDesc).to.have.been.calledOnce;
    expect(stubKeys).to.have.been.calledOnce;
    expect(stubLogger).to.have.been.calledTwice;
  });
  it('should validate the addApplication and return invalid name validation error, ', () => {
    const payload = {
      applicationName: ')))))(((((******INVALID_NAME',
      terms: '',
      privacyPolicy: '',
      environment: 'test'
    };
    const validationException = exceptions.validationException;
    const stubValidName = sinon.stub(Validator.prototype, 'isValidAppName').returns(false);
    const stubValidDesc = sinon.stub(Validator.prototype, 'isValidDescription').returns(true);
    const stubKeys = sinon.stub(ManageApplication.prototype, '_formatIncomingPayload').returns(routeData.addApplication);
    expect(ManageApplication.prototype.addApplication(payload)).to.be.rejectedWith(validationException);
    expect(stubValidName).to.have.been.calledOnce;
    expect(stubValidDesc).to.have.been.calledOnce;
    expect(stubKeys).to.have.been.calledOnce;
    expect(stubLogger).to.have.been.calledTwice;
  });

  it('should validate the addApplication and return blank description validation error, ', () => {
    const payload = {
      applicationName: 'name',
      description: '',
      terms: '',
      privacyPolicy: '',
      environment: 'test'
    };
    const validationException = exceptions.validationException;
    const stubValidName = sinon.stub(Validator.prototype, 'isValidAppName').returns(true);
    const stubValidDesc = sinon.stub(Validator.prototype, 'isValidDescription').returns(false);
    const stubKeys = sinon.stub(ManageApplication.prototype, '_formatIncomingPayload').returns(routeData.addApplication);
    expect(ManageApplication.prototype.addApplication(payload)).to.be.rejectedWith(validationException);
    expect(stubValidName).to.have.been.calledOnce;
    expect(stubValidDesc).to.have.been.calledOnce;
    expect(stubKeys).to.have.been.calledOnce;
    expect(stubLogger).to.have.been.calledTwice;
  });
  it('should validate the addApplication and return invalid description validation error, ', () => {
    const payload = {
      applicationName: 'name',
      description: '//@,///w//w/w/////////1!',
      terms: '',
      privacyPolicy: '',
      environment: 'test'
    };
    const validationException = exceptions.validationException;
    const stubValidName = sinon.stub(Validator.prototype, 'isValidAppName').returns(true);
    const stubValidDesc = sinon.stub(Validator.prototype, 'isValidDescription').returns(false);
    const stubKeys = sinon.stub(ManageApplication.prototype, '_formatIncomingPayload').returns(routeData.addApplication);
    expect(ManageApplication.prototype.addApplication(payload)).to.be.rejectedWith(validationException);
    expect(stubValidName).to.have.been.calledOnce;
    expect(stubValidDesc).to.have.been.calledOnce;
    expect(stubKeys).to.have.been.calledOnce;
    expect(stubLogger).to.have.been.calledTwice;
  });

  it('should validate the addApplication and return invalid Url validation error, ', () => {
    const payload = {
      applicationName: 'name',
      description: 'hi',
      terms: 'thisIsInvalidUrl',
      privacyPolicy: 'AlsoAnInvalidUrl',
      environment: 'test'
    };
    const validationException = exceptions.validationException;
    const stubValidName = sinon.stub(Validator.prototype, 'isValidAppName').returns(true);
    const stubValidDesc = sinon.stub(Validator.prototype, 'isValidDescription').returns(true);
    const stubValidUrl = sinon.stub(Validator.prototype, 'isValidUrl').returns(false);
    const stubKeys = sinon.stub(ManageApplication.prototype, '_formatIncomingPayload').returns(routeData.addApplication);
    expect(ManageApplication.prototype.addApplication(payload)).to.be.rejectedWith(validationException);
    expect(stubValidName).to.have.been.calledOnce;
    expect(stubValidUrl).to.have.been.calledTwice;
    expect(stubValidDesc).to.have.been.calledOnce;
    expect(stubKeys).to.have.been.calledOnce;
    expect(stubLogger).to.have.been.calledTwice;
  });
});
