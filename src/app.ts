import { createLogger, createLoggerMiddleware } from "ch-structured-logging";
import nunjucks, { ConfigureOptions } from "nunjucks";

import ApplicationRouter from "./routers/ApplicationRouter";
import config from "./config";
import express from "express";
import helmet from "helmet";
import path from "path";

const logger = createLogger(config.applicationNamespace);

const app = express();

const nunjucksConfig: ConfigureOptions = {
    autoescape: true,
    noCache: false,
    express: app
};

if (config.env === "development") {

    logger.info("Configuring nunjucks for development mode");
    nunjucksConfig.watch = true;
    nunjucksConfig.noCache = true;
}

nunjucks
    .configure([
        "views",
        "node_modules/govuk-frontend/",
        "node_modules/govuk-frontend/components/"
    ], nunjucksConfig);

app.set("view engine", "html");
app.use("/public", express.static(path.join(__dirname, "../dist")));

app.use(createLoggerMiddleware(config.applicationNamespace));
app.use(helmet());
app.use(express.urlencoded({ extended: true }));

// Add routers
app.use(ApplicationRouter.create());

app.listen(config.port, function () {
    logger.info(`Server started on port ${config.port}`);
});
