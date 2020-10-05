const router = require('express').Router();
const logger = require(`${serverRoot}/config/winston`);

const ApplicationsDeveloperService = require(`${serverRoot}/services/ApplicationsDeveloper`);
const applicationsDeveloperService = new ApplicationsDeveloperService();

const NotificationService = require(`${serverRoot}/services/Notification`);
const notificationService = new NotificationService();

const Validator = require(`${serverRoot}/lib/validation/form_validators/ManageApplication`);
const validator = new Validator();

const routeUtils = require(`${serverRoot}/routes/utils`);
const routeViews = 'applications';

router.get('(/manage-applications)?', (req, res, next) => {
  logger.info(`GET request to serve index page: ${req.path}`);
  const viewData = routeUtils.createViewData('Application overview', 'application-overview', req);
  const applicationQueries = [
    applicationsDeveloperService.getApplicationList('live'),
    applicationsDeveloperService.getApplicationList('test')
  ];
  const futureFlag = process.env.FUTURE_DISPLAY_FLAG;
  if (futureFlag === 'true') {
    applicationQueries.push(applicationsDeveloperService.getApplicationList('future'));
  };
  Promise.all(applicationQueries).then(([listLive, listTest, listFuture]) => {
    if (listFuture === undefined) {
      viewData.this_data = {
        live: listLive.data,
        test: listTest.data
      };
    } else {
      viewData.this_data = {
        live: listLive.data,
        test: listTest.data,
        future: listFuture.data
      };
    };
    res.render(`${routeViews}/index.njk`, viewData);
  }).catch(err => {
    viewData.this_errors = routeUtils.processException(err);
    res.render(`${routeViews}/index.njk`, viewData);
  });
});

router.get('/manage-applications/add', (req, res, next) => {
  logger.info(`GET request to serve add application page: ${req.path}`);
  const viewData = routeUtils.createViewData('Add an application', 'add-application', req);
  res.render(`${routeViews}/add.njk`, viewData);
});

router.post('/manage-applications/add', (req, res, next) => {
  logger.info(`POST request to process add application page: ${req.path}`);
  const viewData = routeUtils.createViewData('Add an application', 'add-application', req);
  viewData.this_data = req.body;
  validator.addApplication(req.body)
    .then(_ => {
      return applicationsDeveloperService.saveApplication(req.body);
    }).then(_ => {
      notificationService.notify('Application successfully created.', req);
      return res.redirect(302, '/manage-applications');
    }).catch(err => {
      viewData.this_errors = routeUtils.processException(err);
      res.render(`${routeViews}/add.njk`, viewData);
    });
});

router.get('/manage-applications/:appId/view/:env', (req, res, next) => {
  logger.info(`GET request to view a single application: ${req.path}`);
  const id = req.params.appId;
  const env = req.params.env;
  const viewData = routeUtils.createViewData('View application', 'view-application', req);
  viewData.this_data = {
    appId: req.params.appId,
    env: env
  };
  viewData.this_errors = null;
  Promise.all(
    [
      applicationsDeveloperService.getApplication(id, env),
      applicationsDeveloperService.getKeysForApplication(id, env)
    ]).then(([appData, keyData]) => {
    viewData.this_data.app = appData.data;
    viewData.this_data.keys = keyData.data;
    viewData.title = `${viewData.title}: ${appData.data.name}`;
    res.render(`${routeViews}/view.njk`, viewData);
  }).catch(err => {
    viewData.this_errors = routeUtils.processException(err);
    res.render(`${routeViews}/view.njk`, viewData);
  });
});

router.get('/manage-applications/:appId/update/:env/:confirm?', (req, res) => {
  logger.info(`GET request to serve update application page: ${req.path}`);
  const id = req.params.appId;
  const env = req.params.env;
  const confirmDelete = typeof req.params.confirm !== 'undefined' && req.params.confirm === 'confirm';
  const viewData = routeUtils.createViewData('Edit application', 'application-overview', req);
  viewData.this_data = {
    appId: id,
    env: env,
    confirmDelete: confirmDelete
  };
  applicationsDeveloperService.getApplication(id, env)
    .then(appData => {
      viewData.this_data.applicationName = appData.data.name;
      viewData.this_data.description = appData.data.description;
      viewData.this_data.privacyPolicy = appData.data.privacy_policy_url;
      viewData.this_data.terms = appData.data.terms_and_conditions_url;
      res.render(`${routeViews}/edit.njk`, viewData);
    }).catch(err => {
      viewData.this_errors = routeUtils.processException(err);
      res.render(`${routeViews}/edit.njk`, viewData);
    });
});

router.post('/manage-applications/:appId/delete/:env', (req, res) => {
  logger.info(`DELETE request to update the application: ${req.path}`);
  const appId = req.params.appId;
  const env = req.params.env;
  const viewData = routeUtils.createViewData('Edit application', 'application-overview', req);

  applicationsDeveloperService.deleteApplication(appId, env)
    .then(_ => {
      notificationService.notify('Application successfully deleted.', req);
      return res.redirect(302, '/manage-applications');
    }).catch(err => {
      viewData.this_errors = routeUtils.processException(err);
      res.render(`${routeViews}/edit.njk`, viewData);
    });
});

router.post('/manage-applications/:appId/update/:env', (req, res) => {
  logger.info(`PUT request to update the application: ${req.path}`);
  const appId = req.params.appId;
  const env = req.params.env;
  const payload = req.body;
  payload.env = env;
  payload.appId = appId;
  const viewData = routeUtils.createViewData('Update an application', 'application-overview', req);
  viewData.this_data = payload;
  validator.updateApplication(payload)
    .then(_ => {
      return applicationsDeveloperService.updateApplication(payload);
    }).then(_ => {
      notificationService.notify('Application successfully updated.', req);
      return res.redirect(302, `/manage-applications/${appId}/view/${env}`);
    }).catch(err => {
      viewData.this_errors = routeUtils.processException(err);
      res.render(`${routeViews}/edit.njk`, viewData);
    });
});

router.get('/manage-applications/:appId/delete', (req, res, next) => {
  logger.info(`GET request to serve index page: ${req.path}`);
  res.render(`${routeViews}/index.njk`);
});

router.get('/manage-applications/:appId/api-key/add/:env', (req, res, next) => {
  logger.info(`GET request to serve add application page: ${req.path}`);
  const viewData = routeUtils.createViewData('Add Key', 'application-overview', req);
  viewData.this_data = {
    appId: req.params.appId,
    env: req.params.env
  };
  viewData.this_errors = null;
  res.render(`${routeViews}/add_key.njk`, viewData);
});

router.post('/manage-applications/:appId/api-key/add/:env', (req, res, next) => {
  logger.info(`Post request to add new key and redirect to view application page: ${req.path}`);
  const viewData = routeUtils.createViewData('Add Key', 'application-overview', req);
  viewData.this_data = {
    body: req.body,
    appId: req.params.appId,
    env: req.params.env
  };
  viewData.this_errors = null;
  validator.addNewKey(req.body)
    .then(_ => {
      if (req.body.keyType === 'rest') {
        applicationsDeveloperService.addNewRestKey(req.body, req.params.appId, req.params.env);
      } else if (req.body.keyType === 'web') {
        applicationsDeveloperService.addNewWebKey(req.body, req.params.appId, req.params.env);
      } else if (req.body.keyType === 'stream') {
        applicationsDeveloperService.addNewStreamKey(req.body, req.params.appId, req.params.env);
      }
    }).then(_ => {
      notificationService.notify('Key successfully created.', req);
      return res.redirect(302, '/manage-applications/' + req.params.appId + '/view/' + req.params.env);
    }).catch(err => {
      viewData.this_errors = routeUtils.processException(err);
      res.render(`${routeViews}/add_key.njk`, viewData);
    });
});

router.get('/manage-applications/:appId/:keyType/:keyId/delete/:env', (req, res, next) => {
  logger.info(`GET request to serve delete a key page: ${req.path}`);
  const appId = req.params.appId;
  const keyId = req.params.keyId;
  const keyType = req.params.keyType;
  const env = req.params.env;
  const viewData = routeUtils.createViewData('Delete Key', 'view-application', req);
  applicationsDeveloperService.getSpecificKey(appId, keyId, keyType, env)
    .then(
      apiKey => {
        viewData.this_data = {
          appId: appId,
          keyId: keyId,
          keyType: keyType,
          keyKind: apiKey.data.kind,
          env: env,
          keyName: apiKey.data.name
        };
        res.render(`${routeViews}/delete_key.njk`, viewData);
      }
    ).catch(
      err => {
        viewData.this_errors = routeUtils.processException(err);
        res.render(`${routeViews}/delete_key.njk`, viewData);
      }
    );
});

router.post('/manage-applications/:appId/:keyType/:keyId/delete/:env', (req, res, next) => {
  const appId = req.params.appId;
  const keyId = req.params.keyId;
  const keyType = req.params.keyType;
  const env = req.params.env;
  logger.info(`POST request to delete a key: ${req.path}`);
  applicationsDeveloperService.deleteApiKey(appId, keyId, keyType, env)
    .then(response => {
      notificationService.notify('Key successfully Deleted.', req);
      res.redirect(302, `/manage-applications/${appId}/view/${env}`);
    }).catch(
      err => {
        const viewData = routeUtils.createViewData('Delete Key', 'view-application', req);
        viewData.this_errors = routeUtils.processException(err);
        res.render(`${routeViews}/delete_key.njk`, viewData);
      }
    );
});

router.get('/manage-applications/:appId/:keyType/:keyId/update/:env', (req, res, next) => {
  logger.info(`GET request to update a key: ${req.path}`);
  const appId = req.params.appId;
  const env = req.params.env;
  const keyType = req.params.keyType;
  const keyId = req.params.keyId;
  const viewData = routeUtils.createViewData('Update Key', 'application-overview', req);
  viewData.this_data = {
    appId: appId,
    env: env,
    keyType: keyType,
    keyId: keyId
  };
  applicationsDeveloperService.getSpecificKey(appId, keyId, keyType, env)
    .then(keyData => {
      viewData.this_data.keyName = keyData.data.name;
      viewData.this_data.keyDescription = keyData.data.description;
      viewData.this_data.restrictedIps = keyData.data.restricted_ips;
      viewData.this_data.javaScriptDomains = keyData.data.js_domains;
      res.render(`${routeViews}/update_key.njk`, viewData);
    }).catch(err => {
      viewData.this_errors = routeUtils.processException(err);
      res.render(`${routeViews}/update_key.njk`, viewData);
    });
});

router.post('/manage-applications/:appId/:keyType/:keyId/update/:env', (req, res, next) => {
  logger.info(`POST request to update a key: ${req.path}`);
  const appId = req.params.appId;
  const env = req.params.env;
  const keyType = req.params.keyType;
  const keyId = req.params.keyId;
  const data = req.body;
  const viewData = routeUtils.createViewData('Update Key', 'application-overview', req);
  validator.updateKey(data)
    .then(_ => {
      return applicationsDeveloperService.updateKey(data, appId, keyId, env);
    }).then(updatedKey => {
      notificationService.notify(`'${updatedKey.data.name}' key has been updated'`, req);
      return res.redirect(302, `/manage-applications/${appId}/view/${env}`);
    }).catch(err => {
      viewData.this_data = data;
      viewData.this_data.appId = appId;
      viewData.this_data.env = env;
      viewData.this_data.keyType = keyType;
      viewData.this_data.keyId = keyId;
      viewData.this_errors = routeUtils.processException(err);
      res.render(`${routeViews}/update_key.njk`, viewData);
    });
});

module.exports = router;
