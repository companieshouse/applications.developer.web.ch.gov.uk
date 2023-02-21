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

  isValidAppName (appName) {
    logger.info('Validating app name: ', appName);
    if (/^[a-z\s-\d\.\'\"]{1,72}$/gi.test(appName)) {
      return true;
    }
    return false;
  }

  isValidKeyName (keyName) {
    logger.info('Validating key name: ', keyName);
    return this.isValidAppName(keyName);
  }

  isValidUrl (url) {
    logger.info('Validating Url: ', url);
    if (/^(https?:\/\/)?[-aA-zZ0-9@:%._+~#=]{1,256}\.[a-z0-9()]{1,6}\b([-a-z0-9()@:%_+.~#?&//=]*)/gi.test(url)) {
      return true;
    }
    return false;
  }

  isValidRedirectUri (uri) {
    logger.info('Validating Uri: ', uri);
    if (/^(https?:\/\/)?[-aA-zZ0-9@:%._+~#=]{1,256}[aA-zZ0-9()]{1,6}\b([-aA-zZ0-9()@:%_+.~#?&//=]*)/gi.test(uri)) {
      return true;
    }
    return false;
  }

  isValidIp (ip) {
    logger.info('Validating Ip address: ', ip);
    if (/^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9]$)/gi.test(ip)) {
      return true;
    }
    return false;
  }

  isValidDomain (domain) {
    logger.info('Validating domain: ', domain);
    if (/^http(?:s){0,1}:\/\/(?!\-)(?:[a-zA-Z\d\-]{0,62}[a-zA-Z\d]\.){1,126}(?!\d+)[a-zA-Z\d]{1,63}(?::\d{1,6}){0,1}$/.test(domain)) {
      return true;
    }
    return false;
  }

  isValidDescription (description) {
    logger.info('Validating description: ', description);
    if (/^[a-z\s-\d\.\'\"]{1,256}$/i.test(description)) {
      return true;
    }
    return false;
  }

  isValidAppId (appId) {
    logger.info('Validating AppId: ', appId);
    if (appId && /^[a-z\d]{1}[a-z\d-_\.\+]{0,254}[a-z\d]{1}$/gi.test(appId)) {
      return true;
    }
    return false;
  }

  isValidEnv (env) {
    logger.info('Validating Env: ', env);
    if (env && /^[a-z\d]{1}[a-z\d-_\.\+]{0,254}[a-z\d]{1}$/gi.test(env)) {
      return true;
    }
    return false;
  }
}
module.exports = Validator;
