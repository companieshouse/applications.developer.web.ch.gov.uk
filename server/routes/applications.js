const router = require('express').Router();
const logger = require(`${serverRoot}/config/winston`);

const Validator = require(`${serverRoot}/lib/validation`);
const validator = new Validator();

const routeUtils = require(`${serverRoot}/routes/utils`);
const routeViews = 'applications';

router.get('/', (req, res, next) => {
  logger.info(`GET request to serve index page: ${req.path}`);
  let viewData = {
    this_data: {
      active_page: 'application-overview'
    },
    this_errors: {}
  }
  res.render(`${routeViews}/index.njk`, viewData);
});

router.get('/manage-applications/add', (req, res, next) => {
  logger.info(`GET request to serve add application page: ${req.path}`);
  let viewData = {
    this_data: {
      active_page: 'add-application'
    },
    this_errors: {}
  }
  res.render(`${routeViews}/add.njk`, viewData);
});

router.post('/manage-applications/add', (req, res, next) => {
  logger.info(`POST request to process add application page: ${req.path}`);
  res.redirect(302, '/');
});

router.get('/manage-applications/:appId/view', (req, res, next) => {
  logger.info(`GET request to view a single application: ${req.path}`);
  let viewData = {
    this_data: {
      active_page: 'view-application'
    },
    this_errors: {}
  }
  res.render(`${routeViews}/view.njk`, viewData);
});

router.get('/manage-applications/:appId/update', (req, res, next) => {
  logger.info(`GET request to serve index page: ${req.path}`);
  res.render(`${routeViews}/index.njk`);
});

router.get('/manage-applications/:appId/delete', (req, res, next) => {
  logger.info(`GET request to serve index page: ${req.path}`);
  res.render(`${routeViews}/index.njk`);
});

router.get('/manage-applications/:appId/api-key/add', (req, res, next) => {
  logger.info(`GET request to serve index page: ${req.path}`);
  res.render(`${routeViews}/index.njk`);
});

router.get('/manage-applications/:appId/api-key/delete', (req, res, next) => {
  logger.info(`GET request to serve index page: ${req.path}`);
  res.render(`${routeViews}/index.njk`);
});

router.post('/manage-applications/:appId/api-key/update', (req, res, next) => {
  logger.info(`POST request to update a key: ${req.path}`);
  res.render(`${routeViews}/index.njk`);
});



module.exports = router;
