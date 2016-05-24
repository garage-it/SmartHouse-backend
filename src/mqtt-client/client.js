/**
 * @file Reads config for the mqqt broker address,
 * connects to it and provides event data to the data hub
 */

import config from '../config/env';
import mqtt from 'mqtt';
import Debugger from 'debug';
import input from '../data-streams/input';
import output from '../data-streams/output';

const debug = Debugger('mqtt-client');

const MQTT_INPUT_TOPIC_PREFIX = '/smart-home/out/';
const MQTT_OUTPUT_TOPIC_PREFIX = '/smart-home/in/';
// Create a client connection

const client = mqtt.connect({
    host: config.mqtt.hostname,
    port: config.mqtt.port,
    auth: `${config.mqtt.username}:${config.mqtt.password}`
});

client.on('connect', onConnect);

function onConnect() {

    client.subscribe(MQTT_INPUT_TOPIC_PREFIX + '#', onSubscribed);

    output.stream.subscribe(event => {
        client.publish(MQTT_OUTPUT_TOPIC_PREFIX + event.device, event.value);
    });
}

function onSubscribed() {
    client.on('message', function(topic, rawMessage) {
        debug(`got message: topic '${topic}', message: '${rawMessage.toString()}'`);

        let message = JSON.parse(rawMessage);
        let isDeviceInfo = typeof message === 'object';
        let event;

        if (isDeviceInfo) {
            event  = {
                event: 'add',
                value: message
            };
        }
        else {
            event = {
                device: topic.split('/').pop(),
                value: rawMessage.toString()
            };
        }
        input.write(event);
    });
}