import * as cron from 'node-cron';
import updateJob from "./update.job";
import Config from "../config";

export default class Worker {

    constructor (
        private configuration: Config
    ) { }

    public runJobs() {
        updateJob().then(() => {
            console.log('jobs DONE');
        })
    }

    public start() {
        // every hour at 0 min -- '0 * * * *'
        // at 23 hour at 0 min -- '0 * * * *'
        cron.schedule('0 23 * * *', () => {
            console.log('running a scheduled task');
            this.runJobs();
        });
    }
}
