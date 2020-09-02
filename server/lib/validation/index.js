const errorManifest = require(`${serverRoot}/lib/errors/error_manifest`).validation;
const logger = require(`${serverRoot}/config/winston`);

class Validator {
  constructor () {
    this.errors = {};
    this.payload = {};
  }

  getErrorSignature () {
    logger.info('Retrieving error signature');
    return {
      status: 400,
      name: 'ValidationError',
      message: errorManifest.default.summary,
      stack: {}
    };
  }

  isValidAppName (name) {
    logger.info('Validating app name: ', name);
    if (/^[a-z\s-\d\.\'\"]{1,72}$/gi.test(name)) {
      return true;
    } else {
      return false;
    }
  }

  isValidUrl (url) {
    logger.info('Validating Url: ', url);
    if (/^(https?:\/\/)?[-a-z0-9@:%._+~#=]{1,256}\.[a-z0-9()]{1,6}\b([-a-z0-9()@:%_+.~#?&//=]*)/gi.test(url)) {
      return true;
    } else {
      return false;
    }
  }

  isValidIp (ip) {
    logger.info('Validating Ip address: ', ip);
    if (/^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])/gi.test(ip)) {
      return true;
    } else {
      return false;
    }
  }

  isValidDomain (domain) {
    logger.info('Validating domain: ', domain);
    if (/^[a-z]$/.test(domain)) {
      return true;
    } else {
      return false;
    }
  }

  isValidDescription (description) {
    logger.info('Validating description: ', description);
    if (/^[a-z\s-\d\.\'\"]{1,256}$/i.test(description)) {
      return true;
    } else {
      return false;
    }
  }
}
module.exports = Validator;
