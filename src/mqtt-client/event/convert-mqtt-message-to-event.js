import {DEVICE_STATUS} from './event-type';

export default function convertMqttMessageToEvent(topic, rawMessage) {
    const message = rawMessage.toString();
    const eventType = DEVICE_STATUS;
    const deviceName = getTopicDeviceName(topic);

    return buildEventModel(eventType, deviceName, message);
}

function getTopicDeviceName(topic) {
    return topic.split('/').pop();
}

function buildEventModel(eventName, deviceName, eventData) {
    return {
        event: eventName,
        device: deviceName,
        value: eventData
    };
}

