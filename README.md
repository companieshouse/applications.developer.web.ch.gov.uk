
# API Filing Service - applications.developer.web

This is a Web Service that provides a means for registering and managing applications on the developer hub.
It is written using the [NodeJS](https://nodejs.org/en/) framework, and is intended to act as the user interface
through which developers can submit requests to the [applications api](https://github.com/companieshouse/applications.api.identity.ch.gov.uk).

## Dependencies

You'll need the following software installed before-hand:

- [NodeJS](https://nodejs.org/en/)
- [Docker](https://www.docker.com/)
- [Redis](https://redis.io/topics/quickstart)

## Downloading and installing

There are two ways to download, install and run this Web Service:
- via Docker, or
- locally, from your file system

### Docker installation

1. Clone [Docker CHS Development](https://github.com/companieshouse/docker-chs-development) and follow the steps in the README.
2. Run `chs-dev modules enable developer-hub`
3. Run `chs-dev development enable applications-developer-web-ch-gov-uk` (this will allow you to make changes).
4. Within the `applications-developer-web-ch-gov-uk` directory, run `make clean build`
5. Run docker using `chs-dev up` in the `docker-chs-development directory`.
6. Open your browser and go to page http://dev.chs.local/manage-applications
   Once the necessary applications have started up, the service should be accessible in you browser at: http://ches.local/manage-applications.

### Config set-up

- The example config file is located at `config/.env.example` and should be copied over to `config/.env`.
- In docker, this re-uses values located [in this yaml file](https://github.com/companieshouse/docker-chs-development/blob/master/services/modules/developer-hub/applications-developer-web-ch-gov-uk.docker-compose.yaml).

### Local installation

To run this Web Service outside of Docker, you'll still need to carry out the above installation first to get the API service working in order for this app to work.

Having successfully installed Vagrant above, clone the Web Service [project](https://github.com/companieshouse/applications.developer.web.ch.gov.uk) into your project root, and run the following commands:
```
cd applications.developer.web.ch.gov.uk
npm install && npm install mocha -g
```

#### Redis set-up

- Install and configure the Redis server on Mac OS X via Homebrew: `brew install redis`
- Start Redis with: `brew services start redis`. This will run Redis with a default port of `6379` on `127.0.0.1`
- Test if Redis is running by typing the command: `redis-cli ping`.  If it replies with `PONG`, then it's good to go!
- Stop Redis using brew: `brew services stop redis`

#### Running the app

Firstly, build client assets by running:
```
npm run build
```
If you're making changes to client Javascript and SCSS files, you can watch for changes with:
```
gulp watch
```
Then, to start the application, run:
```
npm start
```
or, to watch for changes with auto restart in your dev environment, run:
```
npm run watch
```
...and navigate to http://localhost:3000/manage-applications (or whatever hostname/port number combination you're using).

## Testing & coverage

To run the tests:
```
npm test
```
To view a summary of unit test coverage, run:
```
npm run coverage
```
To view the full coverage report, run:
```
npm run coverage:report
```
Linting:
```
npm run lint
```
To auto-fix any issues, run:
```
npm run lint:fix
```

### Logging

The Winston module (together with Morgan) are used for generating and managing this app's logs. When running the app locally, you can `tail` the log file at `server/logs/app.log`.


### Batch size

There is a maximum batch size for the number of applications, and keys, per query (currently set to 1,000,000) which is stored a variable, called DEFAULT_BATCH_SIZE. It can be found, and it's value edited, in `server/config/.env`.

### Endpoints

Path                                                                   | Method   | Description
---------------------------------------------------------------------- | -------- | --------------------------------------------------------------------
*` / `*                                                                | GET      | Show Companies House API overview
*` /manage-applications `*                                             | GET      | Show all applications
*` /manage-applications/add `*                                         | GET      | Show form to create an application
*` /manage-applications/add `*                                         | POST     | Create an application
*` /manage-applications/:appId/view/:env `*                            | GET      | Show selected application details
*` /manage-applications/:appId/update/:env/:confirm? `*                | GET      | Show confirmation page for delete application
*` /manage-applications/:appId/delete/:env `*                          | POST     | Delete application details and redirect to list
*` /manage-applications/:appId/update/:env `*                          | GET      | Show form to update an application
*` /manage-applications/:appId/update/:env `*                          | POST     | Update application details and redirect to view
*` /manage-applications/:appId/api-key/add/:env `*                     | GET      | Show form to create a new API client key
*` /manage-applications/:appId/api-key/add/:env `*                     | POST     | Save new API client key details and redirect to view
*` /manage-applications/:appId/:keyType/:keyId/delete/:env `*          | GET      | Show form to delete key
*` /manage-applications/:appId/:keyType/:keyId/delete/:env `*          | POST     | Delete key details and redirect to view
*` /manage-applications/:appId/:keyType/:keyId/update/:env `*          | GET      | Show form to update key details
*` /manage-applications/:appId/:keyType/:keyId/update/:env `*          | POST     | Update key details and redirect to view


### TO-DO


