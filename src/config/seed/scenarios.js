import mongoose from 'mongoose';

import scenarioModel from '../../scenarios/scenario.model';

export default {populateScenarios};

const scenarios = [];

scenarios.push(scenarioModel({
    _id: mongoose.Types.ObjectId('41224d776a326fb40f000002'),
    name: 'Greeting script',
    description: 'will greet you in a brand new world',
    active: true,
    wizard: {
        conditions: [{
            device: 'light',
            condition: 'GREATER_THAN',
            value: 5
        }, {
            device: 'temperature',
            condition: 'LESS_THAN',
            value: 19
        }],
        actions: [{
            device: 'air-conditioner',
            value: 'ON'
        }, {
            device: 'light',
            value: 'OFF'
        }],
        logicalOperator: 'OR'
    },
    isConvertable: true
}));

function populateScenarios() {
    scenarioModel.find({}).remove(function () {
        scenarioModel.create(...scenarios);
    });
}