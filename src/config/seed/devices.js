import sensorModel from '../../API/sensors/sensor.model';

export default { populateDevices };

/* istanbul ignore next */
const devices = [];

devices.push(new sensorModel({
    description: 'temperature',
    type: 'sensor',
    subType: 'temperature',
    metrics: 'celsius',
    mqttId: 'temperature'
}));

devices.push(new sensorModel({
    description: 'humidity',
    type: 'sensor',
    subType: 'humidity',
    metrics: 'percents',
    mqttId: 'humidity'
}));

devices.push(new sensorModel({
    description: 'co2',
    type: 'sensor',
    subType: 'co2',
    metrics: 'percents',
    mqttId: 'co2'
}));

devices.push(new sensorModel({
    description: 'pressure',
    type: 'sensor',
    subType: 'pressure',
    metrics: 'percents',
    mqttId: 'pressure'
}));

devices.push(new sensorModel({
    description: 'electricity',
    type: 'switcher',
    subType: 'electricity',
    executor: false,
    mqttId: 'electricity'
}));

devices.push(new sensorModel({
    description: 'socket',
    type: 'switcher',
    subType: 'socket',
    executor: false,
    mqttId: 'socket'
}));

devices.push(new sensorModel({
    description: 'lock',
    type: 'switcher',
    subType: 'lock',
    executor: false,
    mqttId: 'lock'
}));

devices.push(new sensorModel({
    description: 'servo',
    type: 'servo type',
    subType: 'servo',
    metrics: 'degrees',
    mqttId: 'servo',
    servo: true
}));

function populateDevices() {
    return sensorModel.find({}).remove(function() {
        sensorModel.create(...devices);
    });
}
