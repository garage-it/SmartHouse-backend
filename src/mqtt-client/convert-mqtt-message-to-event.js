import {DEVICE_INFO, DEVICE_STATUS} from '../devices/event/event-type';
import inputEvent from '../devices/event/event';

export default function convertMqttMessageToEvent(topic, rawMessage) {
    const message = tryParseMessage(rawMessage);
    const eventType = getMessageEventType(message);
    const deviceName = getTopicDeviceName(topic);
    return inputEvent(eventType, deviceName, message);
}

function tryParseMessage(rawMessage) {
    try {
        return JSON.parse(rawMessage);
    } catch (e) {
        return rawMessage;
    }
}

function getTopicDeviceName(topic) {
    return topic.split('/').pop();
}

function getMessageEventType(message) {
    return typeof message === 'object'
        ? DEVICE_INFO
        : DEVICE_STATUS;
}
