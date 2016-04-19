import chai from 'chai';
import sinonChai from 'sinon-chai';
import { expect } from 'chai';
import proxyquire from 'proxyquire';
import Rx from 'rxjs/Rx';
import socketIoMocks from 'socket-io-mocks';

chai.use(sinonChai);
chai.config.includeStack = true;

describe('# Socket Device Events', () => {
    let input;
    let socket;

    beforeEach(function(){
        input = {
            stream: new Rx.Subject()
        };

        let sut = proxyquire('./device-events', {
            '../../data-streams/input': input
        });

        let io = socketIoMocks.server()();
        sut(io);
        socket = io._connect();
    });

    describe('# Event Subscription', () => {

        it('will subscribe to specific device events', function(){
            socket._handlers.subscribe({ device: 'a' });
            input.stream.next({ device: 'a', value: 1 });
            expect(socket.emit).to.have.been.calledWith('event', { device: 'a', value: 1 });
        });

        it('will filter out other device events', function(){
            socket._handlers.subscribe({ device: 'a' });
            input.stream.next({ device: 'a', value: 1 });
            input.stream.next({ device: 'c', value: 2 });
            input.stream.next({ device: 'a', value: 3 });
            expect(socket.emit).not.to.have.been.calledWith('event', { device: 'c', value: 2 });
        });

        it('will unsubscribe from events', function(){
            socket._handlers.subscribe({ device: 'a' });
            input.stream.next({ device: 'a', value: 1 });
            socket._handlers.unsubscribe({ device: 'a' });
            input.stream.next({ device: 'c', value: 2 });
            expect(socket.emit).not.to.have.been.calledWith('event', { device: 'a', value: 2 });
        });
    });

});