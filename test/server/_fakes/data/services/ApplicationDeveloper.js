const serviceData = {
  getList: {
    itemsPerPage: 5,
    startIndex: 0,
    items: [
      {
        kind: 'application#application',
        links: [
          {
            rel: 'self',
            href: 'http://localhost:5009/applications/5f0db034fd9541606b3feb51'
          }
        ],
        etag: 'Etag Not Implemented',
        id: '5f0db034fd9541606b3feb51',
        name: 'Test, Kind Now Added',
        description: 'This application is used for blah',
        privacyPolicyUrl: 'https://app.domain/privacy-policy',
        termsAndConditionsUrl: 'https://app.domain/terms-and-conditions',
        creatorId: 'Users are not implemented',
        ownerId: 'Users are not implemented'
      }
    ],
    totalResults: 1
  }
};

module.exports = serviceData;
