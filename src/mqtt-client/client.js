/**
 * @file Reads config for the mqqt broker address,
 * connects to it and provides event data to the data hub
 */

import config from '../config/env';
import mqtt from 'mqtt';
import Debugger from 'debug';
import input from '../data-streams/input';
import output from '../data-streams/output';

const debug = Debugger('SH_BE:mqtt-client');

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
    client.subscribe(`${MQTT_INPUT_TOPIC_PREFIX}#`, onSubscribed);

    output.stream.subscribe(event => {
        let message, topic = MQTT_OUTPUT_TOPIC_PREFIX;

        if ( event.event === 'status') {
            message = event.value;
            topic += event.device;
        } else  if (event.event === 'device-info') {
            message = event.device;
            topic += 'device-info';
        } else {
            debug(`Unknown output stream event received: '${JSON.stringify(event)}'`);
            return;
        }

        client.publish(topic, message);
    });
}

function onSubscribed() {
    client.on('message', function (topic, rawMessage) {
        debug(`MQTT >>. Got message: topic '${topic}', message: '${rawMessage.toString()}'`);
        let message = '';
        try {
            message = JSON.parse(rawMessage);
        } catch (e) {
            message = rawMessage.toString();
        }
        let isDeviceInfo = typeof message === 'object';
        let event,
            deviceName = topic.split('/').pop();

        if (isDeviceInfo) {
            event  = {
                event: 'device-info',
                device: deviceName,
                value: message
            };
        }
        else {
            event = {
                event: 'status',
                device: deviceName,
                value: rawMessage.toString()
            };
        }
        input.write(event);
        debug(`Added to input stream event: '${JSON.stringify(event)}'`);
    });
}

export default client;
