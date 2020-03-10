import axios from "axios";
import config from "../config";
import tunnel = require("tunnel");

/**
 * Please update the config variables required. Add them to ApplicationConfig.ts if you don't require internal APIs.
 * Then delete this comment :D
 */

const requiredHeaders = {
    "Authorization": config.internalApiKey
};

const agent = config.proxy === undefined ?
    undefined :
    tunnel.httpsOverHttp({
        proxy: config.proxy
    });

const axiosInstance = axios.create({
    baseURL: `${config.apiAddress}/internal/restricted-word`,
    headers: requiredHeaders,
    timeout: 10000,
    proxy: false,
    httpsAgent: agent
});

export = axiosInstance;
