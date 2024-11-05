const routeData = {
  addApplication: {
    name: 'app demo',
    description: 'description',
    environment: 'live',
    appId: 'abc123',
    env: 'test',
    _csrf: 'csrfToken'
  },
  updateApplication: {
    applicationName: 'test',
    description: 'description',
    terms: 'terms',
    privacyPolicy: 'priv',
    appId: 'app123',
    env: 'test',
    _csrf: 'csrfToken'
  },
  addNewRestKey: {
    keyName: 'key demo',
    keyDescription: 'description',
    keyType: 'rest',
    restrictedIps: '00000',
    javaScriptDomains: 'javascriptDomain',
    appId: 'app123',
    env: 'test',
    _csrf: 'csrfToken'
  },
  addNewWebKey: {
    keyType: 'web',
    name: 'My API Client',
    description: 'This application is used for blah',
    redirect_uris: [
      'https://app.domain/oauth/callback'
    ],
    appId: 'app123',
    env: 'test',
    _csrf: 'csrfToken'
  },
  addNewStreamKey: {
    keyType: 'stream',
    name: 'My API Client',
    description: 'This application is used for blah',
    restricted_ips: [
      '192.168.0.1'
    ],
    appId: 'app123',
    env: 'test',
    _csrf: 'csrfToken'
  },
  updateKey: {
    keyName: 'test',
    keyDescription: 'description',
    keyType: 'rest',
    restrictedIps: '00000',
    javaScriptDomains: 'javascriptDomain',
    appId: 'app123',
    env: 'test',
    keyId: 'key123',
    _csrf: 'csrfToken'
  }
};

module.exports = routeData;
