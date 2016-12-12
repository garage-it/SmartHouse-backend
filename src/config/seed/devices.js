import sensorModel from '../../API/sensors/sensor.model';

export default { populateDevices };

/* istanbul ignore next */
const devices = [];

devices.push(new sensorModel({
    description: 'temperature',
    type: 'some other type',
    metrics: 'celsius',
    mqttId: 'temperature'
}));

devices.push(new sensorModel({
    description: 'humidity',
    type: 'some other type',
    metrics: 'percents',
    mqttId: 'humidity'
}));

devices.push(new sensorModel({
    description: 'servo',
    type: 'servo type',
    metrics: 'degrees',
    mqttId: 'servo',
    servo: true
}));

devices.push(new sensorModel({
    description: 'switcher',
    type: 'some other type',
    metrics: 'boolean',
    mqttId: 'switcher'
}));

function populateDevices() {
    return sensorModel.find({}).remove(function() {
        sensorModel.create(...devices);
    });
}
