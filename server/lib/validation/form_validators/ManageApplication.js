const errorManifest = require(`${serverRoot}/lib/errors/error_manifest`).validation;
const Validator = require(`${serverRoot}/lib/validation`);
const logger = require(`${serverRoot}/config/winston`);

class ManageApplication extends Validator {
  constructor () {
    super();
  }

  _formatIncomingPayload (payload) {
    logger.info('Formatting the incoming payload: ', payload);
    const keys = Object.keys(payload);
    for (const key of keys) {
      if (payload.hasOwnProperty(key)) {
        payload[key] = payload[key].trim();
      }
    }
  }

  addApplication (payload) {
    return new Promise((resolve, reject) => {
      this.validateApplication(payload);
      if (typeof payload.environment === 'undefined' || payload.environment === '') {
        this.errors.environment = errorManifest.environment.blank;
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

  updateApplication (payload) {
    return new Promise((resolve, reject) => {
      this.validateApplication(payload);
      if (Object.keys(this.errors).length === 0) {
        resolve(true);
      } else {
        const e = this.getErrorSignature();
        e.stack = this.errors;
        reject(e);
      }
    });
  }

  addNewKey (payload) {
    return new Promise((resolve, reject) => {
      this.validateKey(payload);
      if (typeof payload.keyType === 'undefined' || payload.keyType === '') {
        this.errors.type = errorManifest.type.blank;
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

  updateKey (payload) {
    return new Promise((resolve, reject) => {
      this.validateKey(payload);
      if (Object.keys(this.errors).length === 0) {
        resolve(true);
      } else {
        const e = this.getErrorSignature();
        e.stack = this.errors;
        reject(e);
      }
    });
  }

  validateKey (payload) {
    logger.info('Validating key payload data');
    this.errors = {};
    this._formatIncomingPayload(payload);
    if (!this.isValidKeyName(payload.keyName)) {
      if (payload.keyName.length === 0) {
        this.errors.name = errorManifest.keyName.blank;
      } else {
        this.errors.name = errorManifest.keyName.invalid;
      }
    }
    if (!this.isValidDescription(payload.keyDescription)) {
      if (payload.keyDescription.length === 0) {
        this.errors.description = errorManifest.description.blank;
      } else {
        this.errors.description = errorManifest.description.invalid;
      }
    }
    if (payload.restrictedIps && payload.restrictedIps.length > 0) {
      const restrictedIps = payload.restrictedIps.split(',');
      for (const restrictedIp of restrictedIps) {
        if (restrictedIp.length > 0) {
          if (!this.isValidIp(restrictedIp)) {
            this.errors.restrictedIp = errorManifest.restrictedIp.invalid;
          }
        }
      }
    }
    if (payload.javaScriptDomains && payload.javaScriptDomains.length > 0) {
      const javaScriptDomains = payload.javaScriptDomains.split(',');
      for (const javaScriptDomain of javaScriptDomains) {
        if (javaScriptDomain.length > 0) {
          if (!this.isValidDomain(javaScriptDomain)) {
            this.errors.javaScriptDomain = errorManifest.javaScriptDomain.invalid;
          }
        }
      }
    }
    if (payload.redirectURIs && payload.redirectURIs.length > 0) {
      const redirectUris = payload.redirectURIs.split(',');
      for (const redirectUri of redirectUris) {
        if (redirectUri.length > 0) {
          if (!this.isValidRedirectUri(redirectUri)) {
            this.errors.redirectURIs = errorManifest.redirectURIs.invalid;
            break;
          }
        }
      }
    }
  }

  validateApplication (payload) {
    logger.info('Validating application payload data');
    this.errors = {};
    this._formatIncomingPayload(payload);
    if (!this.isValidAppName(payload.applicationName)) {
      if (payload.applicationName.length === 0) {
        this.errors.name = errorManifest.applicationName.blank;
      } else {
        this.errors.name = errorManifest.applicationName.invalid;
      }
    }
    if (!this.isValidDescription(payload.description)) {
      if (payload.description.length === 0) {
        this.errors.description = errorManifest.description.blank;
      } else {
        this.errors.description = errorManifest.description.invalid;
      }
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
  }
};
module.exports = ManageApplication;
