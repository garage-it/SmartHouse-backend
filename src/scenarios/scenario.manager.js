import {fork} from 'child_process';

import {stream as input_stream} from '../data-streams/filtered.input';
import {stream as output_stream} from '../data-streams/output';

const runningScenarios = new Map();

input_stream.subscribe(notifyScenarios);

function run(scenario) {
    let scenarioProcess = fork(__dirname + '/scenario-runner/runner', [scenario.body]);
    runningScenarios.set(scenario.id, scenarioProcess);

    scenarioProcess.on('message', ({type, content}) => {
        if (type === 'message') {
            output_stream.next(content);
        }
    });

    scenarioProcess.on('exit', (code) => {
        //when we end the process manually, we do not send an error code, but it is present if the process ends itself
        var isKilledManually = code === null;

        runningScenarios.delete(scenario.id);

        if (!isKilledManually) {
            //update without callbacks returns a query. we can get rid of exec() if we pass some callback here or
            // use updateAsync, but we don`t need any callbacks here
            scenario.update({active: false}).exec();
        }
    });
}

function isRunning(scenario) {
    return runningScenarios.has(scenario.id);
}

function start(scenario) {
    if (isRunning(scenario)) {
        let scenarioProcess = runningScenarios.get(scenario.id);

        stop(scenario);
        scenarioProcess.on('exit', () => run(scenario));
    } else {
        run(scenario);
    }
}

function notifyScenarios(message) {
    runningScenarios.forEach((scenario) => {
        scenario.send({
            type: 'message',
            content: message
        });
    });
}

function stop(scenario) {
    let scenarioProcess = runningScenarios.get(scenario.id);
    if (scenarioProcess) {
        scenarioProcess.kill();
    }
}

export {stop, start};