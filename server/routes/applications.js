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
    this_data: null,
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
    console.log('GET LIST ALL: ', viewData.this_data.test);
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
  validator.validateApplication(req.body, false)
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

router.get('/manage-applications/:appId/update/:env', (req, res) => {
  logger.info(`GET request to serve update application page: ${req.path}`);
  const id = req.params.appId;
  const env = req.params.env;
  const viewData = {
    this_data: {
      appId: id,
      env: env
    },
    this_errors: null,
    active_page: 'application-overview',
    title: 'Edit application'
  };

  applicationsDeveloperService.getApplication(id, env)
    .then(appData => {
      viewData.this_data.applicationName = appData.data.name;
      viewData.this_data.description = appData.data.description;
      viewData.this_data.privacyPolicy = appData.data.privacy_policy_url;
      viewData.this_data.terms = appData.data.terms_and_conditions_url;
      console.log('APP DATA: ', appData);
      res.render(`${routeViews}/edit.njk`, viewData);
    }).catch(err => {
      viewData.this_errors = routeUtils.processException(err);
      res.render(`${routeViews}/edit.njk`, viewData);
    });
});

router.post('/manage-applications/:appId/update/:env', (req, res) => {
  logger.info(`PUT request to update the application: ${req.path}`);
  const payload = req.body;
  payload.env = req.params.env;
  payload.appId = req.params.appId;
  const viewData = {
    this_data: payload,
    this_errors: null,
    active_page: 'application-overview',
    title: 'Update an application'
  };
  validator.validateApplication(payload, true)
    .then(_ => {
      return applicationsDeveloperService.updateApplication(payload);
    }).then(_ => {
      return res.redirect(302, '/manage-applications');
    }).catch(err => {
      viewData.this_errors = routeUtils.processException(err);
      console.log(viewData.this_errors);
      res.render(`${routeViews}/edit.njk`, viewData);
    });
});

router.get('/manage-applications/:appId/delete', (req, res, next) => {
  logger.info(`GET request to serve index page: ${req.path}`);
  res.render(`${routeViews}/index.njk`);
});

router.get('/manage-applications/:appId/api-key/add', (req, res, next) => {
  logger.info(`GET request to serve index page: ${req.path}`);
  const viewData = {
    this_data: null,
    this_errors: null,
    active_page: 'application-overview',
    title: 'Add Key'
  };
  res.render(`${routeViews}/add_key.njk`, viewData);
});

router.get('/manage-applications/:appId/api-key/delete', (req, res, next) => {
  logger.info(`GET request to serve index page: ${req.path}`);
  const viewData = {
    this_data: null,
    this_errors: null,
    active_page: 'view-application',
    title: 'Delete Key'
  };
  res.render(`${routeViews}/delete_key.njk`, viewData);
});

router.get('/manage-applications/:appId/api-key/update', (req, res, next) => {
  logger.info(`GET request to update a key: ${req.path}`);
  const viewData = {
    this_data: null,
    this_errors: null,
    active_page: 'application-overview',
    title: 'Update Key'
  };
  res.render(`${routeViews}/update_key.njk`, viewData);
});

router.post('/manage-applications/:appId/api-key/update', (req, res, next) => {
  logger.info(`POST request to update a key: ${req.path}`);
  const viewData = {
    this_data: null,
    this_errors: null,
    active_page: 'application-overview',
    title: 'Update Key'
  };
  res.render(`${routeViews}/index.njk`, viewData);
});

module.exports = router;
