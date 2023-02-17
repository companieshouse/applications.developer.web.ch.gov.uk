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

  isValidKeyName (name) {
    logger.info('Validating app name: ', name);
    if (/^[a-z\s-\d\.\'\"]{1,72}$/gi.test(name)) {
      return true;
    } else {
      return false;
    }
  }

  isValidUrl (url) {
    logger.info('Validating Url: ', url);
    if (/^(https?:\/\/)?[-aA-zZ0-9@:%._+~#=]{1,256}\.[a-z0-9()]{1,6}\b([-a-z0-9()@:%_+.~#?&//=]*)/gi.test(url)) {
      return true;
    } else {
      return false;
    }
  }

  isValidRedirectUri (uri) {
    logger.info('Validating Uri: ', uri);
    if (/^(https?:\/\/)?[-aA-zZ0-9@:%._+~#=]{1,256}[aA-zZ0-9()]{1,6}\b([-aA-zZ0-9()@:%_+.~#?&//=]*)/gi.test(uri)) {
      return true;
    } else {
      return false;
    }
  }

  isValidIp (ip) {
    logger.info('Validating Ip address: ', ip);
    if (/^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9]$)/gi.test(ip)) {
      return true;
    } else {
      return false;
    }
  }

  isValidDomain (domain) {
    logger.info('Validating domain: ', domain);
    if (/^http(?:s){0,1}:\/\/(?!\-)(?:[a-zA-Z\d\-]{0,62}[a-zA-Z\d]\.){1,126}(?!\d+)[a-zA-Z\d]{1,63}(?::\d{1,6}){0,1}$/.test(domain)) {
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

  isValidAppId (appId) {
    logger.info('Validating AppId: ', appId);
    if (/^[a-z\d]{1}[a-z\d-_\.\+]{0,18}[a-z\d]{1}$/i.test(appId)) {
      return true;
    } else {
      return false;
    }
  }

  isValidEnv (env) {
    logger.info('Validating Env: ', env);
    if (/^[a-z\d]{1}[a-z\d-_\.\+]{0,18}[a-z\d]{1}$/i.test(env)) {
      return true;
    } else {
      return false;
    }
  }
}
module.exports = Validator;
