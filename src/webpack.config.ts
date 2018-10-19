import {Configuration} from "webpack-dev-server";
import {Configuration as OC} from "webpack";
import {resolve} from "path";
import {configuration} from "./config";

interface A extends Configuration, OC {

}

/*
 * For development purposes, see package.json: serve
 */
const webpackConfig: A  = {
    mode: "development",
    entry: {
        index: resolve(__dirname, 'public', 'index.js'),
        app:  resolve(__dirname, 'public', 'app.js'),
        basic:  resolve(__dirname, 'public', 'basic.js')
    },
    output: {
        path: resolve(__dirname, '../public'),
        filename: '[name].bundle.js'
    },
    devServer: {
        contentBase: resolve(__dirname, '../public'), // ???
        compress: true,
        port: 9000,
        proxy: {
            '/api': {
                target: 'http://localhost:' + configuration.port,
                secure: false
            }
        }
    },
    resolve: {
        alias: {
            vue: 'vue/dist/vue.js'
        }
    }
};

export default webpackConfig;

// https://www.typescriptlang.org/docs/handbook/react-&-webpack.html
// https://www.npmjs.com/package/webpack-dev-server
// https://medium.com/@drgenejones/proxying-an-external-api-with-webpack-serve-code-and-a-restful-data-from-separate-endpoints-4da9b8daf430
// https://webpack.js.org/configuration/dev-server/
