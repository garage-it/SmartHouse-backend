// NOTE: this is a starter kit file
// TODO: refactor

import Promise from 'bluebird';
import mongoose from 'mongoose';
import http from 'http';
import socketio from 'socket.io';
import socketApi from './API/socket/device-events';

import config from './config/env';
import app from './config/express';
import * as seed from './config/seed';
import './mqtt-client/client.js';
import './scenarios';

import Debugger from 'debug';
const debug = Debugger('SH_BE:main');
import trackDeviceConnection from  './devices/deviceConnected';
import handleUnknownDeviceData from  './devices/newDeviceHandler';

// promisify mongoose
Promise.promisifyAll(mongoose);

// connect to mongo db
mongoose.connect(config.db, { server: { socketOptions: { keepAlive: 1 } } });
mongoose.connection.on('error', () => {
    throw new Error(`unable to connect to database: ${config.db}`);
});

// Prepopulate data
if (config.seedDB) {
    debug('populating seed data');
    seed.populateSensors();
}

// Create websocket server
let server = http.createServer(app);
let io = socketio(server);
socketApi(io);

// listen on port config.port
server.listen(config.port, () => {
    debug(`server started on port ${config.port} (${config.env})`);
});

trackDeviceConnection();
handleUnknownDeviceData();

export default app;
