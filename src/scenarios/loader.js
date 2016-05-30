import mongoose from 'mongoose';
import { run } from './runner';

import Scenario from './scenario.model';

import Debugger from 'debug';

const debug = Debugger('scenarios:loader');

mongoose.connection.on('connected', function() {

    Scenario.findAsync({})
        .then(runAll)
        .error(logError);

    function runAll(scenarios){
        scenarios.forEach(scenario=>{
            run(scenario);
        });
    }

    function logError (...error){
        debug(...error);
    }

});
