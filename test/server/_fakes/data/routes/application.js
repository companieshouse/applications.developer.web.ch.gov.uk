const routeData = {
  addApplication: {
    name: 'app demo',
    description: 'description',
    environment: 'live',
    appId: 'abc123',
    env: 'test'
  },
  updateApplication: {
    applicationName: 'test',
    description: 'description',
    terms: 'terms',
    privacyPolicy: 'priv',
    appId: 'app123',
    env: 'test'
  },
  addNewRestKey: {
    keyName: 'key demo',
    keyDescription: 'description',
    keyType: 'rest',
    restrictedIps: '00000',
    javaScriptDomains: 'javascriptDomain',
    appId: 'app123',
    env: 'test'
  },
  addNewWebKey: {
    keyType: 'web',
    name: 'My API Client',
    description: 'This application is used for blah',
    redirect_uris: [
      'https://app.domain/oauth/callback'
    ],
    appId: 'app123',
    env: 'test'
  },
  addNewStreamKey: {
    keyType: 'stream',
    name: 'My API Client',
    description: 'This application is used for blah',
    restricted_ips: [
      '192.168.0.1'
    ],
    appId: 'app123',
    env: 'test'
  },
  updateKey: {
    keyName: 'test',
    keyDescription: 'description',
    keyType: 'rest',
    restrictedIps: '00000',
    javaScriptDomains: 'javascriptDomain',
    appId: 'app123',
    env: 'test',
    keyId: 'key123'
  }
};

module.exports = routeData;
