const logger = require(`${serverRoot}/config/winston`);
const errorManifest = require(`${serverRoot}/lib/errors/error_manifest`).validation;
const Validator = require(`${serverRoot}/lib/validation`);
const validator = new Validator();

describe.skip('server/lib/validation/applications', () => {
  let stubLogger;

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

  it('should validate a correctly formatted contact name', () => {
    expect(validator.isValidContactName('valid name')).to.eventually.equal(true);
    expect(validator.isValidContactName('valid hyphenated-name')).to.eventually.equal(true);
    expect(validator.isValidContactName('valid quoted\'name')).to.eventually.equal(true);
    expect(stubLogger).to.have.been.calledThrice;
  });

  it('should validate and return an error if contact name is not correctly formatted', () => {
    const errors = {};
    errors.fullName = errorManifest.fullName.incorrect;
    expect(validator.isValidContactName('-日女子أَبْجَدِيّ')).to.be.rejectedWith(errors);
    expect(stubLogger).to.have.been.calledOnce;
  });

  it('should validate and return an error for blank contact name', () => {
    const errors = {};
    errors.fullName = errorManifest.fullName.blank;
    expect(validator.isValidContactName('')).to.be.rejectedWith(errors);
    expect(validator.isValidContactName(undefined)).to.be.rejectedWith(errors);
    expect(validator.isValidContactName(null)).to.be.rejectedWith(errors);
    expect(stubLogger).to.have.been.calledThrice;
  });

  it('should validate a correctly formatted email', () => {
    expect(validator.isValidEmail('matt@matt.com')).to.eventually.equal(true);
    expect(validator.isValidEmail('matt-matt@matt.com')).to.eventually.equal(true);
    expect(stubLogger).to.have.been.calledTwice;
  });

  it('should validate and return an error if email address is not correctly formatted', () => {
    const errors = {};
    errors.email = errorManifest.email.incorrect;
    expect(validator.isValidEmail('matt.com')).to.be.rejectedWith(errors);
    expect(stubLogger).to.have.been.calledOnce;
  });

  it('should validate and return an error for blank email addresses', () => {
    const errors = {};
    errors.email = errorManifest.email.blank;
    expect(validator.isValidEmail('')).to.be.rejectedWith(errors);
    expect(validator.isValidEmail(undefined)).to.be.rejectedWith(errors);
    expect(validator.isValidEmail(null)).to.be.rejectedWith(errors);
    expect(stubLogger).to.have.been.calledThrice;
  });

  it('should validate that the company number entered is 8 characters long', () => {
    expect(validator.isValidCompanyNumber('12345678')).to.eventually.equal(true);
    expect(validator.isValidCompanyNumber('AB123456')).to.eventually.equal(true);
    expect(stubLogger).to.have.been.calledTwice;
  });

  it('should validate company number has no text or is undefined or null', () => {
    const errors = {};
    errors.number = errorManifest.number.empty;
    expect(validator.isValidCompanyNumber('')).to.be.rejectedWith(errors);
    expect(validator.isValidCompanyNumber(undefined)).to.be.rejectedWith(errors);
    expect(validator.isValidCompanyNumber(null)).to.be.rejectedWith(errors);
    expect(stubLogger).to.have.been.calledThrice;
  });

  it('should validate company number is 8 characters long', () => {
    const errors = {};
    errors.number = errorManifest.number.incorrect;
    expect(validator.isValidCompanyNumber('1234567')).to.be.rejectedWith(errors);
    expect(validator.isValidCompanyNumber('123456789')).to.be.rejectedWith(errors);
    expect(stubLogger).to.have.been.calledTwice;
  });
});
