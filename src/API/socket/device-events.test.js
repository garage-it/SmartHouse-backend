import proxyquire from 'proxyquire';
import Rx from 'rxjs/Rx';
import socketIoMocks from 'socket-io-mocks';

describe('# Socket Device Events', () => {
    let input;
    let output;
    let socket;

    beforeEach(function(){

        socket = new socketIoMocks.socket();
        env.spy(socket, 'on');

        let streamConfig = {
            stream: new Rx.Subject(),
            write: env.stub()
        };

        input = streamConfig;
        output = streamConfig;

        let sut = proxyquire('./device-events', {
            '../../data-streams/input': input,
            '../../data-streams/output': output
        });

        let io = socketIoMocks.server()();
        sut(io);
        io._connect(socket);
    });

    describe('# Event Subscription', () => {

        it('will subscribe to \'status\' device events and pass it to socket', () => {
            socket._handlers.subscribe({ device: 'a' });
            input.stream.next({ event: 'status', device: 'a' });
            
            expect(socket.emit).to.have.been.calledWith('event', { event: 'status', device: 'a'});
        });

        it('will subscribe to \'device-add\' device events and pass it to socket', () => {
            socket._handlers.subscribe({ device: 'a' });
            input.stream.next({ event: 'device-add', device: 'b' });
            
            expect(socket.emit).to.have.been.calledWith('event', { event: 'device-add', device: 'b'});
        });

        it('will filter out other device events', () => {
            socket._handlers.subscribe({ device: 'a' });
            input.stream.next({ event: 'status', device: 'c'});
            input.stream.next({ event: 'faked', device: 'a'});
            
            expect(socket.emit).not.to.have.been.called;
        });

        it('will unsubscribe from events', () => {
            socket._handlers.subscribe({ device: 'a' });
            input.stream.next({ device: 'a', value: 1 });
            socket._handlers.unsubscribe({ device: 'a' });
            input.stream.next({ device: 'c', value: 2 });
            
            expect(socket.emit).not.to.have.been.calledWith('event', { device: 'a', value: 2 });
        });

        it('will write event to the stream', () => {
            let config = {
                device: 'mockDev',
                value: 'mockCommand'
            };
            socket.on.lastCall.args[1](config);
            
            expect(output.write).to.have.been.calledWith({
                event: 'status',
                device: config.device,
                value: config.value
            });
        });

    });

});