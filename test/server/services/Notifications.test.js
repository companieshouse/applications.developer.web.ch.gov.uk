const NotificationService = require(`${serverRoot}/services/Notification`);
const notificationService = new NotificationService();

const { Session } = require('@companieshouse/node-session-handler');

const chai = require('chai');
const assert = chai.assert;

describe('services/Notification', () => {
  beforeEach(done => {
    sinon.reset();
    sinon.restore();
    done();
  });

  afterEach(done => {
    sinon.reset();
    sinon.restore();
    done();
  });

  it('should retrieve an empty list if there are no notifications', () => {
    const session = new Session();
    request = { session: session };
    const notifications = notificationService.getNotifications(request);
    assert.isArray(notifications);
    assert.isEmpty(notifications);
  });

  it('should return a notification if a notification is added', () => {
    const session = new Session();
    request = { session: session };
    const MockMessage = 'MockMessage';
    notificationService.notify(MockMessage, request);
    const notifications = notificationService.getNotifications(request);
    assert.isArray(notifications);
    assert.isNotEmpty(notifications);
    assert.lengthOf(notifications, 1);
    assert.equal(notifications[0], MockMessage);
  });

  it('should retrieve an empty list if notifications are retrieved twice', () => {
    const session = new Session();
    request = { session: session };
    const MockMessage = 'MockMessage';
    notificationService.notify(MockMessage, request);
    notificationService.getNotifications(request);
    const notifications = notificationService.getNotifications(request);
    assert.isArray(notifications);
    assert.isEmpty(notifications);
  });
});
