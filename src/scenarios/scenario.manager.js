import {fork} from 'child_process';
import {stream as input_stream} from '../data-streams/input';
import {stream as output_stream} from '../data-streams/output';

const runningScenarios = new Map();

input_stream.subscribe(notifyScenarios);

function start(scenario) {
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
