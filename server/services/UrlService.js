class UrlService {
  constructor () {
    this.baseURL = {
      live: process.env.APPLICATIONS_DEVELOPER_SERVICE_LIVE_BASE_URL,
      test: process.env.APPLICATIONS_DEVELOPER_SERVICE_TEST_BASE_URL,
      future: process.env.APPLICATIONS_DEVELOPER_SERVICE_FUTURE_BASE_URL
    };
  };

  getUrlForEnv (env) {
    if (env === 'live') {
      return this.baseURL.live;
    } else if (env === 'test') {
      return this.baseURL.test;
    } else if (env === 'future') {
      return this.baseURL.future;
    } else {
      const err = Object.create(Error.prototype);
      err.name = 'Unknown Environment Requested';
      throw err;
    }
  }
}

module.exports = UrlService;
