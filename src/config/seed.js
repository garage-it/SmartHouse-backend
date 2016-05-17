/**
 * Populate DB with sample data on server start
 * to disable, edit config/env/%environment%.js, and set `seedDB: false`
 */

'use strict';
const mongoose = require('mongoose');
const Sensor = require('../API/sensors/sensor.model');
const Scenario = require('../API/scenarios/scenario.model');

const sensors = [];
const scenarios = [];


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

scenarios.push(new Scenario({
    name: 'some name',
    description: 'some description',
    body: 'alert(\'hello\');'
}));

scenarios.push(new Scenario({
    name: 'some other name',
    description: 'some other description',
    body: 'alert(\'hello\');'
}));

const seedData = {
    sensors: sensors.map((sensor) => sensor.toObject()),
    scenarios: scenarios.map((sensor) => sensor.toObject())
};

function populateSensors() {
    Sensor.find({}).remove(function() {
        Sensor.create(...sensors);
    });
}

function populateScenarios() {
    Scenario.find({}).remove(function() {
        Scenario.create(...scenarios);
    });
}

export {populateSensors, populateScenarios, seedData};
