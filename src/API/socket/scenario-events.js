import {stream as statusStream} from '../../data-streams/input';

export default function (io) {

    io.on('connection', onConnection);

    function onConnection(socket) {
        statusStream
            .filter((event) => event.event === 'scenario-status-change')
            .subscribe((event) => {
                socket.emit('scenario-status-change', event);
            });
    }
}
