import * as cron from 'node-cron';
import updateJob from "./update.job";
import Configuration from "../configuration.interface";

export default class Worker {

    constructor (
        private configuration: Configuration
    ) { }

    public runJobs() {
        updateJob().then(() => {
            console.log('jobs DONE');
        })
    }

    public start() {
        // every hour at 0 min
        cron.schedule('0 * * * *', () => {
            console.log('running a scheduled task');
            this.runJobs();
        });
    }
}
