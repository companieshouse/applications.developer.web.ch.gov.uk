/**
 * General helper methods for the routes
 */

const Utility = require(`${serverRoot}/lib/Utility`);

const errorManifest = require(`${serverRoot}/lib/errors/error_manifest`).generic;

const routeUtils = {
  processException: err => {
    Utility.logException(err);
    let e = {};
    if (typeof err.name !== 'undefined' && err.name === 'ValidationError') {
      e = err.stack;
    } else {
      e.genericError = errorManifest.serverError;
    }
    return e;
  }
};

module.exports = routeUtils;
