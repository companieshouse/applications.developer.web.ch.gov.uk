const routeData = {
  addApplication: {
    name: 'app demo',
    description: 'description',
    environment: 'live'
  },
  updateApplication: {
    applicationName: 'test',
    description: 'description',
    terms: 'terms',
    privacyPolicy: 'priv',
    appId: 'app123',
    env: 'test'
  },
  addNewKey: {
    keyName: 'key demo',
    keyDescription: 'description',
    keyType: 'rest',
    restrictedIps: '00000',
    javaScriptDomains: 'javascriptDomain'
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
