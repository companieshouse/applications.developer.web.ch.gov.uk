describe('lib/Utility', () => {
  const logger = require(`${serverRoot}/config/winston`);
  const { genericServerException, serviceException, validationException, exceptionWithNoStatus } = require(`${testRoot}/server/_fakes/mocks`);

  const ModuleUnderTest = require(`${serverRoot}/lib/Utility`);

  const chai = require('chai');
  const assert = chai.assert;

  beforeEach(() => {
    sinon.reset();
    sinon.restore();
  });

  afterEach(done => {
    sinon.reset();
    sinon.restore();
    done();
  });

  describe('get randomString', () => {
    it('should return a random alphanumeric string', () => {
      expect(ModuleUnderTest.getRandomString(5, 8)).to.have.lengthOf.within(5, 8);
    });
  });

  describe('log an exception', () => {
    it('should correctly log a generic server exception', () => {
      const stubLogger = sinon.stub(logger, 'error').returns(true);
      expect(ModuleUnderTest.logException(genericServerException)).to.be.undefined;
      expect(stubLogger).to.have.been.calledOnce;
    });

    it('should correctly log a service exception', () => {
      const stubLogger = sinon.stub(logger, 'error').returns(true);
      expect(ModuleUnderTest.logException(serviceException)).to.be.undefined;
      expect(stubLogger).to.have.been.calledOnce;
    });

    it('should correctly log a validation exception', () => {
      const stubLogger = sinon.stub(logger, 'error').returns(true);
      expect(ModuleUnderTest.logException(validationException)).to.be.undefined;
      expect(stubLogger).to.have.been.calledOnce;
    });

    it('should correctly log an exception with no status or statusCode fields', () => {
      const stubLogger = sinon.stub(logger, 'error').returns(true);
      expect(ModuleUnderTest.logException(exceptionWithNoStatus)).to.be.undefined;
      expect(stubLogger).to.have.been.calledOnce;
    });

    it('splitString should return the string as an array with one entry', () => {
      const restrictedIp = '1.1.1';
      const expected = ['1.1.1'];
      const actual = ModuleUnderTest.splitString(restrictedIp);
      assert.equal(expected.length, actual.length);
      assert.equal(expected[0], actual[0]);
    });

    it('splitString should return the string as an array with two entries', () => {
      const restrictedIp = '1.1.1.1,2.2.2.2';
      const expected = ['1.1.1.1', '2.2.2.2'];
      const actual = ModuleUnderTest.splitString(restrictedIp);
      assert.equal(expected.length, actual.length);
    });

    it('splitString should return an empty array when a null value is passed;', () => {
      const restrictedIp = null;
      const emptyArray = ModuleUnderTest.splitString(restrictedIp);
      assert.isEmpty(emptyArray);
    });
  });
});
