import Promise from 'bluebird';
import mongoose from 'mongoose';
import http from 'http';
import socketio from 'socket.io';
import socketApi from './API/socket';

import config from './config/env';
import app from './config/express';
import * as seed from './config/seed';
import './mqtt-client/client.js';
import './scenarios';

import Debugger from 'debug';
const debug = Debugger('SH_BE:main');
import timeSeriesService from './API/timeseries/timeseries.service';
import saveDeviceLastValue from './devices/saveDeviceLastValue';

// promisify mongoose
Promise.promisifyAll(mongoose);
mongoose.Promise = Promise;

// connect to mongo db
mongoose.connect(config.db, { server: { socketOptions: { keepAlive: 1 } } });
mongoose.connection.on('error', () => {
    throw new Error(`unable to connect to database: ${config.db}`);
});

// Prepopulate data
if (config.seedDB) {
    debug('populating seed data');
    seed.populateUsers();
    seed.populateScenarios();
    seed.populateSensors();
}

// Create websocket server
let server = http.createServer(app);
let io = socketio(server);
socketApi(io);

// listen on port config.port
server.listen(config.port, config.host, () => {
    /* eslint-disable no-console */
    console.log(`Server started on \x1b[36m port:${config.port} (${config.env}) \x1b[0m`);
    /* eslint-enable no-console */
});

timeSeriesService.saveStatisticToDB();

saveDeviceLastValue();

export default app;
