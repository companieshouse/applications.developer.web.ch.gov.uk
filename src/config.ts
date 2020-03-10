import ApplicationConfiguration from "./ApplicationConfiguration";

const config: ApplicationConfiguration = {
    apiAddress: process.env.INTERNAL_API_URL as string,
    internalApiKey: process.env.CHS_INTERNAL_API_KEY as string,
    port: parseInt(process.env.APPLICATIONS_WEB_PORT as string),
    applicationNamespace: "applications.web",
    env: (process.env.NODE_ENV || "development").toLowerCase()
};

const httpsProxy = process.env.HTTPS_PROXY;

if (httpsProxy) {

    const proxyUrl = new URL(httpsProxy);

    config.proxy = {
        host: proxyUrl.hostname,
        port: parseInt(proxyUrl.port)
    };
}

export default config;
