const router = require('express').Router();
const logger = require(`${serverRoot}/config/winston`);

const ApplicationsDeveloperService = require(`${serverRoot}/services/ApplicationsDeveloper`);
const applicationsDeveloperService = new ApplicationsDeveloperService();

const Validator = require(`${serverRoot}/lib/validation/form_validators/ManageApplication`);
const validator = new Validator();

const routeUtils = require(`${serverRoot}/routes/utils`);
const routeViews = 'applications';

router.get('(/manage-applications)?', (req, res, next) => {
  logger.info(`GET request to serve index page: ${req.path}`);
  const viewData = {
    this_data: req.data,
    this_errors: null,
    active_page: 'application-overview',
    title: 'Application overview'
  };
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
  const viewData = {
    this_data: null,
    this_errors: null,
    active_page: 'add-application',
    title: 'Add an application'
  };
  res.render(`${routeViews}/add.njk`, viewData);
});

router.post('/manage-applications/add', (req, res, next) => {
  logger.info(`POST request to process add application page: ${req.path}`);
  const viewData = {
    this_data: req.body,
    this_errors: null,
    active_page: 'add-application',
    title: 'Add an application'
  };
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
  const viewData = {
    this_data: null,
    this_errors: null,
    active_page: 'view-application',
    title: 'View application'
  };
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
  const viewData = {
    this_data: null,
    this_errors: null,
    active_page: 'application-overview'
  };
  res.render(`${routeViews}/edit.njk`, viewData);
});

router.get('/manage-applications/:appId/delete', (req, res, next) => {
  logger.info(`GET request to serve index page: ${req.path}`);
  res.render(`${routeViews}/index.njk`);
});

router.get('/manage-applications/:appId/api-key/add', (req, res, next) => {
  logger.info(`GET request to serve add application page: ${req.path}`);
  const viewData = {
    this_data: {
      appId: req.params.appId
    },
    this_errors: null,
    active_page: 'application-overview',
    title: 'Add Key'
  };
  res.render(`${routeViews}/add_key.njk`, viewData);
});

router.post('/manage-applications/:appId/api-key/add', (req, res, next) => {
  logger.info(`Post request to add new key and redirect to view application page: ${req.path}`);
  const viewData = {
    this_data: null,
    this_errors: null,
    active_page: 'application-overview'
  };
  console.log('add a key : ', req.data);
  applicationsDeveloperService.addNewKey(req.data, req.params.appId);
  res.render(`${routeViews}/add_key.njk`, viewData);
});

router.get('/manage-applications/:appId/api-key/delete', (req, res, next) => {
  logger.info(`GET request to serve index page: ${req.path}`);
  const viewData = {
    this_data: null,
    this_errors: null,
    active_page: 'view-application'
  };
  res.render(`${routeViews}/delete_key.njk`, viewData);
});

router.get('/manage-applications/:appId/api-key/update', (req, res, next) => {
  logger.info(`GET request to update a key: ${req.path}`);
  const viewData = {
    this_data: null,
    this_errors: null,
    active_page: 'application-overview'
  };
  res.render(`${routeViews}/update_key.njk`, viewData);
});

router.post('/manage-applications/:appId/api-key/update', (req, res, next) => {
  logger.info(`POST request to update a key: ${req.path}`);
  const viewData = {
    this_data: null,
    this_errors: null,
    active_page: 'application-overview'
  };
  res.render(`${routeViews}/index.njk`, viewData);
});

module.exports = router;
