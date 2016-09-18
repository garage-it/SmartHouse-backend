import mongoose from 'mongoose';
import sensorModel from '../../API/sensors/sensor.model';

export default { populateDevices };

/* istanbul ignore next */
const devices = [];

devices.push(new sensorModel({
    _id: mongoose.Types.ObjectId('41224d776a326fb40f000001'),
    description: 'some description',
    type: 'some type',
    metrics: 'meters',
    mqttId: 'distance'
}));

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

function populateDevices() {
    return sensorModel.find({}).remove(function() {
        sensorModel.create(...devices);
    });
}
