const logger = require(`${serverRoot}/config/winston`);
const Validator = require(`${serverRoot}/lib/validation`);
const validator = new Validator();

describe('server/lib/validation/index', () => {
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

  it('getErrorSignature should return the correct values when called', () => {
    expect(validator.getErrorSignature().name).to.equal('ValidationError');
    expect(validator.getErrorSignature().status).to.equal(400);
    expect(validator.getErrorSignature().message).to.equal('Your request contains validation errors');
    expect(stubLogger).to.have.been.calledThrice;
  });
  it('should validate a correctly formatted app  name', () => {
    expect(validator.isValidAppName('app name')).to.be.true;
    expect(validator.isValidAppName('valid hyphenated-name')).to.be.true;
    expect(validator.isValidAppName('valid quoted\'name')).to.be.true;
    expect(stubLogger).to.have.been.calledThrice;
  });
  it('should validate and return an error for blank app name', () => {
    expect(validator.isValidAppName('')).to.be.false;
    expect(stubLogger).to.have.been.calledOnce;
  });
  it('should validate and return an error for an invalid app name', () => {
    expect(validator.isValidAppName(')))*//__@')).to.be.false;
    expect(stubLogger).to.have.been.calledOnce;
  });
  it('should validate a correctly formatted app description', () => {
    expect(validator.isValidDescription('Lorem ipsum dolor sit amet consectetur adipiscing elit.')).to.be.true;
    expect(validator.isValidDescription('Lorem-ipsum HYPHEN allowed.')).to.be.true;
    expect(validator.isValidDescription('Lorem ipsum\'s QUOTE allowed.')).to.be.true;
    expect(stubLogger).to.have.been.calledThrice;
  });
  it('should validate and return an error for an blank description', () => {
    expect(validator.isValidDescription('')).to.be.false;
    expect(stubLogger).to.have.been.calledOnce;
  });
  it('should validate and return an error for an invalid description', () => {
    expect(validator.isValidDescription('///))*@@£$;;;;;')).to.be.false;
    expect(stubLogger).to.have.been.calledOnce;
  });
  it('should validate a correctly formatted Url', () => {
    expect(validator.isValidUrl('https://example.com')).to.be.true;
    expect(validator.isValidUrl('example.com')).to.be.true;
    expect(stubLogger).to.have.been.calledTwice;
  });
  it('should validate and return an error for an blank or invalid Url', () => {
    expect(validator.isValidUrl('')).to.be.false;
    expect(validator.isValidUrl('/example')).to.be.false;
    expect(validator.isValidUrl(null)).to.be.false;
    expect(stubLogger).to.have.been.calledThrice;
  });
  it('should validate a correctly formatted Redirect Uri', () => {
    expect(validator.isValidRedirectUri('localhost:3000/user/callback')).to.be.true;
    expect(validator.isValidRedirectUri('https://example.com')).to.be.true;
    expect(stubLogger).to.have.been.calledTwice;
  });
  it('should validate and return an error for an blank or Redirect Uri', () => {
    expect(validator.isValidRedirectUri('@@!!()*&^%£$""><???~~`')).to.be.false;
    expect(validator.isValidRedirectUri('')).to.be.false;
    expect(stubLogger).to.have.been.calledTwice;
  });
  it('should validate a correctly formatted domain', () => {
    // regex not completed
    expect(validator.isValidDomain('https://app.com')).to.equal(true);
    expect(stubLogger).to.have.been.calledOnce;
  });
  it('should validate and return an error for an blank domain', () => {
    expect(validator.isValidDomain('')).to.be.false;
    expect(validator.isValidDomain(null)).to.be.false;
    expect(stubLogger).to.have.been.calledTwice;
  });

  it('should validate a correctly formatted Ip', () => {
    expect(validator.isValidIp('204.120.0.15')).to.be.true;
    expect(validator.isValidIp('127.0.0.1')).to.be.true;
    expect(stubLogger).to.have.been.calledTwice;
  });
  it('should validate and return an error for an blank or invalid Ip', () => {
    expect(validator.isValidIp('')).to.be.false;
    expect(validator.isValidIp('25555.2335.11344.2344')).to.be.false;
    expect(validator.isValidIp('204.120.0.15h')).to.be.false;
    expect(validator.isValidIp(null)).to.be.false;
    expect(stubLogger).to.have.callCount(4);
  });
});
