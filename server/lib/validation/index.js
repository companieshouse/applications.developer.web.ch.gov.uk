const errorManifest = require(`${serverRoot}/lib/errors/error_manifest`).validation;
const logger = require(`${serverRoot}/config/winston`);

class Validator {

  constructor() {
    this.errors = {};
    this.payload = {};
  }

  _getErrorSignature () {
    return {
      status: 400,
      code: 'VALIDATION_ERRORS',
      message: errorManifest.default.summary,
      stack: {}
    }
  }

  isValidEmail(email) {
    logger.info(`Request to validate email: ${email}`);
    let errors = this._getErrorSignature();
    return new Promise((resolve, reject) => {
      let validEmailRegex = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]+$/);
      if(typeof email === 'undefined' || email === null || email.length === 0){
        errors.stack.email = errorManifest.email.blank;
        reject(errors);
      } else if(!validEmailRegex.test(email)) {
        errors.stack.email = errorManifest.email.incorrect;
        reject(errors);
      } else {
        resolve(true);
      }
    });
  }

  isValidCompanyNumber(number) {
    logger.info(`Request to validate company number: ${number}`);
    let errors = this._getErrorSignature();
    return new Promise((resolve, reject) => {
      if(typeof number === "undefined" || number === null || number.length === 0) {
        errors.stack.number = errorManifest.number.empty;
        reject(errors);
      } else if (number.length !== 8) {
        errors.stack.number = errorManifest.number.incorrect;
        reject(errors);
      } else {
        resolve(true);
      }
    });
  }

  isValidContactName(contactName) {
    logger.info(`Request to validate contact name: ${contactName}`);
    let errors = this._getErrorSignature();
    return new Promise((resolve, reject) => {
      let validNameRegex = new RegExp(/^[AÀÁÂÃÄÅĀĂĄǺaàáâãäåāăąǻÆǼæǽBbCcçćĉċčDÞĎĐdþďđEÈÉÊËĒĔĖĘĚeèéêëēĕėęěFfGĜĞĠĢgĝğġģHĤĦhĥħIÌÍÎÏĨĪĬĮİiìíîïĩīĭįJĴjĵKĶkķLĹĻĽĿŁlĺļľŀłMmNÑŃŅŇŊnñńņňŋOÒÓÔÕÖØŌŎŐǾoòóôõöøōŏőǿŒœPpQqRŔŖŘrŕŗřSŚŜŞŠsśŝşšTŢŤŦtţťŧUÙÚÛÜŨŪŬŮŰŲuùúûüũūŭůűųVvWŴẀẂẄwŵẁẃẅXxYỲÝŶŸyỳýŷÿZŹŻŽzźżž&@£$€¥*=#%+‘ʼ'()\/\[\]{}<>!«»?“ˮ\"0123456789.,:;\–\-  \\r\\n]*$/);
      if(typeof contactName === 'undefined' || contactName === null || contactName.length === 0) {
        errors.stack.fullName = errorManifest.fullName.empty;
        reject(errors);
      } else if(!validNameRegex.test(contactName)) {
        errors.stack.fullName = errorManifest.fullName.incorrect;
        reject(errors);
      } else {
        resolve(true);
      }
    });
  }
}

module.exports = Validator;