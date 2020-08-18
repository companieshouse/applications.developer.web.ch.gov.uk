const errorManifest = require(`${serverRoot}/lib/errors/error_manifest`).validation;
const Validator = require(`${serverRoot}/lib/validation`);

class ManageApplication extends Validator {
  constructor () {
    super();
  }

  _formatIncomingPayload (payload) {
    const keys = Object.keys(payload);
    for (const key of keys) {
      console.log('triming : ', key);
      if (payload.hasOwnProperty(key)) {
        payload[key] = payload[key].trim();
      }
    }
  }

  addApplication (payload) {
    this._formatIncomingPayload(payload);
    return new Promise((resolve, reject) => {
      if (!this.isValidAppName(payload.applicationName)) {
        if (payload.applicationName.length === 0) {
          this.errors.name = errorManifest.name.blank;
        } else {
          this.errors.name = errorManifest.name.invalid;
        }
      }
      if (!this.isValidDescription(payload.description)) {
        if (payload.description.length === 0) {
          this.errors.description = errorManifest.description.blank;
        } else {
          this.errors.description = errorManifest.description.invalid;
        }
      }
      if (typeof payload.environment === 'undefined' || payload.environment === '') {
        this.errors.environment = errorManifest.environment.blank;
      }
      if (payload.terms.length > 0) {
        if (!this.isValidUrl(payload.terms)) {
          this.errors.terms = errorManifest.terms.invalid;
        }
      }
      if (payload.privacyPolicy.length > 0) {
        if (!this.isValidUrl(payload.privacyPolicy)) {
          this.errors.privacyPolicy = errorManifest.privacyPolicy.invalid;
        }
      }
      if (Object.keys(this.errors).length === 0) {
        resolve(true);
      } else {
        const e = this.getErrorSignature();
        e.stack = this.errors;
        reject(e);
      }
    });
  }
};
module.exports = ManageApplication;
