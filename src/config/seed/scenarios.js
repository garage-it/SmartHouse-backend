import mongoose from 'mongoose';

import scenarioModel from '../../scenarios/scenario.model';

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

    return scenarios;
}

function populateScenarios() {
    scenarioModel.find({}).remove(function() {
        scenarioModel.create(...scenarios);
    });
}