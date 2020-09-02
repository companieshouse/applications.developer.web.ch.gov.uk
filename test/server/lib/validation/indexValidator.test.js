const logger = require(`${serverRoot}/config/winston`);
const Validator = require(`${serverRoot}/lib/validation`);
const validator = new Validator();

describe('server/lib/validation/applications', () => {
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

  it('should validate a correctly formatted app  name', () => {
    expect(validator.isValidAppName('app name')).to.equal(true);
    expect(validator.isValidAppName('valid hyphenated-name')).to.equal(true);
    expect(validator.isValidAppName('valid quoted\'name')).to.equal(true);
    expect(stubLogger).to.have.been.calledThrice;
  });
  it('should validate and return an error for blank app name', () => {
    expect(validator.isValidAppName('')).to.equal(false);
    // expect(validator.isValidAppName(undefined)).to.equal(false);
    // expect(validator.isValidAppName(null)).to.equal(false);
    expect(stubLogger).to.have.been.calledOnce;
  });

  it('should validate a correctly formatted app description', () => {
    expect(validator.isValidDescription('Lorem ipsum dolor sit amet consectetur adipiscing elit.')).to.equal(true);
    expect(validator.isValidDescription('Lorem-ipsum HYPHEN not allowed.')).to.equal(true);
    expect(validator.isValidDescription('Lorem ipsum\'s QUOTE not allowed.')).to.equal(true);
    expect(stubLogger).to.have.been.calledThrice;
  });
  it('should validate and return an error for an invalid description', () => {
    expect(validator.isValidDescription('')).to.equal(false);
    // expect(validator.isValidAppName(undefined)).to.equal(false);
    // expect(validator.isValidAppName(null)).to.equal(false);
    expect(stubLogger).to.have.been.calledOnce;
  });

  it('should validate a correctly formatted Url', () => {
    expect(validator.isValidUrl('https://example.com')).to.equal(true);
    expect(validator.isValidUrl('example.com')).to.equal(true);
    expect(stubLogger).to.have.been.calledTwice;
  });
  it('should validate and return an error for an invalid Url', () => {
    expect(validator.isValidUrl('')).to.equal(false);
    expect(validator.isValidUrl('/example')).to.equal(false);
    expect(validator.isValidUrl(null)).to.equal(false);
    expect(stubLogger).to.have.been.calledThrice;
  });

  it.skip('should validate a correctly formatted domain', () => {
    // regex not completed
    expect(validator.isValidDomain('d')).to.equal(true);
    expect(stubLogger).to.have.been.calledOnce;
  });

  it.skip('should validate and return an error for an invalid domain', () => {
    expect(validator.isValidDomain('')).to.equal(false);
    expect(validator.isValidDomain(null)).to.equal(false);
    expect(stubLogger).to.have.been.calledTwice;
  });

  it('should validate a correctly formatted Ip', () => {
    expect(validator.isValidIp('204.120.0.15')).to.equal(true);
    expect(validator.isValidIp('127.0.0.1')).to.equal(true);
    expect(stubLogger).to.have.been.calledTwice;
  });
  it('should validate and return an error for an invalid Ip', () => {
    expect(validator.isValidIp('')).to.equal(false);
    expect(validator.isValidIp('25555.2335.11344.2344')).to.equal(false);
    expect(validator.isValidIp(null)).to.equal(false);
    expect(stubLogger).to.have.been.calledThrice;
  });
});
