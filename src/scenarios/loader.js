import mongoose from 'mongoose';
import {start} from './scenario.manager';

import Scenario from './scenario.model';

import Debugger from 'debug';

const debug = Debugger('SH_BE:scenarios:loader');

mongoose.connection.on('connected', function () {

    const AUTORUNNING_SCRIPTS = false;

    if (AUTORUNNING_SCRIPTS) {
        Scenario.findAsync({})
            .then(runAll)
            .error(logError);
    }

    function runAll(scenarios) {
        scenarios.forEach(scenario=> {
            if (scenario.active) {
                start(scenario);
            }
        });
    }

    function logError(...error) {
        debug(...error);
    }
});
