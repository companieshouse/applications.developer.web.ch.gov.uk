/*
 * General purpose class containing stand-alone utility methods
 */
const logger = require(`${serverRoot}/config/winston`);

class Utility {
  /**
   * Generate a random alphanumeric string
   *
   * @param {number} min - minimum string length
   * @param {number} max - maximum string length
   * @return {string} str
   */
  static getRandomString (min, max) {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const charLength = chars.length;
    const len = Math.floor(Math.random() * (max - min + 1)) + min;
    let str = '';
    for (let i = 0; i < len; i++) {
      str += chars.charAt(Math.floor(Math.random() * charLength));
    }
    return str;
  }

  /**
   * Central logger for application errors, exceptions and promise rejections
   */
  static logException (err, category = 'appError') {
    const status = typeof err.statusCode !== 'undefined' ? err.statusCode : (err.status || 500);
    const errStack = typeof err.stack === 'object' && err.stack !== null ? JSON.stringify(err.stack) : err.stack;
    logger.error(`${status} - ${category}: ${err.message}\r\n${errStack}`);
  }

  /**
   * Retrieve the oauth access token from a request
   *
   * @param {req} request
   */
  static getOAuthToken (req) {
    const signinInfo = req.session.data.signin_info;
    if (!signinInfo) {
      return;
    }
    const accessToken = signinInfo.access_token;
    if (!accessToken) {
      return;
    }
    return accessToken.access_token;
  }

  static splitString (string) {
    if (string === null | string === '') {
      return [];
    } else {
      return string.split(',');
    }
  }
}

module.exports = Utility;
