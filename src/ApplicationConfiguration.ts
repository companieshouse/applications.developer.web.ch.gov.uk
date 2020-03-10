interface ApplicationConfiguration {
    port: number;
    // apiAddress: string;
    // internalApiKey: string;
    env: string;
    applicationNamespace: string;
    proxy?: {
        host: string;
        port: number;
    };
}

export = ApplicationConfiguration;
