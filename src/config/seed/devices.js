import mongoose from 'mongoose';
import sensorModel from '../../API/sensors/sensor.model';

export default { populateDevices }; 

const devices = [];

devices.push(new sensorModel({
    _id: mongoose.Types.ObjectId('41224d776a326fb40f000001'),
    description: 'some description',
    type: 'some type',
    mqttId: 'distance'
}));

devices.push(new sensorModel({
    description: 'temperature',
    type: 'some other type',
    mqttId: 'temperature'
}));

devices.push(new sensorModel({
    description: 'humidity',
    type: 'some other type',
    mqttId: 'humidity'
}));


function populateDevices() {
    sensorModel.find({}).remove(function() {
        sensorModel.create(...devices);
    });
}
