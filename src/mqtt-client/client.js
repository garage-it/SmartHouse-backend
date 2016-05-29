/**
 * @file Reads config for the mqqt broker address,
 * connects to it and provides event data to the data hub
 */

import config from '../config/env';
import mqtt from 'mqtt';
import Debugger from 'debug';
import input from '../data-streams/input';

const debug = Debugger('mqtt-client');

const DEVICE_OUT_EVENT = '/smart-home/out/#';

// Create a client connection

const client = mqtt.connect({
    host: config.mqtt.hostname,
    port: config.mqtt.port,
    auth: `${config.mqtt.username}:${config.mqtt.password}`
});

client.on('connect', onConnect);

function onConnect() {
    client.subscribe(DEVICE_OUT_EVENT, onSubscribed);

    input.stream
        .filter(m => m.publish)
        .subscribe(publishEvent, onError);
}

function onSubscribed() {
    client.on('message', function (topic, rawMessage) {
        let message = {
            device: topic.split('/').pop(),
            value: rawMessage.toString()
        };

        console.log(`got message: topic '${topic}', message: '${rawMessage.toString()}'`); // eslint-disable-line
        debug(`got message: topic '${topic}', message: '${message}'`);
        input.write(message);

    });
}

function publishEvent(config) {
    client.publish(config.topic, config.message, function() {
        console.log(`>>[SWITCH] Send message: topic '${config.topic}', message: '${config.message}'`);// eslint-disable-line
        debug(`>>[SWITCH] Send message: topic '${config.topic}', message: '${config.message}'`);
        let message = {
            device: config.topic.split('/').pop(),
            value: config.message === 'true' ? 'ON': 'OFF'
        };
        input.write(message);
    });
}

function onError(err) {
    console.log(`Something went wrong: ${err.message}`);// eslint-disable-line
}

export default client;
