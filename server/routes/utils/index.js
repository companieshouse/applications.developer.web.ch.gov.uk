/**
 * General helper methods for the routes
 */

const Utility = require(`${serverRoot}/lib/Utility`);

const errorManifest = require(`${serverRoot}/lib/errors/error_manifest`).generic;

const NotificationService = require(`${serverRoot}/services/Notification`);
const notificationService = new NotificationService();

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
  },

  createViewData: (title, activePage, req) => {
    return {
      this_data: null,
      this_errors: null,
      active_page: activePage,
      title: title,
      user_profile: req.session.data.signin_info.user_profile,
      this_notifications: notificationService.getNotifications(req)
    };
  }
};

module.exports = routeUtils;
