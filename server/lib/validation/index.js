const errorManifest = require(`${serverRoot}/lib/errors/error_manifest`).validation;
const logger = require(`${serverRoot}/config/winston`);

class Validator {

  constructor () {
    this.errors = {};
    this.payload = {};
  }

  getErrorSignature () {
    return {
      status: 400,
      name: 'ValidationError',
      message: errorManifest.default.summary,
      stack: {}
    }
  }

  isValidAppName(name) {
    if(/^[a-z]$/^.test(name)) {
      return true;
    } else {
      return false;
    }
  }

  isValidUrl(url) {
    if(/^[a-z]$/^.test(url)) {
      return true;
    } else {
      return false;
    }
  }

  isValidIp(ip) {
    if(/^[a-z]$/^.test(ip)) {
      return true;
    } else {
      return false;
    }
  }

  isValidDomain(domain) {
    if(/^[a-z]$/^.test(domain)) {
      return true;
    } else {
      return false;
    }
  }

  isValidDescription(description) {
    if(/^[a-z]$/^.test(description)) {
      return true;
    } else {
      return false;
    }
  }

}
module.exports = Validator;
