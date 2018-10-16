import mongoose from "mongoose";
import Configuration from "./configuration.interface";

export function setupDatabase(options: Configuration) {
    mongoose.Promise = Promise;
    return mongoose.connect(options.mongoUrl)
        .then(() => {
            console.log('Database connection successful', options.mongoUrl);
        })
        .catch(err => {
            console.error("MongoDB connection error. Please make sure MongoDB is running. " + err);
            throw err;
        });
}