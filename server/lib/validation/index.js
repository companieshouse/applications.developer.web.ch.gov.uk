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
    };
  }

  isValidAppName (name) {
    if (/^[a-z\s-\d\.\'\"]{1,72}$/gi.test(name)) {
      return true;
    } else {
      return false;
    }
  }

  isValidUrl (url) {
    if (/^(https?:\/\/)?[-a-z0-9@:%._+~#=]{1,256}\.[a-z0-9()]{1,6}\b([-a-z0-9()@:%_+.~#?&//=]*)/gi.test(url)) {
      return true;
    } else {
      return false;
    }
  }

  isValidIp (ip) {
    if (/^b(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])/.test(ip)) {
      return true;
    } else {
      return false;
    }
  }

  isValidDomain (domain) {
    if (/^[a-z]$/.test(domain)) {
      return true;
    } else {
      return false;
    }
  }

  isValidDescription (description) {
    if (/^[a-z\s-\d\.\'\"]{1,256}$/i.test(description)) {
      return true;
    } else {
      return false;
    }
  }
}
module.exports = Validator;
