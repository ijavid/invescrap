import Server from "./server";
import {setupDatabase} from "./database";
import Worker from "./worker";
import {configuration} from "./config";

const server = new Server(configuration);
const worker = new Worker(configuration);

// not required, using webpack-dev-server instead
// server.compileWebpack();

setupDatabase(configuration).then(() => {
    server.start();
    worker.start();

    // run jobs at startup!
    // worker.runJobs();
});
