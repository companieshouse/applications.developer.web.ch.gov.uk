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
  addNewKey:{
    keyName: 'key demo',
    keyDescription: 'description',
    keyType: 'rest',
    restrictedIps: '00000',
    javaScriptDomains: 'javascriptDomain'
  }
};

module.exports = routeData;
