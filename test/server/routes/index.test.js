const logger = require(`${serverRoot}/config/winston`);
const Utility = require(`${serverRoot}/lib/Utility`);
const Session = require(`${serverRoot}/lib/Session`);
let stubLogger;

const errorManifest = require(`${serverRoot}/lib/errors/error_manifest`).validation;
const Validator = require(`${serverRoot}/lib/validation`);
const validator = new Validator();

const app = require(`${serverRoot}/app`);

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

  it.skip('should serve up the index page with no mount path', () => {
    const slug = '/';
    return request(app)
      .get(slug)
      .set('Cookie', cookieStr)
      .then(response => {
        expect(response).to.have.status(200);
        expect(stubLogger).to.have.been.calledOnce;
      });
  });

});
