import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { expect } from 'chai';
import proxyquire from 'proxyquire';
import Rx from 'rxjs/Rx';
import socketIoMocks from 'socket-io-mocks';

chai.use(sinonChai);
chai.config.includeStack = true;

describe('# Socket Device Events', () => {
    let input;
    let output;
    let socket;

    beforeEach(function(){

        socket = new socketIoMocks.socket();
        sinon.spy(socket, 'on');

        let streamConfig = {
            stream: new Rx.Subject(),
            write: sinon.stub()
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

        it('will subscribe to specific device events', () => {
            socket._handlers.subscribe({ device: 'a' });
            input.stream.next({ device: 'a', value: 1 });
            expect(socket.emit).to.have.been.calledWith('event', { device: 'a', value: 1 });
        });

        it('will filter out other device events', () => {
            socket._handlers.subscribe({ device: 'a' });
            input.stream.next({ device: 'a', value: 1 });
            input.stream.next({ device: 'c', value: 2 });
            input.stream.next({ device: 'a', value: 3 });
            expect(socket.emit).not.to.have.been.calledWith('event', { device: 'c', value: 2 });
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
            expect(output.write).to.have.been.calledWith({ device: config.device, value: config.value });
        });

    });

});