export default function event(eventName, deviceName, eventData) {
    return {
        event: eventName,
        device: deviceName,
        value: eventData
    };
}