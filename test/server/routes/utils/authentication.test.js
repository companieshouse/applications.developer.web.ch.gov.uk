const Redis = require('ioredis');

const logger = require(`${serverRoot}/config/winston`);
const { sessionSignedOut, SIGNED_OUT_COOKIE } = require(`${testRoot}/server/_fakes/mocks/lib/session`);

let app;

const signedOutCookie = [`__SID=${SIGNED_OUT_COOKIE}`];

describe.only('routes/applications.js', () => {
  describe('signed out routes', () => {
    beforeEach(done => {
      sinon.reset();
      sinon.restore();
      sinon.stub(Redis.prototype, 'connect').returns(Promise.resolve());
      sinon.stub(Redis.prototype, 'get').returns(Promise.resolve(sessionSignedOut));
      app = require(`${serverRoot}/app`);

      sinon.stub(logger, 'error').returns(true);
      done();
    });

    afterEach(done => {
      sinon.reset();
      sinon.restore();
      done();
    });

    const PROTECTED_PAGES = [
      '/manage-applications',
      '/manage-applications/add',
      '/manage-applications/:appId/view/:env',
      '/manage-applications/:appId/update/:env/:confirm',
      '/manage-applications/:appId/delete',
      '/manage-applications/:appId/api-key/add',
      '/manage-applications/:appId/:keyType/:keyId/delete/:env',
      '/manage-applications/:appId/api-key/update'
    ];

    PROTECTED_PAGES.forEach((page) => {
      it('should redirect ' + page + ' to signin if user is not logged in', () => {
        return request(app)
          .get(page)
          .set('Cookie', signedOutCookie)
          .redirects(0)
          .then(response => {
            expect(response.text).to.include('/signin');
          });
      });
    });
  });
});
