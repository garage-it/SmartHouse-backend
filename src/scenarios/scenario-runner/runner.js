const vm = require('vm');
const Rx = require('rxjs');
const scenarioApiManager = require('./scenario-api.manager');

const inputStream = new Rx.Subject();
const outputStream = new Rx.Subject();

//0 comand arg is node, 1 is path to file
const argvScenarioBodyIndex = 2;

outputStream.subscribe((data) => {
    process.send({
        type: 'message',
        content: data
    });
});

const SMART_HOUSE = scenarioApiManager.create(inputStream, outputStream);

const sandbox = {
    setTimeout,
    console,
    SMART_HOUSE
};

vm.runInNewContext(process.argv[argvScenarioBodyIndex], sandbox);
