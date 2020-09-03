const serviceData = {
  getList: {
    items_per_page: 5,
    start_index: 0,
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
        privacy_policy_url: 'https://app.domain/privacy-policy',
        terms_and_conditions_url: 'https://app.domain/terms-and-conditions',
        creator_id: 'Users are not implemented',
        owner_id: 'Users are not implemented'
      }
    ],
    total_results: 1
  }
};

module.exports = serviceData;
