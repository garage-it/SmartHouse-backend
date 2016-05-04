/**
 * Populate DB with sample data on server start
 * to disable, edit config/env/%environment%.js, and set `seedDB: false`
 */

'use strict';
const mongoose = require('mongoose');
const Sensor = require('../API/sensors/sensor.model');

const sensors = [];

sensors.push(new Sensor({
    _id: mongoose.Types.ObjectId('41224d776a326fb40f000001'),
    description: 'some description',
    type: 'some type',
    mqttId: '1'
}));

sensors.push(new Sensor({
    description: 'some other description',
    type: 'some other type',
    mqttId: '2'
}));

function populateSensors() {
    Sensor.find({}).remove(function() {
        Sensor.create.apply(Sensor, sensors);
    });
}

export {populateSensors};
