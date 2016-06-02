import {fork} from 'child_process';
import {stream as input_stream} from '../data-streams/input';
import {stream as output_stream} from '../data-streams/output';

const runningScenarios = new Map();

input_stream.subscribe(notifyScenarios);

function run(scenario) {
    let scenarioProcess = fork(__dirname + '/runner');
    runningScenarios.set(scenario.id, scenarioProcess);
    scenarioProcess.send({
        type: 'start',
        content: scenario.body
    });

    scenarioProcess.on('message', ({type, content}) => {
        if (type === 'message') {
            output_stream.next(content);
        }
    });

    scenarioProcess.on('exit', () => runningScenarios.delete(scenario.id));
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
