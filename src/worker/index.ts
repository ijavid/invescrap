import * as cron from 'node-cron';
import updateJob from "./update.job";

export default function startWorker() {
    cron.schedule('* * * * *', () => {
        console.log('running a task every minute');
        updateJob();
    });
}