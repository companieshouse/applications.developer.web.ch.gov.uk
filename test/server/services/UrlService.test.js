const UrlService = require(`${serverRoot}/services/UrlService`);
const urlService = new UrlService();

describe('services/UrlService', () => {
  beforeEach(done => {
    sinon.reset();
    sinon.restore();
    done();
  });

  afterEach(done => {
    sinon.reset();
    sinon.restore();
    done();
  });

  it('should correctly get the test URL when test is requested', () => {
    expect(urlService.getUrlForEnv('test'))
      .to.equal(process.env.APPLICATIONS_DEVELOPER_SERVICE_TEST_BASE_URL);
  });
  it('should correctly get the live URL when live is requested', () => {
    expect(urlService.getUrlForEnv('live'))
      .to.equal(process.env.APPLICATIONS_DEVELOPER_SERVICE_LIVE_BASE_URL);
  });
  it('should correctly get the future URL when future is requested', () => {
    expect(urlService.getUrlForEnv('future'))
      .to.equal(process.env.APPLICATIONS_DEVELOPER_SERVICE_FUTURE_BASE_URL);
  });
});
