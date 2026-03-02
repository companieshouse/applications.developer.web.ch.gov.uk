'use strict';
const path = require('path');

const sinonLib = require('sinon');
const chai = require('chai');
chai.should();
const chaiHttp = require('chai-http');
const chaiAsPromisedLib = require('chai-as-promised');
const sinonChai = require('sinon-chai');
const expectLib = require('chai');
const envVars = require('./env');

chai.use(chaiAsPromisedLib);
chai.use(chaiHttp);
chai.use(sinonChai);

// Expose all test libraries to app modules
global.sinon = sinonLib;
global.chai = chai;
global.chaiAsPromised = chaiAsPromisedLib;
global.expect = expectLib.expect;
global.request = chai.request;

global.testRoot = __dirname;
global.appRoot = path.join(__dirname, './../app');
global.serverRoot = path.join(__dirname, './../server');

envVars.setVars();
