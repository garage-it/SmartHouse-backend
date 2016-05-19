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

const MQTT_INPUT_TOPIC_FILTER = '/smart-home/out/#';
const MQTT_OUTPUT_TOPIC_PREFIX = '/smart-home/in/';

// Create a client connection

const client = mqtt.connect({
    host: config.mqtt.hostname,
    port: config.mqtt.port,
    auth: `${config.mqtt.username}:${config.mqtt.password}`
});

client.on('connect', onConnect);

function onConnect() {
    client.subscribe(MQTT_INPUT_TOPIC_FILTER, onSubscribed);

    output.stream.subscribe(event => {
        client.publish(MQTT_OUTPUT_TOPIC_PREFIX + event.device, event.value);
    });
}

function onSubscribed() {
    client.on('message', function(topic, rawMessage) {
        debug(`got message: topic '${topic}', message: '${rawMessage.toString()}'`);

        let event = {
            device: topic.split('/').pop(),
            value: rawMessage.toString()
        };
        input.write(event);

    });
}
