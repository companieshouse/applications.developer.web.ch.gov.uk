const ManageApplication = require(`${serverRoot}/lib/validation/form_validators/ManageApplication`);
const Validator = require(`${serverRoot}/lib/validation`);
const logger = require(`${serverRoot}/config/winston`);
const routeData = require(`${testRoot}/server/_fakes/data/routes/application`);
const exceptions = require(`${testRoot}/server/_fakes/mocks`);
let stubLogger;
describe('server/lib/validation/form_validators/ManageApplication', () => {
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

  it('_formatIncomingPayload should return the payload that has been formatted to trim ', () => {
    const manageApplication = new ManageApplication();
    const payload = {
      applicationName: '    hi',
      terms: 'https://eg.com    ',
      privacyPolicy: '  https://eg.com',
      environment: 'test   '
    };
    manageApplication._formatIncomingPayload(payload);
    expect(payload.applicationName).to.equal('hi');
    expect(payload.terms).to.equal('https://eg.com');
    expect(payload.privacyPolicy).to.equal('https://eg.com');
    expect(payload.environment).to.equal('test');
    expect(stubLogger).to.have.been.calledOnce;
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

  it('should validate the updateApplication sucessfully, exclude the environment and return true', () => {
    const payload = {
      applicationName: 'hi',
      description: 'Test description',
      terms: 'https://eg.com',
      privacyPolicy: 'https://priv.com'
    };
    const stubValidName = sinon.stub(Validator.prototype, 'isValidAppName').returns(true);
    const stubValidDesc = sinon.stub(Validator.prototype, 'isValidDescription').returns(true);
    const stubValidUrl = sinon.stub(Validator.prototype, 'isValidUrl').returns(true);
    const stubKeys = sinon.stub(ManageApplication.prototype, '_formatIncomingPayload').returns(routeData.addApplication);
    expect(ManageApplication.prototype.updateApplication(payload)).to.eventually.equal(true);
    expect(stubValidName).to.have.been.calledOnce;
    expect(stubValidDesc).to.have.been.calledOnce;
    expect(stubKeys).to.have.been.calledOnce;
    expect(stubValidUrl).to.have.been.calledTwice;
    expect(stubLogger).to.have.been.calledOnce;
  });
  it('should validate the updateKey sucessfully, exclude the type and return true', () => {
    const payload = {
      keyName: 'test',
      description: 'Test description',
      restrictedIps: '192.168.0.1',
      javaScriptDomains: 'http://app.domain'
    };
    const stubValidName = sinon.stub(Validator.prototype, 'isValidKeyName').returns(true);
    const stubValidDesc = sinon.stub(Validator.prototype, 'isValidDescription').returns(true);
    const stubKeys = sinon.stub(ManageApplication.prototype, '_formatIncomingPayload').returns(routeData.addNewKey);
    expect(ManageApplication.prototype.updateKey(payload)).to.eventually.equal(true);
    expect(stubValidName).to.have.been.calledOnce;
    expect(stubValidDesc).to.have.been.calledOnce;
    expect(stubKeys).to.have.been.calledOnce;
    expect(stubLogger).to.have.been.calledThrice;
  });
  it('should validate the addNewKey sucessfully and return true', () => {
    const payload = {
      keyName: 'Hello',
      keyDescription: 'World',
      keyType: 'rest',
      restrictedIps: '192.168.0.1, 192.168.0.2',
      javaScriptDomains: 'http://app.domain, http://apb.domain'
    };
    const stubValidName = sinon.stub(Validator.prototype, 'isValidKeyName').returns(true);
    const stubValidDesc = sinon.stub(Validator.prototype, 'isValidDescription').returns(true);
    const stubKeys = sinon.stub(ManageApplication.prototype, '_formatIncomingPayload').returns(routeData.addNewKey);
    expect(ManageApplication.prototype.addNewKey(payload)).to.eventually.equal(true);
    expect(stubValidName).to.have.been.calledOnce;
    expect(stubValidDesc).to.have.been.calledOnce;
    expect(stubKeys).to.have.been.calledOnce;
    expect(stubLogger).to.have.callCount(6);
  });
  it('should validate the addNewKey and return invalid type validation error', () => {
    const payload = {
      keyName: 'Hello',
      keyDescription: 'World',
      keyType: '',
      restrictedIps: '',
      javaScriptDomains: ''
    };
    const validationException = exceptions.validationException;
    const stubValidName = sinon.stub(Validator.prototype, 'isValidKeyName').returns(true);
    const stubValidDesc = sinon.stub(Validator.prototype, 'isValidDescription').returns(true);
    const stubKeys = sinon.stub(ManageApplication.prototype, '_formatIncomingPayload').returns(routeData.addNewKey);
    expect(ManageApplication.prototype.addNewKey(payload)).to.be.rejectedWith(validationException);
    expect(stubValidName).to.have.been.calledOnce;
    expect(stubValidDesc).to.have.been.calledOnce;
    expect(stubKeys).to.have.been.calledOnce;
    expect(stubLogger).to.have.been.calledTwice;
  });
  it('should validate the addNewKey and return blank name validation error', () => {
    const payload = {
      keyName: '',
      keyDescription: 'World',
      keyType: 'rest',
      restrictedIps: '',
      javaScriptDomains: ''
    };
    const validationException = exceptions.validationException;
    const stubValidName = sinon.stub(Validator.prototype, 'isValidKeyName').returns(false);
    const stubValidDesc = sinon.stub(Validator.prototype, 'isValidDescription').returns(true);
    const stubKeys = sinon.stub(ManageApplication.prototype, '_formatIncomingPayload').returns(routeData.addNewKey);
    expect(ManageApplication.prototype.addNewKey(payload)).to.be.rejectedWith(validationException);
    expect(stubValidName).to.have.been.calledOnce;
    expect(stubValidDesc).to.have.been.calledOnce;
    expect(stubKeys).to.have.been.calledOnce;
    expect(stubLogger).to.have.been.calledTwice;
  });
  it('should validate the addNewKey and return invalid name validation error', () => {
    const payload = {
      keyName: ')))))(((((******INVALID_NAME',
      keyDescription: 'World',
      keyType: 'rest',
      restrictedIps: '',
      javaScriptDomains: ''
    };
    const validationException = exceptions.validationException;
    const stubValidName = sinon.stub(Validator.prototype, 'isValidKeyName').returns(false);
    const stubValidDesc = sinon.stub(Validator.prototype, 'isValidDescription').returns(true);
    const stubKeys = sinon.stub(ManageApplication.prototype, '_formatIncomingPayload').returns(routeData.addNewKey);
    expect(ManageApplication.prototype.addNewKey(payload)).to.be.rejectedWith(validationException);
    expect(stubValidName).to.have.been.calledOnce;
    expect(stubValidDesc).to.have.been.calledOnce;
    expect(stubKeys).to.have.been.calledOnce;
    expect(stubLogger).to.have.been.calledTwice;
  });
  it('should validate the addNewKey and return blank description validation error', () => {
    const payload = {
      keyName: 'Hello',
      keyDescription: '',
      keyType: 'rest',
      restrictedIps: '',
      javaScriptDomains: ''
    };
    const validationException = exceptions.validationException;
    const stubValidName = sinon.stub(Validator.prototype, 'isValidKeyName').returns(true);
    const stubValidDesc = sinon.stub(Validator.prototype, 'isValidDescription').returns(false);
    const stubKeys = sinon.stub(ManageApplication.prototype, '_formatIncomingPayload').returns(routeData.addNewKey);
    expect(ManageApplication.prototype.addNewKey(payload)).to.be.rejectedWith(validationException);
    expect(stubValidName).to.have.been.calledOnce;
    expect(stubValidDesc).to.have.been.calledOnce;
    expect(stubKeys).to.have.been.calledOnce;
    expect(stubLogger).to.have.been.calledTwice;
  });
  it('should validate the addNewKey and return invalid description validation error', () => {
    const payload = {
      keyName: 'Hello',
      keyDescription: '//@,///w//w/w/////////1!',
      keyType: 'rest',
      restrictedIps: '',
      javaScriptDomains: ''
    };
    const validationException = exceptions.validationException;
    const stubValidName = sinon.stub(Validator.prototype, 'isValidKeyName').returns(true);
    const stubValidDesc = sinon.stub(Validator.prototype, 'isValidDescription').returns(false);
    const stubKeys = sinon.stub(ManageApplication.prototype, '_formatIncomingPayload').returns(routeData.addNewKey);
    expect(ManageApplication.prototype.addNewKey(payload)).to.be.rejectedWith(validationException);
    expect(stubValidName).to.have.been.calledOnce;
    expect(stubValidDesc).to.have.been.calledOnce;
    expect(stubKeys).to.have.been.calledOnce;
    expect(stubLogger).to.have.been.calledTwice;
  });
  it('should validate the addNewKey and return invalid URI validation error', () => {
    const payload = {
      keyName: 'Hello',
      keyDescription: 'valid',
      keyType: 'web',
      redirectURIs: 'http:/[notAUri]',
      javaScriptDomains: ''
    };
    const validationException = exceptions.validationException;
    const stubValidName = sinon.stub(Validator.prototype, 'isValidKeyName').returns(true);
    const stubValidDesc = sinon.stub(Validator.prototype, 'isValidDescription').returns(true);
    const stubValidUri = sinon.stub(Validator.prototype, 'isValidRedirectUri').returns(false);
    const stubKeys = sinon.stub(ManageApplication.prototype, '_formatIncomingPayload').returns(routeData.addNewKey);
    expect(ManageApplication.prototype.addNewKey(payload)).to.be.rejectedWith(validationException);
    expect(stubValidName).to.have.been.calledOnce;
    expect(stubValidDesc).to.have.been.calledOnce;
    expect(stubValidUri).to.have.been.calledOnce;
    expect(stubKeys).to.have.been.calledOnce;
    expect(stubLogger).to.have.been.calledTwice;
  });
  it('should validate the addNewKey and return invalid URI validation error against and it should not continue testing after one failure', () => {
    const payload = {
      keyName: 'Hello',
      keyDescription: 'valid',
      keyType: 'web',
      redirectURIs: '[http://valid.com, notAUri, notAUri]',
      javaScriptDomains: ''
    };
    const validationException = exceptions.validationException;
    const stubValidName = sinon.stub(Validator.prototype, 'isValidKeyName').returns(true);
    const stubValidDesc = sinon.stub(Validator.prototype, 'isValidDescription').returns(true);
    const stubValidUrl = sinon.stub(Validator.prototype, 'isValidRedirectUri');
    stubValidUrl.onFirstCall().returns(true);
    stubValidUrl.returns(false);
    // stubValidUrl.returns(true);
    const stubKeys = sinon.stub(ManageApplication.prototype, '_formatIncomingPayload').returns(routeData.addNewKey);
    expect(ManageApplication.prototype.addNewKey(payload)).to.be.rejectedWith(validationException);
    expect(stubValidName).to.have.been.calledOnce;
    expect(stubValidDesc).to.have.been.calledOnce;
    expect(stubValidUrl).to.have.been.calledTwice;
    expect(stubKeys).to.have.been.calledOnce;
    expect(stubLogger).to.have.been.calledTwice;
  });
});
