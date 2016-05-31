import mongoose from 'mongoose';

import scenarioModel from '../../scenarios/scenario.model';

export default { populateScenarios };

const scenarios = [];

scenarios.push(scenarioModel({
    _id: mongoose.Types.ObjectId('41224d776a326fb40f000002'),
    name: 'Greeting script',
    description: 'will greet you in a brand new world',
    body: 'console.log("Hello Scripto World!");'
}));


function populateScenarios() {
    scenarioModel.find({}).remove(function() {
        scenarioModel.create(...scenarios);
    });
}