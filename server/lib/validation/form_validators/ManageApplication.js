const errorManifest = require(`${serverRoot}/lib/errors/error_manifest`).validation;
const Validator = require(`${serverRoot}/lib/validation`);

class ManageApplication extends Validator {

  constructor () {
    super();
  }

  addApplication(payload) {
    return new Promise((resolve, reject) => {
      if (!this.isValidAppName(payload.name)) {
        this.errors.name = errorManifest.name;
      }
      if (!this.isValidDescription(payload.description)) {
        this.errors.description = errorManifest.description;
      }
      if (typeof payload.environment === 'undefined' || payload.environment === '') {
        this.errors.environment = errorManifest.environment;
      }
      const terms = payload.terms.trim();
      if (terms.length > 0) {
        if (this.isValidUrl(terms)) {
          this.errors.terms = errorManifest.terms;
        }
      }
      const privacyPolicy = payload.privacyPolicy.trim();
      if (privacyPolicy.length > 0) {
        if (this.isValidUrl(privacyPolicy)) {
          this.errors.privacyPolicy = errorManifest.privacyPolicy;
        }
      }
      if (Object.keys(this.errors).length === 0) {
        resolve(true);
      } else {
        let e = this.getErrorSignature();
        e.stack = this.errors;
        reject(e);
      }
    });
  }
}
module.exports = ManageApplication;
