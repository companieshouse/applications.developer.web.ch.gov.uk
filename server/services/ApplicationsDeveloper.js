const axios = require('axios');
const logger = require(`${serverRoot}/config/winston`);

class ApplicationsDeveloper {
  constructor () {
    this.server = {
      apiKey: process.env.APPLICATIONS_DEVELOPER_SERVICE_API_KEY,
      baseUrl: process.env.APPLICATIONS_DEVELOPER_SERVICE_BASE_URL,
      auth: {
        username: process.env.APPLICATIONS_DEVELOPER_SERVICE_USERNAME,
        password: process.env.APPLICATIONS_DEVELOPER_SERVICE_PASSWORD
      }
    };
    this.request = axios;
  }

  _getBaseOptions () {
    return {
      headers: {
        // authorization: this.server.apiKey
        content_type: 'application/json'
      },
      responseType: 'json'
    };
  }

  _getBaseUrl (data) {
    let baseUrl = '';
    if(typeof data.environment !== 'undefined') {
      if(data.environment === 'test') {
        if(typeof data.inDevelopment !== 'undefined' && data.inDevelopment === 'yes') {
          baseUrl = process.env.APPLICATIONS_DEVELOPER_SERVICE_FUTURE_BASE_URL;
        } else {
          baseUrl = process.env.APPLICATIONS_DEVELOPER_SERVICE_TEST_BASE_URL;
        }
      } else if(data.environment === 'live') {
        baseUrl = process.env.APPLICATIONS_DEVELOPER_SERVICE_LIVE_BASE_URL;
      }
    }
    return baseUrl;
  }

  getList () {
    const options = Object.assign(this._getBaseOptions(), {
      method: 'GET',
      url: `${this.server.baseUrl}/applications/?items_per_page=5&start_index=0`
    });
    logger.info('Service request to retrieve applications list, with payload: ', options);
    return this.request(options);
  }

  save (data) {
    const baseUrl = this._getBaseUrl(data);
    const options = Object.assign(this._getBaseOptions(), {
      method: 'POST',
      data: {
        name: data.applicationName,
        description: data.description,
        privacy_policy_url: data.privacy_policy_url,
        terms_and_conditions_url: data.terms_and_conditions_url
      },
      url: `${baseUrl}/applications`
    });
    logger.info('Service request to save data, with payload: ', options);
    return this.request(options);
  }

  saveEmail (data) {
    const options = Object.assign(this._getBaseOptions(), {
      method: 'PUT',
      uri: `${this.server.baseUrl}${data.selfLink}`,
      body: {
        obliged_entity_contact_name: data.obliged_entity_contact_name,
        obliged_entity_email: data.obliged_entity_email,
        obliged_entity_telephone_number: data.obliged_entity_telephone_number,
        status: 'INCOMPLETE',
        etag: data.etag
      }
    });
    logger.info('Service request to save email, with payload: ', options);
    return this.request(options);
  }

  saveCompanyNumber (data) {
    const options = Object.assign(this._getBaseOptions(), {
      method: 'PUT',
      uri: `${this.server.baseUrl}${data.selfLink}`,
      body: {
        obliged_entity_contact_name: data.obliged_entity_contact_name,
        obliged_entity_email: data.obliged_entity_email,
        obliged_entity_telephone_number: data.obliged_entity_telephone_number,
        company_number: data.company_number,
        status: 'INCOMPLETE',
        etag: data.etag
      }
    });
    logger.info('Service request to save company number, with payload: ', options);
    return this.request(options);
  }

  saveStatus (data) {
    const options = Object.assign(this._getBaseOptions(), {
      method: 'PUT',
      uri: `${this.server.baseUrl}${data.selfLink}`,
      body: {
        obliged_entity_contact_name: data.obliged_entity_contact_name,
        obliged_entity_email: data.obliged_entity_email,
        obliged_entity_telephone_number: data.obliged_entity_telephone_number,
        company_number: data.company_number,
        status: 'COMPLETE',
        etag: data.etag
      }
    });
    logger.info('Service request to save email, with payload: ', options);
    return this.request(options);
  }

  saveDiscrepancyDetails (data) {
    const options = Object.assign(this._getBaseOptions(), {
      method: 'POST',
      uri: `${this.server.baseUrl}${data.selfLink}/discrepancies`,
      body: {
        details: data.details
      }
    });
    logger.info('Service request to save discrepancy details, with payload: ', options);
    return this.request(options);
  }
}
module.exports = ApplicationsDeveloper;
