// NOTE: this is a starter kit file
// TODO: refactor

import Promise from 'bluebird';
import mongoose from 'mongoose';
import config from './config/env';
import app from './config/express';
import * as seed from './config/seed';

const debug = require('debug')('Smart House Back-end');

// promisify mongoose
Promise.promisifyAll(mongoose);

// connect to mongo db
mongoose.connect(config.db, { server: { socketOptions: { keepAlive: 1 } } });
mongoose.connection.on('error', () => {
    throw new Error(`unable to connect to database: ${config.db}`);
});

if (config.seedDB) {
    debug('populating seed data');
    seed.populateSensors();
}

// listen on port config.port
app.listen(config.port, () => {
    debug(`server started on port ${config.port} (${config.env})`);
});

export default app;
