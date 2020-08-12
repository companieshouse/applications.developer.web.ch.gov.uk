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

  getList () {
    const options = Object.assign(this._getBaseOptions(), {
      method: 'GET',
      url: `${this.server.baseUrl}/applications/?items_per_page=5&start_index=0`
    });
    return this.request(options);
  }

  getReport (selfLink) {
    const options = Object.assign(this._getBaseOptions(), {
      method: 'GET',
      url: `${this.server.baseUrl}${selfLink}`
    });
    logger.info('Service request to fetch report, with payload: ', options);
    return this.request(options);
  }

  saveContactName (contactName) {
    const options = Object.assign(this._getBaseOptions(), {
      method: 'POST',
      body: {
        obliged_entity_contact_name: contactName,
        status: 'INCOMPLETE'
      }
    });
    logger.info('Service request to save contact name, with payload: ', options);
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
