import mongoose from 'mongoose';
import { start } from './scenario.manager';

import Scenario from './scenario.model';

import Debugger from 'debug';

const debug = Debugger('scenarios:loader');

mongoose.connection.on('connected', function() {

    Scenario.findAsync({})
        .then(runAll)
        .error(logError);

    function runAll(scenarios){
        scenarios.forEach(scenario=>{
            start(scenario);
        });
    }

    function logError (...error){
        debug(...error);
    }

});
