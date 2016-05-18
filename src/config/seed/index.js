/**
 * Populate DB with sample data on server start
 * to disable, edit config/env/%environment%.js, and set `seedDB: false`
 */

'use strict';

const mongoose = require('mongoose');
const Sensor = require('../../API/sensors/sensor.model');

import scenarioModel from '../../scenarios/scenario.model';
import scenarioManager from '../../scenarios/scenario-manager.js';
import scenario_01 from './scenario_01';

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

scenarios.push({
    name: 'some name',
    description: 'some description',
    body: 'console.log("Hello Scripto World");'
});

scenarios.push(scenario_01);

const seedData = {
    sensors: sensors.map((sensor) => sensor.toObject()),
    scenarios
};

function populateSensors() {
    Sensor.find({}).remove(function() {
        Sensor.create(...sensors);
    });
}

function populateScenarios() {
    scenarioModel.find({}).remove(function() {
        console.log('CLEANED SCENARIOS');
        scenarios.forEach(scenarioManager.add);
    });
}

export {populateSensors, populateScenarios, seedData};
