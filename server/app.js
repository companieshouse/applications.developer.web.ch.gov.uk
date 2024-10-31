const express = require('express');
const nunjucks = require('nunjucks');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');
const Redis = require('ioredis');

const app = express();
const morgan = require('morgan');
global.serverRoot = __dirname;

const { CsrfProtectionMiddleware } = require('@companieshouse/web-security-node');
const { SessionStore, SessionMiddleware } = require('@companieshouse/node-session-handler');
const Utility = require(`${serverRoot}/lib/Utility`);
const authentication = require(`${serverRoot}/routes/utils/authentication`);

// log requests
app.use(morgan('combined'));

// views path + engine set-up
app.set('views', [
  path.join(__dirname, 'views'),
  path.join(__dirname, '/../node_modules/govuk-frontend'),
  path.join(__dirname, '/../node_modules/@companieshouse')
]);

// set nunjucks options
const nunjucksLoaderOpts = {
  watch: process.env.NUNJUCKS_LOADER_WATCH !== 'false',
  noCache: process.env.NUNJUCKS_LOADER_NO_CACHE !== 'true'
};
const njk = new nunjucks.Environment(
  new nunjucks.FileSystemLoader(app.get('views'),
    nunjucksLoaderOpts)
);
njk.addGlobal('Date', function (d) {
  const date = new Date(Date.parse(d));
  const monthFormat = new Intl.DateTimeFormat('en', {
    month: 'long'
  });
  const day = date.getDate();
  const month = monthFormat.format(date);
  const year = date.getFullYear();
  const hour = date.getHours();
  const mins = date.getMinutes();
  const seconds = date.getSeconds();
  return `${day} ${month} ${year} - ${hour}:${mins}:${seconds}`;
});
njk.express(app);
app.set('view engine', 'njk');

// serve static files
app.use(express.static(path.join(__dirname, '/../app/public')));
// app.use('/assets', express.static(__dirname + '/../node_modules/govuk-frontend/govuk/assets'));

// parse body into req.body
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const sessionStore = new SessionStore(new Redis(`redis://${process.env.CACHE_SERVER}`));
const middleware = SessionMiddleware({
  cookieName: process.env.COOKIE_NAME,
  cookieDomain: process.env.COOKIE_DOMAIN,
  cookieSecureFlag: process.env.COOKIE_SECURE_ONLY,
  cookieTimeToLiveInSeconds: parseInt(process.env.DEFAULT_SESSION_EXPIRATION, 10),
  cookieSecret: process.env.COOKIE_SECRET
}, sessionStore);

app.use(middleware);

const csrfProtectionMiddleware = CsrfProtectionMiddleware({
  sessionStore,
  enabled: true,
  sessionCookieName: process.env.COOKIE_NAME
});

app.use(csrfProtectionMiddleware);

// unhandled errors
app.use((err, req, res, next) => {
  Utility.logException(err);
});

njk.addGlobal('cdnUrlCss', process.env.CDN_URL_CSS);
njk.addGlobal('cdnUrlJs', process.env.CDN_URL_JS);
njk.addGlobal('cdnHost', process.env.CDN_HOST);
njk.addGlobal('devHubUrl', process.env.DEV_HUB_URL);
njk.addGlobal('devSpecsUrl', process.env.DEVELOPER_SPECS_URL);
njk.addGlobal('chsUrl', process.env.CHS_URL);
njk.addGlobal('FUTURE_DISPLAY_FLAG', process.env.FUTURE_DISPLAY_FLAG);

// check if a user is logged in and redirect accordingly
app.use(authentication);

// channel all requests through the router
require('./router')(app);

// unhandled exceptions - ideally, should never get to this point
process.on('uncaughtException', err => {
  Utility.logException(err, 'uncaughtException');
  process.exit(1);
});

// unhandled promise rejections
process.on('unhandledRejection', err => {
  Utility.logException(err, 'uncaughtRejection');
  process.exit(1);
});

module.exports = app;
