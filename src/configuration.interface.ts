export default interface Configuration {
    port: string|number,
    mongoUrl: string,
    env: string;
    logLevel: string;
    webpack: boolean;
};