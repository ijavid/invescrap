"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const entry = path_1.resolve(__dirname, 'public', 'index.js');
console.log(entry);
const webpackConfig = {
    entry,
    output: {
        path: path_1.resolve(__dirname, '../public'),
        filename: 'webpack.bundle.js'
    }
};
exports.default = webpackConfig;
