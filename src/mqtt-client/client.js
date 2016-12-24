/**
 * @file Reads config for the mqqt broker address,
 * connects to it and provides event data to the data hub
 */

import config from '../config/env';
import mqtt from 'mqtt';
import Debugger from 'debug';
import input from '../data-streams/input';
import output from '../data-streams/output';
import convertMqttMessageToEvent from './event/convert-mqtt-message-to-event';
import {DEVICE_STATUS} from './event/event-type';
import {INPUT, OUTPUT} from './topic-prefix';

const debug = Debugger('SH_BE:mqtt-client');

// Create a client connection

const client = mqtt.connect({
    host: config.mqtt.hostname,
    port: config.mqtt.port,
    auth: `${config.mqtt.username}:${config.mqtt.password}`
});

client
    .on('connect', onMqttConnect)
    .on('message', onMqttMessage);

function onMqttConnect() {
    client.subscribe(`${INPUT}#`);
    output.stream.subscribe(onInputEvent);
}

function onMqttMessage(topic, rawMessage) {
    debug(`MQTT >>. Got message: topic '${topic}', message: '${rawMessage.toString()}'`);
    const event = convertMqttMessageToEvent(topic, rawMessage);

    input.write(event);
    debug(`Added to input stream event: '${JSON.stringify(event)}'`);
}

function onInputEvent(event) {
    if (event.event === DEVICE_STATUS) {
        client.publish(OUTPUT + event.device, event.value);
    } else {
        debug(`Unknown output stream event received: '${JSON.stringify(event)}'`);
    }
}

export default client;
