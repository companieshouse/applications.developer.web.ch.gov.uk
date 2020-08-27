class UrlService {
  constructor () {
    this.baseURL = {
      live: process.env.APPLICATIONS_DEVELOPER_SERVICE_LIVE_BASE_URL,
      test: process.env.APPLICATIONS_DEVELOPER_SERVICE_TEST_BASE_URL,
      future: process.env.APPLICATIONS_DEVELOPER_SERVICE_FUTURE_BASE_URL
    };
  };

  getUrlForEnv (env) {
    const ret = this.baseURL[env];
    return ret;
  }
}

module.exports = UrlService;
