const router = require('express').Router();
const logger = require(`${serverRoot}/config/winston`);

const Utility = require(`${serverRoot}/lib/Utility`);

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
  const oauthToken = Utility.getOAuthToken(req);
  const viewData = routeUtils.createViewData('Application overview', 'application-overview', req);
  const applicationQueries = [
    applicationsDeveloperService.getApplicationList(oauthToken, 'live'),
    applicationsDeveloperService.getApplicationList(oauthToken, 'test')
  ];
  const futureFlag = process.env.FUTURE_DISPLAY_FLAG;
  if (futureFlag === 'true') {
    applicationQueries.push(applicationsDeveloperService.getApplicationList(oauthToken, 'future'));
  };
  Promise.all(applicationQueries).then(([listLive, listTest, listFuture]) => {
    if (listFuture === undefined) {
      viewData.this_data = {
        live: listLive,
        test: listTest
      };
    } else {
      viewData.this_data = {
        live: listLive,
        test: listTest,
        future: listFuture
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
  viewData.back_link = {
    message: 'Back to all Applications',
    link: '/manage-applications'
  };
  res.render(`${routeViews}/add.njk`, viewData);
});

router.post('/manage-applications/add', (req, res, next) => {
  logger.info(`POST request to process add application page: ${req.path}`);
  const oauthToken = Utility.getOAuthToken(req);
  const viewData = routeUtils.createViewData('Add an application', 'add-application', req);
  viewData.this_data = req.body;
  validator.addApplication(req.body)
    .then(_ => {
      return applicationsDeveloperService.saveApplication(req.body, oauthToken);
    }).then(_ => {
      notificationService.notify(`'${req.body.applicationName}' application has been created.`, req);
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
  const oauthToken = Utility.getOAuthToken(req);
  logger.info(`GET single application with id=[${id}] from env=[${env}]`);
  const viewData = routeUtils.createViewData('View application', 'view-application', req);
  viewData.this_data = {
    appId: req.params.appId,
    env: env
  };
  viewData.back_link = {
    message: 'Back to all Applications',
    link: '/manage-applications'
  };
  viewData.this_errors = null;
  Promise.all(
    [
      applicationsDeveloperService.getApplication(id, oauthToken, env),
      applicationsDeveloperService.getAPIClientsForApplication(id, oauthToken, env)
    ]).then(([appData, keyData]) => {
    logger.info(`appData=[${JSON.stringify(appData)}]`);
    viewData.this_data.app = appData;
    viewData.this_data.keys = keyData;
    viewData.title = `${viewData.title}: ${appData.name}`;
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
  const oauthToken = Utility.getOAuthToken(req);
  const viewData = routeUtils.createViewData('Edit application', 'application-overview', req);
  viewData.this_data = {
    appId: id,
    env: env,
    confirmDelete: confirmDelete
  };
  viewData.back_link = {
    message: 'Back to all Applications',
    link: '/manage-applications'
  };
  applicationsDeveloperService.getApplication(id, oauthToken, env)
    .then(appData => {
      viewData.this_data.applicationName = appData.name;
      viewData.this_data.description = appData.description;
      viewData.this_data.privacyPolicy = appData.privacyPolicyUrl;
      viewData.this_data.terms = appData.termsAndConditionsUrl;
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
  const oauthToken = Utility.getOAuthToken(req);
  const viewData = routeUtils.createViewData('Edit application', 'application-overview', req);

  applicationsDeveloperService.deleteApplication(appId, oauthToken, env)
    .then(_ => {
      notificationService.notify(`'${req.body.appName}' application has been deleted.`, req);
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
  const oauthToken = Utility.getOAuthToken(req);
  const payload = req.body;
  payload.env = env;
  payload.appId = appId;
  validator.updateApplication(payload)
    .then(_ => {
      return applicationsDeveloperService.updateApplication(payload, oauthToken);
    }).then(_ => {
      notificationService.notify(`'${payload.applicationName}' application has been updated.`, req);
      return res.redirect(302, `/manage-applications/${appId}/view/${env}`);
    }).catch(err => {
      const viewData = routeUtils.createViewData('Update an application', 'application-overview', req);
      viewData.this_data = payload;
      viewData.back_link = {
        message: 'Back to all Applications',
        link: '/manage-applications'
      };
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
  viewData.back_link = {
    message: 'Back to all Applications',
    link: '/manage-applications'
  };
  res.render(`${routeViews}/add_key.njk`, viewData);
});

router.post('/manage-applications/:appId/api-key/add/:env', (req, res, next) => {
  logger.info(`Post request to add new key and redirect to view application page: ${req.path}`);
  const oauthToken = Utility.getOAuthToken(req);
  validator.addNewKey(req.body)
    .then(_ => {
      applicationsDeveloperService.addNewKey(req.body, req.params.appId, oauthToken, req.params.env);
    }).then(_ => {
      notificationService.notify(`'${req.body.keyName}' key has been created.`, req);
      return res.redirect(302, '/manage-applications/' + req.params.appId + '/view/' + req.params.env);
    }).catch(err => {
      const viewData = routeUtils.createViewData('Add Key', 'application-overview', req);
      viewData.this_data = {
        body: req.body,
        appId: req.params.appId,
        env: req.params.env
      };
      viewData.back_link = {
        message: 'Back to all Applications',
        link: '/manage-applications'
      };
      viewData.this_errors = routeUtils.processException(err);
      res.render(`${routeViews}/add_key.njk`, viewData);
    });
});

router.get('/manage-applications/:appId/:keyType/:keyId/delete/:env', (req, res, next) => {
  logger.info(`GET request to serve delete a key page: ${req.path}`);
  const appId = req.params.appId;
  const keyId = req.params.keyId;
  const keyType = req.params.keyType;
  const oauthToken = Utility.getOAuthToken(req);
  const env = req.params.env;
  const viewData = routeUtils.createViewData('Delete Key', 'view-application', req);
  viewData.back_link = {
    message: 'Back to all Applications',
    link: '/manage-applications'
  };
  applicationsDeveloperService.getAPIClient(appId, keyId, keyType, oauthToken, env)
    .then(
      apiKey => {
        viewData.this_data = {
          appId: appId,
          keyId: keyId,
          keyType: keyType,
          keyKind: apiKey.kind,
          env: env,
          keyName: apiKey.name
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
  const oauthToken = Utility.getOAuthToken(req);
  const env = req.params.env;
  logger.info(`POST request to delete a key: ${req.path}`);
  applicationsDeveloperService.deleteAPIClient(appId, keyId, keyType, oauthToken, env)
    .then(response => {
      notificationService.notify(`'${req.body.keyName}' key has been deleted.`, req);
      res.redirect(302, `/manage-applications/${appId}/view/${env}`);
    }).catch(
      err => {
        const viewData = routeUtils.createViewData('Delete Key', 'view-application', req);
        viewData.back_link = {
          message: 'Back to all Applications',
          link: '/manage-applications'
        };
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
  const oauthToken = Utility.getOAuthToken(req);
  const viewData = routeUtils.createViewData('Update Key', 'application-overview', req);
  viewData.this_data = {
    appId: appId,
    env: env,
    keyType: keyType,
    keyId: keyId
  };
  viewData.back_link = {
    message: 'Back to Application',
    link: `/manage-applications/${appId}/view/${env}`
  };
  applicationsDeveloperService.getAPIClient(appId, keyId, keyType, oauthToken, env)
    .then(keyData => {
      viewData.this_data.keyName = keyData.name;
      viewData.this_data.keyDescription = keyData.description;
      viewData.this_data.restrictedIps = keyData.restrictedIPs;
      viewData.this_data.javaScriptDomains = keyData.jsDomains;
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
  const oauthToken = Utility.getOAuthToken(req);
  validator.updateKey(data)
    .then(_ => {
      return applicationsDeveloperService.updateKey(data, appId, keyId, oauthToken, env);
    }).then(updatedKey => {
      console.log(updatedKey);
      notificationService.notify(`'${updatedKey.name}' key has been updated'`, req);
      return res.redirect(302, `/manage-applications/${appId}/view/${env}`);
    }).catch(err => {
      const viewData = routeUtils.createViewData('Update Key', 'application-overview', req);
      viewData.this_data = data;
      viewData.this_data.appId = appId;
      viewData.this_data.env = env;
      viewData.this_data.keyType = keyType;
      viewData.this_data.keyId = keyId;
      viewData.this_errors = routeUtils.processException(err);
      viewData.back_link = {
        message: 'Back to Application',
        link: `/manage-applications/${appId}/view/${env}`
      };
      res.render(`${routeViews}/update_key.njk`, viewData);
    });
});

module.exports = router;
