import {Configuration} from "webpack";
import {resolve} from "path";

const entry = resolve(__dirname, 'public', 'index.js');
console.log(entry);

const webpackConfig: Configuration = {
    mode: "development",
    entry,
    output: {
        path: resolve(__dirname, '../public'),
        filename: 'webpack.bundle.js'
    }
};

export default webpackConfig;

// https://www.typescriptlang.org/docs/handbook/react-&-webpack.html