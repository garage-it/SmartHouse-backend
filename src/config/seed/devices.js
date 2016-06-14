import mongoose from 'mongoose';
import sensorModel from '../../API/sensors/sensor.model';

export default { populateDevices }; 

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


function populateDevices() {
    return sensorModel.find({}).remove(function() {
        sensorModel.create(...devices);
    });
}
