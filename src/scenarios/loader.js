/*eslint-disable */

// load all scripts from DB
// start their execution?

import vm from 'vm';

import { stream as input_stream } from '../data-streams/input';
import { write as output_stream } from '../data-streams/output';

import scenario from './scenario_01';
let scenarios = [scenario];

scenarios.forEach(scenario=>{
    const sandbox = {
        console,
        stream: {
            input: input_stream,
            output: output_stream
        }
    };

    console.log('running ', scenario);

    // TODO: run this in a separate thread
    // according to https://nodejs.org/api/vm.html#vm_vm_runinnewcontext_code_sandbox_options
    // safely running untrusted code requires a separate process.
    vm.runInNewContext(scenario, sandbox);
});

