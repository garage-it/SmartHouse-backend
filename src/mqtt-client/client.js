/**
 * @file Reads config for the mqqt broker address,
 * connects to it and provides event data to the data hub
 */

import config from '../config/env';
import mqtt from 'mqtt';
import Debugger from 'debug';
import input from '../data-streams/input';
import output from '../data-streams/output';
import convertMqttMessageToEvent from './convert-mqtt-message-to-event';
import {DEVICE_INFO, DEVICE_STATUS} from '../devices/event/event-type';
import {INPUT, OUTPUT} from './topic-prefix';
import uniqueQueue from './unique-queue';
import lock from './lock';

const debug = Debugger('SH_BE:mqtt-client');

const MQTT_DEVICE_INFO_TIMEOUT = 60 * 1000;

// Create a client connection

const client = mqtt.connect({
    host: config.mqtt.hostname,
    port: config.mqtt.port,
    auth: `${config.mqtt.username}:${config.mqtt.password}`
});

const deviceInfoPublishQueue = uniqueQueue();
const deviceInfoPublishQueueLock = lock();
let deviceInfoPublishQueueClearTimeout = 0;

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
    if (event.event === DEVICE_INFO) {
        deviceInfoPublishQueue.remove(event.device);
        deviceInfoPublishQueueLock.unlock();
        publishDeviceInfoEvent();
    }
    input.write(event);

    debug(`Added to input stream event: '${JSON.stringify(event)}'`);
}

function onInputEvent(event) {
    if (event.event === DEVICE_STATUS) {
        client.publish(OUTPUT + event.device, event.value);
    } else if (event.event === DEVICE_INFO) {
        publishDeviceInfoEvent(event.device);
    } else {
        debug(`Unknown output stream event received: '${JSON.stringify(event)}'`);
    }
}

function publishDeviceInfoEvent(device) {

    device && deviceInfoPublishQueue.enqueue(device);

    if (!deviceInfoPublishQueueLock.isLocked) {
        clearTimeout(deviceInfoPublishQueueClearTimeout);
        if (!deviceInfoPublishQueue.isEmpty) {
            deviceInfoPublishQueueLock.lock();
            client.publish(OUTPUT + DEVICE_INFO, deviceInfoPublishQueue.dequeue());
            deviceInfoPublishQueueClearTimeout = setTimeout(clearDeviceInfoPublishQueue, MQTT_DEVICE_INFO_TIMEOUT);
        }
    }
}

function clearDeviceInfoPublishQueue() {
    deviceInfoPublishQueue.clear();
    deviceInfoPublishQueueLock.unlock();
    debug('Queue cleared by timeout');
}

export default client;
