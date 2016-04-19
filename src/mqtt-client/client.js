/**
 * @file Reads config for the mqqt broker address,
 * connects to it and provides event data to the data hub
 */

import config from '../config/env';
import mqtt from 'mqtt';
import Debugger from 'debug';
import input from '../data-streams/input';

const debug = Debugger('mqtt-client');

const EVENT_NAME = 'event';

// Create a client connection
const client = mqtt.connect({
    host: config.mqtt.host,
    port: config.mqtt.port,
    auth: `${config.mqtt.user}:${config.mqtt.pass}`
});

client.on('connect', onConnect);

function onConnect() {
    client.subscribe(EVENT_NAME, onSubscribed);
}

function onSubscribed() {
    client.on('message', function(topic, rawMessage) {
        let message = JSON.parse(rawMessage);
        debug(`got message: topic '${topic}', message: '${message}'`);
        input.write(message);
    });
}
