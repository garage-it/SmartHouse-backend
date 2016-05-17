import mongoose from 'mongoose';

import scenarioModel from '../../scenarios/scenario.model';

import scenario_01 from './scenario_01';
import scenario_02 from './scenario_02';

const scenarios = _createScenarios();

export default { scenarios, populateScenarios };

function _createScenarios(){

    const scenarios = [];

    scenarios.push(scenarioModel({
        _id: mongoose.Types.ObjectId('41224d776a326fb40f000002'),
        name: 'Greeting script',
        description: 'will greet you in a brand new world',
        body: 'console.log("Hello Scripto World!");'
    }));

    scenarios.push(scenarioModel({
        _id: mongoose.Types.ObjectId('41224d776a326fb40f000003'),
        name: 'Temperature tracking script',
        description: 'will light a GPIO light when temperature rizes',
        body: scenario_01
    }));

    scenarios.push(scenarioModel({
        _id: mongoose.Types.ObjectId('41224d776a326fb40f000004'),
        name: 'Lit tracking script',
        description: 'will light both GPIO lights when light lowers',
        body: scenario_02
    }));

    return scenarios;
}

function populateScenarios() {
    scenarioModel.find({}).remove(function() {
        scenarioModel.create(...scenarios);
    });
}