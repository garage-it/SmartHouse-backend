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
const DEVICE_INFO_EVENT = 'device-info';
const DEVICE_STATUS_EVENT = 'status';
const MQTT_DEVICE_INFO_TIMEOUT = 60 * 1000;

// Create a client connection

const client = mqtt.connect({
    host: config.mqtt.hostname,
    port: config.mqtt.port,
    auth: `${config.mqtt.username}:${config.mqtt.password}`
});

let blockPublishing = false,
    publishingQueue = new Set();

client.on('connect', onMqttConnect);
client.on('message', onMqttMessage);

function onMqttConnect() {
    client.subscribe(`${MQTT_INPUT_TOPIC_PREFIX}#`);
    output.stream.subscribe(onInputEvent);
}

function onMqttMessage(topic, rawMessage) {
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

        publishingQueue.delete(deviceName);
        blockPublishing = false;
        publishDeviceInfoEvent();

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
}

function onInputEvent(event) {
    let message, topic = MQTT_OUTPUT_TOPIC_PREFIX;

    if ( event.event === DEVICE_STATUS_EVENT) {
        message = event.value;
        topic += event.device;
    } else  if (event.event === DEVICE_INFO_EVENT) {

        publishDeviceInfoEvent(event.device);
        return;

    } else {
        debug(`Unknown output stream event received: '${JSON.stringify(event)}'`);
        return;
    }

    client.publish(topic, message);
}

function publishDeviceInfoEvent (device) {
    let timeoutTimer;

    if (device) {
        publishingQueue.add(device);
    }

    if (!blockPublishing) {
        if (timeoutTimer) {
            clearTimeout(timeoutTimer);
        }
        if (publishingQueue.size) {
            blockPublishing = true;
            client.publish(MQTT_OUTPUT_TOPIC_PREFIX + DEVICE_INFO_EVENT, [...publishingQueue][0]);

            timeoutTimer = setTimeout(() => {
                blockPublishing = false;
                publishingQueue.clear();
                debug('Queue cleared by timeout');
            }, MQTT_DEVICE_INFO_TIMEOUT);
        }
    }
}

export default client;
