import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compress from 'compression';
import methodOverride from 'method-override';
import cors from 'cors';
import httpStatus from 'http-status';
import expressWinston from 'express-winston';
import expressValidation from 'express-validation';
import winstonInstance from './winston';
import apiRoutes from '../API/index';
import pageRoutes from '../pages/index';
import config from './env';
import APIError from '../API/helpers/APIError';
import ExtendableError from '../API/helpers/ExtendableError';
import passport from 'passport';

const app = express();

if (config.env === 'development') {
    app.use(logger('dev'));
}

// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(compress());
app.use(methodOverride());

app.use(passport.initialize());
app.use(passport.session());

// disable 'X-Powered-By' header in response
app.disable('x-powered-by');

// enable CORS - Cross Origin Resource Sharing
app.use(cors());

// enable detailed API logging in dev env
if (config.env === 'development') {
    expressWinston.requestWhitelist.push('body');
    expressWinston.responseWhitelist.push('body');
    app.use(expressWinston.logger({
        winstonInstance,
        meta: true,     // optional: log meta data about request (defaults to true)
        msg: 'HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
        colorStatus: true     // Color the status code (default green, 3XX cyan, 4XX yellow, 5XX red).
    }));
}


if (config.staticPath) {
    /* eslint-disable no-console */
    console.log('Serve static files from: \x1b[36m' + config.staticPath + '\x1b[0m');
    /* eslint-enable no-console */
    app.use(express.static(config.staticPath));
}

// mount page routes on / path
app.use('/', pageRoutes);
// mount API routes on /api path
app.use('/api', apiRoutes);

// fallback for work with HTML5 History API
// should be defined after back-end routes (like /api)
if (config.staticPath) {
    app.get('/*', (req, res) => {
        res.sendFile(config.staticPath + '/index.html');
    });
}

// if error is not an instanceOf APIError, convert it.
app.use((err, req, res, next) => {
    if (err instanceof expressValidation.ValidationError) {
        // validation error contains errors which is an array of error each containing message[]
        const unifiedErrorMessage = err.errors.map(error => error.messages.join('. ')).join(' and ');
        const error = new APIError(unifiedErrorMessage, err.status, true);
        return next(error);
    } else if (!(err instanceof ExtendableError)) {
        const apiError = new APIError(err.message, err.status, err.isPublic);
        return next(apiError);
    }
    return next(err);
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new APIError('API not found', httpStatus.NOT_FOUND);
    return next(err);
});

// log error in winston transports except when executing test suite
if (config.env !== 'test') {
    app.use(expressWinston.errorLogger({
        winstonInstance
    }));
}

// error handler, send stacktrace only during development
app.use((err, req, res, next) =>        // eslint-disable-line no-unused-vars
    res.status(err.status).json({
        message: err.isPublic ? err.message : httpStatus[err.status],
        stack: config.env === 'development' ? err.stack : {}
    })
);

export default app;
