const sdkData = {
  getApplications: {
    httpStatusCode: 200,
    resource: {
      itemsPerPage: 20,
      totalResults: 1,
      startIndex: 0,
      items: [
        {
          etag: "etag",
          id: "id",
          kind: "kind",
          name: "name",
          description: "description",
          privacy_policy_url: "privacy policy url",
          terms_and_conditions_url: "terms and conditions url",
          creator_id: "cr3470r1d",
          owner_id: "0wn3r1d",
          links: {
              self: "self"
          }
        }
      ]
    }
  },
  getApplication: {
    httpStatusCode: 200,
    resource: {
      etag: "etag",
      id: "id",
      kind: "kind",
      name: "name",
      description: "description",
      privacy_policy_url: "privacy policy url",
      terms_and_conditions_url: "terms and conditions url",
      creator_id: "cr3470r1d",
      owner_id: "0wn3r1d",
      links: {
          self: "self"
      }
    }
  },
  getAPIKeys: {
    httpStatusCode: 200,
    resource: {
      itemsPerPage: 20,
      totalResults: 1,
      startIndex: 0,
      items: [
        {
          etag: "etag",
          id: "id",
          kind: "kind",
          name: "name",
          description: "description",
          type: "type",
          client_id: "client_id",
          application_id: "application id",
          created_on: "01-01-2020",
          restricted_ips: ["0.0.0.0"],
          js_domains: ["test.domain"],
          rate_limit: {
              window: "5m",
              limit: 600
          },
          links: {
              self: "self",
              application: "application"
          }
        }
      ]
    }
  },
  getAPIKey: {
    httpStatusCode: 200,
    resource: {
      etag: "etag",
      id: "id",
      kind: "kind",
      name: "name",
      description: "description",
      type: "type",
      client_id: "client_id",
      application_id: "application id",
      created_on: "01-01-2020",
      restricted_ips: ["0.0.0.0"],
      js_domains: ["test.domain"],
      rate_limit: {
          window: "5m",
          limit: 600
      },
      links: {
          self: "self",
          application: "application"
      }
    }
  }
};

module.exports = sdkData;
