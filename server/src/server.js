/**
 * Created by g.kosharov on 28.8.2016
 */

import Express from 'express';
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import logger from 'morgan'
import path from 'path'
import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import config from '../../webpack.config'
import mongoConfig from './config/mongo'
import restConfig from './config/rest'
import historyApiFallbackMiddleware from 'express-history-api-fallback'
import mongoSeed from './mongoSeed'
import User from './models/user'
import isArray from 'lodash/lang/isArray'
import includes from 'lodash/collection/includes'
import find from 'lodash/collection/find'
import findIndex from 'lodash/array/findIndex'
import forEach from 'lodash/collection/forEach'
import every from 'lodash/collection/every'

const NODE_ENV = process.env.NODE_ENV || 'development';

console.log(`NODE_ENV: ${NODE_ENV}`);

const webPackServerPort = process.env.PORT || 3000;
const expressPort = restConfig[NODE_ENV].port;

var pathToStatic = '/public';

if (NODE_ENV == 'production') {
    pathToStatic = __dirname + '/../../public';
}

// Initialize the Express App
const app = Express()
    .use(cors({
        "origin": true,
        "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
        "credentials": true
    }))
    .use(logger('dev'))
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({extended: false}))
    .use(cookieParser())
    .use(Express.static(pathToStatic))
    .use('/api', gameRouter)
    .use(function (req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    })
    .use(historyApiFallbackMiddleware(
        'index.html', {root: path.resolve(__dirname, "..", "public")}
    ))
    .listen(expressPort, restConfig[NODE_ENV].hostname, (error) => {
        if (!error) {
            console.log(`REST api is running on port ${expressPort}`); // eslint-disable-line
        } else {
            console.error("Rest api failed with error: " + JSON.stringify(error));
        }
    });

// MongoDB Connection
mongoose.connect(mongoConfig[NODE_ENV].mongoURL, (error) => {
    if (error) {
        console.error(`Please make sure Mongodb is installed and running on ${mongoConfig.local.mongoURL}`);
        throw error;
    }

    // feed some dummy data in DB.
    mongoSeed(User);
});

if (process.env.NODE_ENV != 'production') {

    /* setup static content */
    var webPackServer = new WebpackDevServer(webpack(config), {
        publicPath: '/public/',
        hot: true,
        historyApiFallback: {
            index: '/public/index.html'
        },
        stats: {
            colors: true
        }
    });

    webPackServer.listen(webPackServerPort, restConfig[NODE_ENV].hostname || '0.0.0.0', function (err) {
        if (err) {
            console.log("Webpack server failed with " + JSON.stringify(err));
        }

        console.log(`Webpack dev server listening at ${restConfig[NODE_ENV].hostname}:${webPackServerPort}`);
    });
}

export default app;
