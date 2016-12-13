import sensorModel from '../../API/sensors/sensor.model';

export default { populateDevices };

/* istanbul ignore next */
const devices = [];

devices.push(new sensorModel({
    description: 'temperature',
    type: 'sensor',
    metrics: 'celsius',
    mqttId: 'temperature'
}));

devices.push(new sensorModel({
    description: 'humidity',
    type: 'sensor',
    metrics: 'percents',
    mqttId: 'humidity'
}));

devices.push(new sensorModel({
    description: 'co2',
    type: 'sensor',
    metrics: 'percents',
    mqttId: 'co2'
}));

devices.push(new sensorModel({
    description: 'pressure',
    type: 'sensor',
    metrics: 'percents',
    mqttId: 'pressure'
}));

devices.push(new sensorModel({
    description: 'electricity',
    type: 'switcher',
    executor: false,
    mqttId: 'electricity'
}));

devices.push(new sensorModel({
    description: 'socket',
    type: 'switcher',
    executor: false,
    mqttId: 'socket'
}));

devices.push(new sensorModel({
    description: 'lock',
    type: 'switcher',
    executor: false,
    mqttId: 'lock'
}));

devices.push(new sensorModel({
    description: 'servo',
    type: 'servo type',
    metrics: 'degrees',
    mqttId: 'servo',
    servo: true
}));

function populateDevices() {
    return sensorModel.find({}).remove(function() {
        sensorModel.create(...devices);
    });
}
