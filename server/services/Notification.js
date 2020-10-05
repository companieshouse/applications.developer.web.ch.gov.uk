const logger = require(`${serverRoot}/config/winston`);

class Notification {
  _getNotificationsFromSession (session) {
    let notifications;
    if (session !== undefined) {
      notifications = session.getExtraData('notification');
    }
    return notifications !== undefined ? notifications : [];
  }

  notify (message, request) {
    const session = request.session;
    if (session !== undefined) {
      const notifications = this._getNotificationsFromSession(session);
      notifications.push(message);
      session.setExtraData('notification', notifications);
    }
  }

  getNotifications (request) {
    const session = request.session;
    let notifications = [];
    if (session !== undefined) {
      notifications = this._getNotificationsFromSession(session);
      session.setExtraData('notification', []);
    }
    return notifications;
  }
}
module.exports = Notification;
