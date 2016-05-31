var vm = require('vm');
var Rx = require('rxjs');


var input_stream = new Rx.Subject();
var output_stream = new Rx.Subject();

output_stream.subscribe((data) => {
    process.send({
        type: 'message',
        content: data
    });
});

const sandbox = {
    console,
    stream: {
        input: input_stream,
        output: output_stream.next.bind(output_stream)
    }
};

process.on('message', (message) => {
    if (message.type === 'start') {
        vm.runInNewContext(message.content, sandbox);
    }
    else if (message.type === 'message') {
        input_stream.next(message.content);
    }
});
