const router = require('express').Router();
const logger = require(`${serverRoot}/config/winston`);

const ApplicationsDeveloperService = require(`${serverRoot}/services/ApplicationsDeveloper`);
const applicationsDeveloperService = new ApplicationsDeveloperService();

const Validator = require(`${serverRoot}/lib/validation/form_validators/ManageApplication`);
const validator = new Validator();

const routeUtils = require(`${serverRoot}/routes/utils`);
const routeViews = 'applications';

function createViewData (title, activePage) {
  console.log(process.env);
  return {
    this_data: null,
    this_errors: null,
    active_page: title,
    title: activePage,
    future_flag: process.env.APPLICATIONS_DEVELOPER_SERVICE_DISPLAY_FUTURE_FLAG
  };
}

router.get('(/manage-applications)?', (req, res, next) => {
  logger.info(`GET request to serve index page: ${req.path}`);
  const viewData = createViewData('Application overview', 'application-overview');
  console.log(viewData);
  Promise.all(
    [
      applicationsDeveloperService.getApplicationList('live'),
      applicationsDeveloperService.getApplicationList('test'),
      applicationsDeveloperService.getApplicationList('future')
    ]
  ).then(([listLive, listTest, listFuture]) => {
    viewData.this_data = {
      live: listLive.data,
      test: listTest.data,
      future: listFuture.data
    };
    res.render(`${routeViews}/index.njk`, viewData);
  }).catch(err => {
    viewData.this_errors = routeUtils.processException(err);
    res.render(`${routeViews}/index.njk`, viewData);
  });
});

router.get('/manage-applications/add', (req, res, next) => {
  logger.info(`GET request to serve add application page: ${req.path}`);
  const viewData = createViewData('Add an application', 'add-application');
  res.render(`${routeViews}/add.njk`, viewData);
});

router.post('/manage-applications/add', (req, res, next) => {
  logger.info(`POST request to process add application page: ${req.path}`);
  const viewData = createViewData('Add an application', 'add-application');
  viewData.this_data = req.body;
  validator.addApplication(req.body)
    .then(_ => {
      return applicationsDeveloperService.saveApplication(req.body);
    }).then(_ => {
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
  const viewData = createViewData('View application', 'view-application');
  Promise.all(
    [
      applicationsDeveloperService.getApplication(id, env),
      applicationsDeveloperService.getKeysForApplication(id, env)
    ]).then(([appData, keyData]) => {
    viewData.this_data = {
      appId: req.params.appId,
      app: appData.data,
      keys: keyData.data,
      env: env
    };
    viewData.title = `${viewData.title}: ${appData.data.name}`;
    res.render(`${routeViews}/view.njk`, viewData);
  }).catch(err => {
    viewData.this_errors = routeUtils.processException(err);
    res.render(`${routeViews}/view.njk`, viewData);
  });
});

router.get('/manage-applications/:appId/update/:env', (req, res, next) => {
  logger.info(`GET request to update application : ${req.path}`);
  const viewData = createViewData('Manage Application', 'application-overview');
  res.render(`${routeViews}/edit.njk`, viewData);
});

router.get('/manage-applications/:appId/delete', (req, res, next) => {
  logger.info(`GET request to serve index page: ${req.path}`);
  res.render(`${routeViews}/index.njk`);
});

router.get('/manage-applications/:appId/api-key/add', (req, res, next) => {
  logger.info(`GET request to serve index page: ${req.path}`);
  const viewData = createViewData('Add Key', 'application-overview');
  res.render(`${routeViews}/add_key.njk`, viewData);
});

router.get('/manage-applications/:appId/:keyType/:keyId/delete/:env', (req, res, next) => {
  logger.info(`GET request to serve delete a key page: ${req.path}`);
  const appId = req.params.appId;
  const keyId = req.params.keyId;
  const keyType = req.params.keyType;
  const env = req.params.env;
  const viewData = createViewData('Delete Key', 'view-application');
  applicationsDeveloperService.getSpecificKey(appId, keyId, keyType, env)
    .then(
      apiKey => {
        viewData.this_data = {
          appId: appId,
          keyId: keyId,
          keyType: keyType,
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
      res.redirect(302, '/manage-applications');
    }).catch(
      err => {
        const viewData = createViewData('Delete Key', 'view-application');
        viewData.this_errors = routeUtils.processException(err);
        res.render(`${routeViews}/delete_key.njk`, viewData);
      }
    );
});

router.get('/manage-applications/:appId/api-key/update', (req, res, next) => {
  logger.info(`GET request to update a key: ${req.path}`);
  const viewData = createViewData('Update Key', 'application-overview');
  res.render(`${routeViews}/update_key.njk`, viewData);
});

router.post('/manage-applications/:appId/api-key/update', (req, res, next) => {
  logger.info(`POST request to update a key: ${req.path}`);
  const viewData = createViewData('Update Key', 'application-overview');
  res.render(`${routeViews}/index.njk`, viewData);
});

module.exports = router;
