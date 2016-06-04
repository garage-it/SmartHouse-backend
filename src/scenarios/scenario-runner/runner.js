const vm = require('vm');
const Rx = require('rxjs');
const scenarioApiManager = require('./scenario-api.manager');

const inputStream = new Rx.Subject();
const outputStream = new Rx.Subject();

outputStream
    .debounceTime(500)
    .subscribe((data) => {
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

process.on('message', (message) => {
    if (message.type === 'start') {
        vm.runInNewContext(message.content, sandbox);
    }
    else if (message.type === 'message') {
        inputStream.next(message.content);
    }
});
