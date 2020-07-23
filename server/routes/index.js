const router = require('express').Router();
const logger = require(`${serverRoot}/config/winston`);

const Validator = require(`${serverRoot}/lib/validation`);
const validator = new Validator();

const routeUtils = require(`${serverRoot}/routes/utils`);
const routeViews = 'index';

router.get('/', (req, res, next) => {
  logger.info(`GET request to serve index page: ${req.path}`);
  res.render(`${routeViews}/index.njk`);
});

module.exports = router;
